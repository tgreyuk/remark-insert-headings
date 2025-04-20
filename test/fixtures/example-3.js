import fs from 'node:fs/promises';
import { remark } from 'remark';
import remarkToc from 'remark-toc';
import remarkInsertHeadings from '../../dist/index.js';

export default async function getExample() {
  const document = await fs.readFile('./test/fixtures/input-3.md', 'utf8');
  const file = await remark()
    .use(remarkInsertHeadings, {
      text: 'Contents',
      depth: 2,
      position: 'start',
      minHeadingCount: 1,
    })
    .use(remarkToc)
    .process(document);
  return String(file);
}
