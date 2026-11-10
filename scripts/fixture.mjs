// 作品の見本（fixture）を、その定義の項目・引用・網羅の規則に照らして検査する。
// 確かめるのは AI が確かめる構造の条件（ID の形・置き場・引用切れ・引用の向き・最低数・網羅・固定した版）だけ。
// 作品の出来や、人が確かめる達成条件は確かめない。道具の保存形式やファイル配置とは別の、道具に依らない形。

const pattern = (idForm) => new RegExp('^' + idForm.replace(/[.*+?^$()|[\]\\]/g, '\\$&')
  .replace('{nnn}', '\\d{3}').replace('{nn}', '\\d{2}').replace('{n}', '\\d+') + '$');
const kindsOf = (secs) => (secs ?? []).flatMap((s) => [...(s.item ? [s.item] : []), ...kindsOf(s.children)]);
const ENTRY = ['items', 'note', 'skipped'];
const ITEM = ['id', 'name', 'version', 'cites'];
const REF = /\b[A-Z]{2}-\d{2,3}\b/g;
// 値そのものが ID（と任意の固定した版）である欄。文章の欄とは分けて、値の全体を確かめる
const REF_FIELDS = ['in', 'from', 'to', 'chapter', 'page'];
const WHOLE = /^([^@\s]+)(?:@([1-9]\d*))?$/;

