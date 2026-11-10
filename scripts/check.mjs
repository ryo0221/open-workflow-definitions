// 共通モジュールで定義の形と参照を検査する。引数が無いときは作品の見本も検査する。実行時依存なし。使い方: node scripts/check.mjs [定義のファイル…]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(join(root, 'definitions')).filter((f) => f.endsWith('.json')).map((f) => join(root, 'definitions', f));

export { check } from '../src/check.mjs';
import { check } from '../src/check.mjs';

let failed = 0;
for (const f of files) {
  const def = JSON.parse(readFileSync(f, 'utf8'));
  const problems = check(def);
  const name = f.replace(root + '/', '');
  if (problems.length) { failed++; console.log(`✗ ${name}`); for (const p of problems) console.log(`  - ${p}`); }
  else console.log(`✓ ${name}（工程 ${def.phases.length}・まとまり ${def.sections?.length ?? 0}・成果物 ${def.deliverables.length}・達成条件 ${def.acceptance.length}）`);
}
// 引数が無いときは、作品の見本（fixtures/<定義の id>/*.json）も、その定義に照らして検査する
if (!process.argv.slice(2).length) {
  const { checkFixture } = await import('./fixture.mjs');
  const dir = join(root, 'fixtures');
  for (const id of existsSync(dir) ? readdirSync(dir) : []) {
    const def = JSON.parse(readFileSync(join(root, 'definitions', `${id}.json`), 'utf8'));
    for (const f of readdirSync(join(dir, id)).filter((x) => x.endsWith('.json'))) {
      const fx = JSON.parse(readFileSync(join(dir, id, f), 'utf8'));
      const problems = checkFixture(def, fx);
      const name = `fixtures/${id}/${f}`;
      if (problems.length) { failed++; console.log(`✗ ${name}`); for (const p of problems) console.log(`  - ${p}`); }
      else console.log(`✓ ${name}（${def.id}@${def.version}・項目 ${Object.values(fx.deliverables).reduce((n, e) => n + (e.items?.length ?? 0), 0)}・省いた成果物 ${Object.values(fx.deliverables).filter((e) => e.skipped).length}）`);
    }
  }
}
process.exit(failed ? 1 : 0);
