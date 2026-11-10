import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const definition = JSON.parse(readFileSync(new URL('../definitions/software-refactoring.json', import.meta.url), 'utf8'));
const kinds = sections => sections.flatMap(section => [
  ...(section.item ? [section.item] : []),
  ...kinds(section.children ?? []),
]);
const ownerOf = kind => definition.deliverables.find(deliverable => kinds(deliverable.outline).includes(kind));
const allows = (from, to) => definition.rules.some(rule =>
  rule.type === 'cites' && rule.from === from && rule.to.includes(to));

// This checks the definition's declaration, not PaoBub's runtime or UI.
test('構成要素から変更単位への引用が成果物の uses と同じ上流を指す', () => {
  const items = new Map([
    ['CP-001', { kind: 'component' }],
    ['RF-001', { kind: 'change' }],
  ]);
  const citation = { from: 'CP-001', to: 'RF-001' };
  const from = items.get(citation.from).kind;
  const to = items.get(citation.to).kind;
  const downstream = ownerOf(from);
  const upstream = ownerOf(to);

  assert.equal(downstream.id, 'dependency-map');
  assert.equal(upstream.id, 'change-plan');
  assert.ok(downstream.uses.includes(upstream.id));
  assert.ok(allows(from, to), '下流CPから上流RFへの引用を許可する');
  assert.equal(allows(to, from), false, '逆向きRFからCPの旧規則を残さない');
});

test('構成図の達成条件が構成要素の引用規則を使う', () => {
  const acceptance = definition.acceptance.find(entry => entry.id === 'plan.structure');
  const rule = definition.rules.find(entry => entry.id === 'component-cites-change');
  assert.ok(rule, 'component-cites-change がある');
  assert.ok(acceptance.rules.includes(rule.id));
  assert.equal(acceptance.target, ownerOf(rule.from).id);
  assert.equal(definition.rules.some(entry => entry.id === 'change-cites-component'), false);
  for (const entry of definition.acceptance) {
    for (const id of entry.rules ?? []) {
      assert.ok(definition.rules.some(rule => rule.id === id), `規則の参照切れ: ${id}`);
    }
  }
});

test('背景の構成要素に引用を強制せず、既存の必須網羅を弱めない', () => {
  const rule = definition.rules.find(entry => entry.id === 'component-cites-change');
  assert.deepEqual(rule, { id: 'component-cites-change', type: 'cites', from: 'component', to: ['change'], min: 0 });
  for (const id of ['change-cites-finding', 'change-cites-contract']) {
    assert.equal(definition.rules.find(entry => entry.id === id).min, 1);
  }
  for (const id of ['change-covered-by-check', 'contract-covered-by-check']) {
    const coverage = definition.rules.find(entry => entry.id === id);
    assert.equal(coverage.type, 'covered');
    assert.deepEqual(coverage.by, ['check']);
    assert.notEqual(coverage.exempt, true);
  }
});

test('契約に関わる依存から契約への引用が、成果物の uses と同じ上流を指す', () => {
  const rule = definition.rules.find(entry => entry.id === 'dependency-cites-contract');
  assert.deepEqual(rule, { id: 'dependency-cites-contract', type: 'cites', from: 'dependency', to: ['contract'], min: 0 });
  const downstream = ownerOf('dependency'), upstream = ownerOf('contract');
  assert.equal(downstream.id, 'dependency-map');
  assert.equal(upstream.id, 'contract-ledger');
  assert.ok(downstream.uses.includes(upstream.id));
  assert.equal(allows('contract', 'dependency'), false, '逆向きCTからDPの規則を置かない');
  assert.ok(definition.acceptance.find(entry => entry.id === 'plan.structure').rules.includes(rule.id));
});
