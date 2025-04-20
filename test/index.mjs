import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import getExample1 from './fixtures/example-1.js';
import getExample2 from './fixtures/example-2.js';
import getExample3 from './fixtures/example-3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Asserts that the output of the example function matches the expected output.
 */
async function assertExample(example, outputFile) {
  const output = await fs.readFile(
    path.join(__dirname, `../test/fixtures/out/${outputFile}`),
    'utf8'
  );
  const actual = await example();
  assert.equal(
    actual,
    String(output),
    `Error: ${outputFile} does not match the expected output`
  );
}

assertExample(getExample1, 'output-1.md');
assertExample(getExample2, 'output-2.md');
assertExample(getExample3, 'output-3.md');
