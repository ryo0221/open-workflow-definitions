import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { checkFixture } from '../scripts/fixture.mjs';

// 作品の見本を定義の規則に照らす。AI が確かめる構造の条件だけで、作品の出来や人の判断は確かめない。
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const def = (id) => read(`../definitions/${id}.json`);
const fx = (id, name) => read(`../fixtures/${id}/${name}.json`);
const item = (f, id) => Object.values(f.deliverables).flatMap((e) => e.items ?? []).find((x) => x.id === id);
const has = (problems, text) => problems.some((p) => p.includes(text));

test('収録した見本は、今の版の定義の規則をすべて満たす', () => {
  for (const id of readdirSync(new URL('../fixtures/', import.meta.url))) {
    for (const file of readdirSync(new URL(`../fixtures/${id}/`, import.meta.url))) {
      assert.deepEqual(checkFixture(def(id), read(`../fixtures/${id}/${file}`)), [], `${id}/${file}`);
    }
  }
});

test('絵を使わない小説は、画作りの成果物を理由つきで省いて成り立つ', () => {
  const f = fx('fiction-novel', 'short-story');
  for (const d of ['art-guide', 'character-art', 'world-map', 'stage-art', 'storyboard']) assert.ok(f.deliverables[d].skipped, d);
  const g = structuredClone(f); g.deliverables['art-guide'] = { skipped: '' };
  assert.ok(has(checkFixture(def('fiction-novel'), g), 'skipped には省いた理由'));
  delete g.deliverables['art-guide'];
  assert.ok(has(checkFixture(def('fiction-novel'), g), '成果物 art-guide が無い'));
});

test('引用切れ・規則に無い向き・最低数の不足を見つける', () => {
  const d = def('fiction-novel');
  const broken = structuredClone(fx('fiction-novel', 'short-story'));
  item(broken, 'CP-01').cites.push('SC-099');
  assert.ok(has(checkFixture(d, broken), '引用先 SC-099 が無い'));

  const reversed = structuredClone(fx('fiction-novel', 'short-story'));
  item(reversed, 'CH-01').cites = ['SC-001'];
  assert.ok(has(checkFixture(d, reversed), 'character → scene の引用の規則が無い'));

  const few = structuredClone(fx('fiction-novel', 'short-story'));
  item(few, 'OC-001').cites = [];
  assert.ok(has(checkFixture(d, few), '規則 occurrence-cites-scene'));

  const field = structuredClone(fx('fiction-manga', 'four-pages'));
  item(field, 'PN-001').in = 'PG-009';
  assert.ok(has(checkFixture(def('fiction-manga'), field), '欄 in の PG-009 が無い'));
  for (const bad of ['PG-001@0', 'PG-01', 'PG-9999', 'PG-001@-1', 'PG-001@1.5']) {
    item(field, 'PN-001').in = bad;
    assert.ok(checkFixture(def('fiction-manga'), field).some((p) => p.startsWith('PN-001: 欄 in')), bad);
  }
});

test('引用の値の全体を「ID（@版）」として確かめる', () => {
  for (const bad of ['SC-001@1@999', 'SC-001@0x1', 'SC-001@', 'SC-01']) {
    const f = structuredClone(fx('fiction-manga', 'four-pages'));
    item(f, 'PN-001').cites = [bad, 'DL-001'];
    assert.ok(checkFixture(def('fiction-manga'), f).some((p) => p.startsWith('PN-001: 引用')), bad);
  }
});

test('cites が配列でなければ、止まらずに知らせる', () => {
  const f = structuredClone(fx('fiction-manga', 'four-pages'));
  item(f, 'PN-001').cites = { source: 'SC-001' };
  assert.ok(has(checkFixture(def('fiction-manga'), f), 'PN-001: cites は配列'));
});

test('小説の見本：今作で描く筋は引用し、描かない筋だけを除く', () => {
  const f = fx('fiction-novel', 'short-story');
  assert.ok(item(f, 'SC-003').cites.includes('PT-02'));
  assert.deepEqual(f.exceptions.map((x) => x.item), ['PT-03']);
});

test('items が配列でなければ、中身を黙って捨てずに知らせる', () => {
  const f = structuredClone(fx('fiction-manga', 'four-pages'));
  f.deliverables['art-guide'].items = { id: 'XX-01', name: '配列でない' };
  assert.ok(has(checkFixture(def('fiction-manga'), f), '成果物 art-guide: items は配列'));
});

