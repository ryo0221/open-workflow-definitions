// 定義の形と参照を検査する。依存なし。使い方: node scripts/check.mjs [定義のファイル…]
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(join(root, 'definitions')).filter((f) => f.endsWith('.json')).map((f) => join(root, 'definitions', f));

const ID = /^[a-z][a-z0-9-]*(\.[a-z0-9-]+)*$/;
const FORMS = ['文書', '表', '図', '画面', 'コード'];
const CHECKERS = ['人', 'AI'];

export function check(def) {
  const problems = [];
  const need = (cond, msg) => { if (!cond) problems.push(msg); };
  need(def.format === 1, 'format は 1');
  for (const k of ['id', 'version', 'title', 'purpose']) need(typeof def[k] === 'string' && def[k].length > 0, `${k} が無い`);
  need(ID.test(def.id ?? ''), `id の形が違う: ${def.id}`);
  need(/^\d+\.\d+\.\d+$/.test(def.version ?? ''), `version の形が違う: ${def.version}`);
  const allowed = new Set(['format', 'id', 'version', 'title', 'purpose', 'phases', 'deliverables', 'items', 'rules', 'acceptance']);
  for (const k of Object.keys(def)) need(allowed.has(k), `知らない欄: ${k}`);

  const phases = def.phases ?? [], deliverables = def.deliverables ?? [], acceptance = def.acceptance ?? [];
  const ids = new Set();
  for (const x of [...phases, ...deliverables, ...acceptance]) {
    need(ID.test(x.id ?? ''), `id の形が違う: ${x.id}`);
    need(!ids.has(x.id), `id が重なっている: ${x.id}`);
    ids.add(x.id);
  }
  const P = new Set(phases.map((p) => p.id)), D = new Set(deliverables.map((d) => d.id)), A = new Set(acceptance.map((a) => a.id));
  const items = def.items ?? [], rules = def.rules ?? [];
  const I = new Set(), R = new Set(), marked = new Map();
  for (const it of items) {
    need(ID.test(it.id ?? ''), `項目の種類の id の形が違う: ${it.id}`);
    need(!I.has(it.id), `項目の種類が重なっている: ${it.id}`);
    I.add(it.id);
    need(typeof it.idForm === 'string' && /\{(nnn|nn|n)\}/.test(it.idForm), `項目 ${it.id}: idForm に連番が無い`);
    need(!it.idForm?.includes('{parent}') || !!it.parent, `項目 ${it.id}: idForm に {parent} があるのに parent が無い`);
  }
  for (const it of items) if (it.parent) need(I.has(it.parent), `項目 ${it.id}: 親 ${it.parent} が無い`);
  const forms = items.filter((it) => !it.parent).map((it) => it.idForm);
  need(new Set(forms).size === forms.length, '親の無い項目の idForm が重なっている');
  for (const r of rules) {
    need(ID.test(r.id ?? '') && !R.has(r.id), `規則の id が違うか重なっている: ${r.id}`);
    R.add(r.id);
    if (r.type === 'cites') {
      need(I.has(r.from), `規則 ${r.id}: from ${r.from} が無い`);
      need((r.to ?? []).length > 0 && r.to.every((t) => I.has(t)), `規則 ${r.id}: to に無い項目がある`);
      need(Number.isInteger(r.min) && r.min >= 1, `規則 ${r.id}: min は 1 以上`);
    } else if (r.type === 'covered') {
      need(I.has(r.of), `規則 ${r.id}: of ${r.of} が無い`);
      need((r.by ?? []).length > 0 && r.by.every((t) => I.has(t)), `規則 ${r.id}: by に無い項目がある`);
    } else problems.push(`規則 ${r.id}: type は cites・covered のどれか`);
  }

  for (const p of phases) {
    for (const k of ['name', 'purpose']) need(typeof p[k] === 'string' && p[k], `工程 ${p.id}: ${k} が無い`);
    for (const a of p.after ?? []) need(P.has(a), `工程 ${p.id}: after の ${a} が無い`);
    need((p.deliverables ?? []).length > 0, `工程 ${p.id}: 成果物が無い`);
    need((p.acceptance ?? []).length > 0, `工程 ${p.id}: 達成条件が無い`);
    for (const d of p.deliverables ?? []) need(D.has(d), `工程 ${p.id}: 成果物 ${d} が無い`);
    for (const a of p.acceptance ?? []) need(A.has(a), `工程 ${p.id}: 達成条件 ${a} が無い`);
    for (const a of p.acceptance ?? []) {
      const t = acceptance.find((x) => x.id === a)?.target;
      need(!t || (p.deliverables ?? []).includes(t), `工程 ${p.id}: 達成条件 ${a} の対象 ${t} がこの工程の成果物でない`);
    }
  }
  for (const d of deliverables) {
    need(FORMS.includes(d.form), `成果物 ${d.id}: form は ${FORMS.join('・')} のどれか`);
    need((d.outline ?? []).length > 0, `成果物 ${d.id}: outline が無い`);
    const walk = (secs, depth) => {
      need(depth <= 4, `成果物 ${d.id}: 見出しが 4 段より深い`);
      const seen = new Set();
      for (const s of secs ?? []) {
        need(typeof s.heading === 'string' && s.heading && typeof s.describe === 'string' && s.describe, `成果物 ${d.id}: 見出しに heading と describe が要る`);
        need(!seen.has(s.heading), `成果物 ${d.id}: 同じ段で見出しが重なっている: ${s.heading}`);
        seen.add(s.heading);
        for (const k of Object.keys(s)) need(['heading', 'describe', 'item', 'repeat', 'children'].includes(k), `成果物 ${d.id}: 見出しの知らない欄: ${k}`);
        if (s.item) { need(I.has(s.item), `成果物 ${d.id}: 見出し ${s.heading} の項目 ${s.item} が items に無い`); marked.set(s.item, (marked.get(s.item) ?? 0) + 1); }
        if (s.children) walk(s.children, depth + 1);
      }
    };
    walk(d.outline, 1);
    for (const u of d.uses ?? []) need(D.has(u), `成果物 ${d.id}: uses の ${u} が無い`);
    need(phases.some((p) => (p.deliverables ?? []).includes(d.id)), `成果物 ${d.id}: どの工程も作らない`);
  }
  for (const it of items) need(marked.get(it.id) === 1, `項目 ${it.id}: どれか一つの見出しに item として置く（今 ${marked.get(it.id) ?? 0} か所）`);
  for (const a of acceptance) for (const r of a.rules ?? []) need(R.has(r), `達成条件 ${a.id}: 規則 ${r} が無い`);
  for (const a of acceptance) {
    need(CHECKERS.includes(a.checkedBy), `達成条件 ${a.id}: checkedBy は 人・AI のどれか`);
    need(D.has(a.target), `達成条件 ${a.id}: 対象 ${a.target} が無い`);
    need(phases.some((p) => (p.acceptance ?? []).includes(a.id)), `達成条件 ${a.id}: どの工程でも使われていない`);
  }
  for (const p of phases) {
    const human = (p.acceptance ?? []).some((a) => acceptance.find((x) => x.id === a)?.checkedBy === '人');
    need(human, `工程 ${p.id}: 人が確かめる達成条件が無い`);
  }
  // 工程の順の循環
  const state = new Map();
  const visit = (id, path) => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) { problems.push(`工程の順が循環している: ${[...path, id].join(' → ')}`); return; }
    state.set(id, 1);
    for (const a of phases.find((p) => p.id === id)?.after ?? []) visit(a, [...path, id]);
    state.set(id, 2);
  };
  for (const p of phases) visit(p.id, []);
  return problems;
}

let failed = 0;
for (const f of files) {
  const def = JSON.parse(readFileSync(f, 'utf8'));
  const problems = check(def);
  const name = f.replace(root + '/', '');
  if (problems.length) { failed++; console.log(`✗ ${name}`); for (const p of problems) console.log(`  - ${p}`); }
  else console.log(`✓ ${name}（工程 ${def.phases.length}・成果物 ${def.deliverables.length}・達成条件 ${def.acceptance.length}）`);
}
process.exit(failed ? 1 : 0);
