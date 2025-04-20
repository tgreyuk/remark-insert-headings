import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import getExample1 from './example-1.js';
import getExample2 from './example-2.js';
import getExample3 from './example-3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.mkdirSync(path.join(__dirname, 'out'));

async function main() {
  const example1 = await getExample1();
  fs.writeFileSync(path.join(__dirname, './out/output-1.md'), example1);
  const example2 = await getExample2();
  fs.writeFileSync(path.join(__dirname, './out/output-2.md'), example2);
  const example3 = await getExample3();
  fs.writeFileSync(path.join(__dirname, './out/output-3.md'), example3);
}

main();