test('ID の形と置き場を確かめる', () => {
  const f = structuredClone(fx('fiction-novel', 'short-story'));
  f.deliverables['scene-cards'].items.push({ id: 'CH-09', name: '置き場違い' });
  f.deliverables['scene-cards'].items.push({ id: 'XX-01', name: '形違い' });
  f.deliverables['scene-cards'].items.push({ ...item(f, 'SC-001') });
  const p = checkFixture(def('fiction-novel'), f);
  assert.ok(has(p, 'CH-09: character は成果物 character-sheet に置く'));
  assert.ok(has(p, 'XX-01 は定義のどの項目の形にも合わない'));
  assert.ok(has(p, 'SC-001: ID が重なっている'));
});

test('網羅：除ける規則だけ理由つきで除け、除けない規則や使わない例外は問題にする', () => {
  const d = def('fiction-manga');
  const uncovered = structuredClone(fx('fiction-manga', 'four-pages'));
  uncovered.exceptions = [];
  assert.ok(has(checkFixture(d, uncovered), 'DL-005: 規則 dialogue-covered'));

  const scene = structuredClone(fx('fiction-manga', 'four-pages'));
  for (const id of ['PN-005', 'PN-006', 'PN-007']) item(scene, id).cites = item(scene, id).cites.filter((c) => c !== 'SC-002').concat('SC-001');
  scene.exceptions.push({ rule: 'scene-covered', item: 'SC-002', reason: '除きたい' });
  assert.ok(has(checkFixture(d, scene), 'SC-002: 規則 scene-covered で panel から引用されていない（この規則は除けない）'));

  const unused = structuredClone(fx('fiction-manga', 'four-pages'));
  unused.exceptions.push({ rule: 'thread-covered', item: 'PT-01', reason: '要らない' });
  assert.ok(has(checkFixture(d, unused), '除く必要が無いか'));

  const noReason = structuredClone(fx('fiction-manga', 'four-pages'));
  noReason.exceptions[0].reason = '';
  assert.ok(has(checkFixture(d, noReason), '理由が無い'));
});

test('二画風：画風が違っても人物・場所・ラフの正本は一つ', () => {
  const f = fx('fiction-manga', 'two-styles');
  const ids = (prefix) => Object.values(f.deliverables).flatMap((e) => e.items ?? []).filter((x) => x.id.startsWith(prefix));
  assert.equal(ids('CH-').length, 2);
  assert.equal(ids('LO-').length, 2);
  assert.equal(ids('SC-').length, 2);
  assert.deepEqual([...new Set(ids('SM-').map((x) => x.style))].sort(), ['1980年代劇画調', '柔らかいアニメ調']);
  assert.equal(f.deliverables['rough-pages'].items, undefined, 'ラフは画風ごとに分けない');
});

test('橋の前後は出来事で分け、設定の訂正は版で分ける', () => {
  const d = def('fiction-manga');
  const f = fx('fiction-manga', 'two-styles');
  assert.ok(item(f, 'SC-001').cites.includes('EV-001@1'));
  assert.ok(item(f, 'SC-002').cites.includes('EV-002@1'));
  assert.ok(item(f, 'SC-001').cites.includes('LO-02@2') && item(f, 'SC-002').cites.includes('LO-02@2'), '前後とも同じ場所の ID');

  const noKeep = structuredClone(f); noKeep.keepOld = [];
  assert.ok(has(checkFixture(d, noKeep), 'OC-001: SC-001@1 は SC-001 の古い版'));

  const future = structuredClone(f); item(future, 'OC-002').cites = ['SC-002@3'];
  assert.ok(has(checkFixture(d, future), 'SC-002@3 の版が無い'));

  const stale = structuredClone(f); item(stale, 'OC-001').cites = ['SC-001@2'];
  assert.ok(has(checkFixture(d, stale), 'keepOld[0]: OC-001 は SC-001@1 を古い版として引用していない'));
});

test('見本の定義の版が今の定義と違えば知らせる', () => {
  const f = structuredClone(fx('fiction-novel', 'short-story'));
  f.definition.version = '1.1.0';
  assert.ok(has(checkFixture(def('fiction-novel'), f), '定義の版が違う'));
});