export function checkFixture(def, fx) {
  const problems = [];
  const need = (cond, msg) => { if (!cond) problems.push(msg); };
  if (!fx || typeof fx !== 'object') return ['fixture が無い'];
  need(fx.fixture === 1, 'fixture は 1');
  for (const k of ['id', 'title', 'purpose']) need(typeof fx[k] === 'string' && fx[k], `${k} が無い`);
  need(fx.definition?.id === def.id, `定義が違う: ${fx.definition?.id}（${def.id} が要る）`);
  need(fx.definition?.version === def.version, `定義の版が違う: ${fx.definition?.version}（今は ${def.version}）`);

  const forms = (def.items ?? []).map((it) => ({ kind: it.id, re: pattern(it.idForm) }));
  const kindOfId = (id) => forms.find((f) => f.re.test(id))?.kind;
  const owner = new Map();
  for (const d of def.deliverables ?? []) for (const k of kindsOf(d.outline)) owner.set(k, d.id);

  // 成果物：定義のすべての成果物について、項目・覚え書き・省いた理由のどれかを書く
  const entries = fx.deliverables ?? {};
  const D = new Set((def.deliverables ?? []).map((d) => d.id));
  for (const id of Object.keys(entries)) need(D.has(id), `成果物 ${id} は定義に無い`);
  const items = new Map();
  for (const d of def.deliverables ?? []) {
    const e = entries[d.id];
    if (!e || typeof e !== 'object') { problems.push(`成果物 ${d.id} が無い（省くなら skipped に理由を書く）`); continue; }
    for (const k of Object.keys(e)) need(ENTRY.includes(k), `成果物 ${d.id}: 知らない欄 ${k}`);
    if (e.skipped !== undefined) {
      need(typeof e.skipped === 'string' && e.skipped, `成果物 ${d.id}: skipped には省いた理由を書く`);
      need(e.items === undefined, `成果物 ${d.id}: 省いた成果物に項目がある`);
      continue;
    }
    const own = new Set(kindsOf(d.outline));
    if (e.items === undefined) { need(typeof e.note === 'string' && e.note, `成果物 ${d.id}: 項目か note か skipped が要る`); continue; }
    need(own.size > 0, `成果物 ${d.id}: 項目の種類が無い成果物に items がある（note に書く）`);
    need(Array.isArray(e.items), `成果物 ${d.id}: items は配列`);
    for (const it of Array.isArray(e.items) ? e.items : []) {
      const kind = kindOfId(it?.id ?? '');
      if (!kind) { problems.push(`成果物 ${d.id}: ID ${it?.id} は定義のどの項目の形にも合わない`); continue; }
      need(owner.get(kind) === d.id, `${it.id}: ${kind} は成果物 ${owner.get(kind)} に置く（今 ${d.id}）`);
      need(!items.has(it.id), `${it.id}: ID が重なっている`);
      need(typeof it.name === 'string' && it.name, `${it.id}: name が無い`);
      need(it.version === undefined || (Number.isInteger(it.version) && it.version >= 1), `${it.id}: version は 1 以上の整数`);
      need(it.cites === undefined || Array.isArray(it.cites), `${it.id}: cites は配列`);
      items.set(it.id, { ...it, kind });
    }
  }

  // 引用：引用先がある・固定した版がある・規則の向きに合う・最低数を満たす
  const rules = def.rules ?? [];
  const keep = new Map((fx.keepOld ?? []).map((k, i) => [`${k.item} ${k.cite}`, { ...k, i, used: false }]));
  const citedBy = new Map();
  for (const it of items.values()) {
    const counts = new Map();
    for (const ref of Array.isArray(it.cites) ? it.cites : []) {
      const m = typeof ref === 'string' ? WHOLE.exec(ref) : null;
      if (!m || !kindOfId(m[1])) { problems.push(`${it.id}: 引用 ${ref} は ID（と @版）の形でない`); continue; }
      const id = m[1], v = m[2] === undefined ? undefined : Number(m[2]);
      const to = items.get(id);
      if (!to) { problems.push(`${it.id}: 引用先 ${ref} が無い`); continue; }
      if (v !== undefined) {
        const cur = to.version ?? 1;
        need(Number.isInteger(v) && v >= 1 && v <= cur, `${it.id}: ${ref} の版が無い（${id} は版 ${cur} まで）`);
        if (v < cur) {
          const k = keep.get(`${it.id} ${ref}`);
          if (k) k.used = true; else problems.push(`${it.id}: ${ref} は ${id} の古い版（今は版 ${cur}）。維持するなら keepOld に理由を書く`);
        }
      }
      const allowed = rules.some((r) => r.type === 'cites' && r.from === it.kind && r.to.includes(to.kind));
      need(allowed, `${it.id}: ${it.kind} → ${to.kind} の引用の規則が無い（${ref}）`);
      counts.set(to.kind, (counts.get(to.kind) ?? 0) + 1);
      if (!citedBy.has(id)) citedBy.set(id, []);
      citedBy.get(id).push(it);
    }
    for (const r of rules.filter((r) => r.type === 'cites' && r.from === it.kind)) {
      const n = r.to.reduce((s, k) => s + (counts.get(k) ?? 0), 0);
      need(n >= r.min, `${it.id}: 規則 ${r.id} で ${r.to.join('・')} を ${r.min} 件以上引用する（今 ${n} 件）`);
    }
    // 参照の欄（in・from・to など）は値の全体を「ID＋任意の版」として確かめる
    for (const k of REF_FIELDS.filter((k) => it[k] !== undefined)) {
      for (const ref of [it[k]].flat()) {
        const m = typeof ref === 'string' ? WHOLE.exec(ref) : null;
        const to = m && kindOfId(m[1]) ? items.get(m[1]) : undefined;
        if (!m || !kindOfId(m[1])) { problems.push(`${it.id}: 欄 ${k} の ${ref} は ID（と @版）の形でない`); continue; }
        need(!!to && (m[2] === undefined || Number(m[2]) <= (to.version ?? 1)), `${it.id}: 欄 ${k} の ${ref} が無い`);
      }
    }
    // 文章の欄に書いた ID も引用切れを確かめる
    for (const [k, val] of Object.entries(it)) {
      if (ITEM.includes(k) || REF_FIELDS.includes(k) || k === 'kind') continue;
      for (const s of [val].flat().filter((x) => typeof x === 'string')) for (const id of s.match(REF) ?? []) {
        if (kindOfId(id)) need(items.has(id), `${it.id}: 欄 ${k} の ${id} が無い`);
      }
    }
  }
  for (const k of keep.values()) {
    need(typeof k.reason === 'string' && k.reason, `keepOld[${k.i}]: 理由が無い`);
    need(k.used, `keepOld[${k.i}]: ${k.item} は ${k.cite} を古い版として引用していない`);
  }

  // 網羅：引用されていない項目は、除ける規則（exempt）に理由を書いたときだけ許す
  const ex = new Map((fx.exceptions ?? []).map((x, i) => [`${x.rule} ${x.item}`, { ...x, i, used: false }]));
  for (const r of rules.filter((r) => r.type === 'covered')) {
    for (const it of [...items.values()].filter((x) => x.kind === r.of)) {
      if ((citedBy.get(it.id) ?? []).some((b) => r.by.includes(b.kind))) continue;
      const x = ex.get(`${r.id} ${it.id}`);
      if (x) x.used = true;
      if (x && r.exempt) continue;
      problems.push(`${it.id}: 規則 ${r.id} で ${r.by.join('・')} から引用されていない${x ? '（この規則は除けない）' : ''}`);
    }
  }
  for (const x of ex.values()) {
    need(typeof x.reason === 'string' && x.reason, `exceptions[${x.i}]: 理由が無い`);
    need(x.used, `exceptions[${x.i}]: 規則 ${x.rule} の ${x.item} は除く必要が無いか、除けない`);
  }
  return problems;
}
