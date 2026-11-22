import { createHash } from 'node:crypto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { check } from '../src/check.mjs';
const novel = JSON.parse(readFileSync(new URL('../definitions/fiction-novel.json', import.meta.url)));
const fixture = () => ({
  format: 1, id: 'manga-contract', version: '1.0.0', title: '漫画', purpose: '検証',
  phases: [{ id: 'make', name: '作る', purpose: '作る', after: [], deliverables: ['pages'], acceptance: ['read'] }],
  deliverables: [{ id: 'pages', name: 'ページ', form: '漫画', outline: [{ heading: 'ページ', describe: '内容', item: 'page' }] }],
  items: [{ id: 'page', name: 'ページ', idForm: 'P{nn}' }],
  rules: [{ id: 'links', type: 'cites', from: 'page', to: ['page'], min: 0 }],
  acceptance: [{ id: 'read', text: '読む', checkedBy: '人', target: 'pages' }],
});
test('published definitions pass the shared validator', () => {
  for (const file of readdirSync(new URL('../definitions/', import.meta.url))) {
    assert.deepEqual(check(JSON.parse(readFileSync(new URL('../definitions/' + file, import.meta.url)))), [], file);
  }
});
test('archived definitions retain their pinned bytes, identity and version', () => {
  for (const [id, version, sha] of [
    ['japan-company-establishment', '1.0.0', 'bf5dfa49b83547b6d3277e78f621be7cdf4e084e97072d0e76cb80bbc63995f8'],
    ['fiction-novel', '1.1.0', 'bedb11ddc03df78174e42bd0a19804db590b48778a116208a3ab21425ac9d80e'],
    ['fiction-manga', '1.0.0', 'f5d6c93bdd22ac327ede713d69613f66a3ad30e1e4c2c4d9d48aeda06ea956ba'],
  ]) {
    const bytes = readFileSync(new URL(`../archive/${sha.slice(0, 8)}/definitions/${id}.json`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), sha);
    const definition = JSON.parse(bytes);
    assert.deepEqual([definition.id, definition.version], [id, version]);
    assert.deepEqual(check(definition), []);
  }
});
test('seven declared views are independent of Host capabilities', () => {
  for (const view of [
    { as: 'graph', nodes: ['page'] }, { as: 'kanban', items: 'page', groupBy: 'state' },
    { as: 'timeline', items: 'page', start: 'start', end: 'end' }, { as: 'calendar', items: 'page', date: 'date' },
    { as: 'table', items: 'page' }, { as: 'form', items: 'page' }, { as: 'matrix', rows: 'page', columns: 'page' },
  ]) {
    const d = fixture(); d.deliverables[0].view = view;
    assert.deepEqual(check(d), [], view.as);
  }
  assert.deepEqual(check(novel), []);
});
test('unknown editor fields and malformed nested input fail without mutation or exceptions', () => {
  for (const value of [null, [], 0, {}, { ...fixture(), phases: 'bad' }, { ...fixture(), deliverables: [null] }]) {
    assert.ok(check(value).length);
  }
  for (const key of ['editor', 'exports']) {
    const d = fixture(); d.deliverables[0][key] = key === 'editor' ? 'design' : ['pdf'];
    const before = JSON.stringify(d);
    assert.ok(check(d).some(message => message.includes(key)));
    assert.equal(JSON.stringify(d), before);
  }
});
test('native-free semantic checks reject missing references and cyclic prerequisites', () => {
  const missing = fixture(); missing.phases[0].deliverables = ['absent'];
  assert.ok(check(missing).some(m => m.includes('absent')));
  const cycle = fixture(); cycle.phases[0].after = ['make'];
  assert.ok(check(cycle).some(m => m.includes('循環')));
  const matrix = fixture(); matrix.deliverables[0].view = { as: 'matrix', rows: 'page', columns: 'page' }; matrix.rules = [];
  assert.ok(check(matrix).some(m => m.includes('引用')));
});
test('import does not scan files, print output, or exit the consuming process', () => {
  const run = spawnSync(process.execPath, ['--disallow-code-generation-from-strings', '--input-type=module', '-e', "import { check } from 'workflow-definitions'; console.log(check(null).length > 0 ? 'alive' : 'bad')"], { cwd: new URL('..', import.meta.url), encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr); assert.equal(run.stdout.trim(), 'alive');
});
test('human conditions may name approver roles and a count', () => {
  const d = fixture();
  d.roles = [{ id: 'board', name: '会議の構成員', text: '続けるかを決める' }];
  d.acceptance[0].approvers = { roles: ['board'], count: 2 };
  assert.deepEqual(check(d), []);
  const once = fixture(); once.roles = [{ id: 'board', name: '会議' }]; once.acceptance[0].approvers = { roles: ['board'] };
  assert.deepEqual(check(once), []);
});
test('approver roles are checked against the definition', () => {
  const ai = fixture(); ai.roles = [{ id: 'board', name: '会議' }]; ai.acceptance.push({ id: 'auto', text: '機械', checkedBy: 'AI', target: 'pages', approvers: { roles: ['board'] } });
  ai.phases[0].acceptance.push('auto');
  assert.ok(check(ai).some((m) => m.includes('人の条件にだけ')));
  const missing = fixture(); missing.acceptance[0].approvers = { roles: ['nobody'] };
  assert.ok(check(missing).some((m) => m.includes('nobody')));
  const zero = fixture(); zero.roles = [{ id: 'board', name: '会議' }]; zero.acceptance[0].approvers = { roles: ['board'], count: 0 };
  assert.ok(check(zero).length);
  const empty = fixture(); empty.roles = [{ id: 'board', name: '会議' }]; empty.acceptance[0].approvers = { roles: [] };
  assert.ok(check(empty).length);
  const unused = fixture(); unused.roles = [{ id: 'board', name: '会議' }];
  assert.ok(check(unused).some((m) => m.includes('使われていない')));
  const dup = fixture(); dup.roles = [{ id: 'board', name: '会議' }, { id: 'board', name: '会議2' }]; dup.acceptance[0].approvers = { roles: ['board'] };
  assert.ok(check(dup).some((m) => m.includes('重なっている')));
  const extra = fixture(); extra.roles = [{ id: 'board', name: '会議' }]; extra.acceptance[0].approvers = { roles: ['board'], people: ['石田'] };
  assert.ok(check(extra).length);
});
