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
