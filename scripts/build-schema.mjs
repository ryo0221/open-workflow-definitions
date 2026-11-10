import { build } from 'esbuild';
import Ajv from 'ajv/dist/2020.js';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { readFileSync, writeFileSync } from 'node:fs';
const schema = JSON.parse(readFileSync(new URL('../schema/definition.schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false, code: { source: true, esm: true } });
const validate = ajv.compile(schema);
const generated = '// Generated from schema/definition.schema.json by npm run schema:build.\n' + standaloneCode(ajv, { validate: schema.$id });
const bundled = await build({ stdin: { contents: generated, resolveDir: process.cwd(), sourcefile: 'schema-validator.mjs' }, bundle: true, platform: 'browser', format: 'esm', write: false });
const source = '// Generated from schema/definition.schema.json; do not edit.\n' + bundled.outputFiles[0].text;
const output = new URL('../src/schema-validator.mjs', import.meta.url);
if (process.argv.includes('--check')) {
  if (readFileSync(output, 'utf8') !== source) throw Error('Schema validator is stale; run npm run schema:build');
} else writeFileSync(output, source);
