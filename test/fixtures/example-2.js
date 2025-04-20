import fs from 'node:fs/promises';
import { remark } from 'remark';
import remarkLicense from 'remark-license';
import remarkToc from 'remark-toc';
import remarkInsertHeadings from '../../dist/index.js';

export default async function getExample() {
  const document = await fs.readFile('./test/fixtures/input-2.md', 'utf8');

  const file = await remark()
    .use(remarkInsertHeadings, [
      {
        text: 'Contents',
        position: 'start',
      },
      {
        text: 'Contributors',
        position: 'end',
      },
      {
        text: 'License',
        position: 'end',
      },
    ])
    .use(remarkToc)
    .use(remarkLicense)
    .process(document);

  return String(file);
}
