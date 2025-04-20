import fs from 'node:fs/promises';
import { remark } from 'remark';
import remarkToc from 'remark-toc';

async function main() {
  const document = await fs.readFile('README.md', 'utf8');
  const file = await remark()
    .use(remarkToc, { maxDepth: 3, tight: true })
    .process(document);
  await fs.writeFile('README.md', String(file));
}

main();
