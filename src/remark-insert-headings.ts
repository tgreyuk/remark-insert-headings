import { Root, RootContent } from 'mdast';
import { Option } from 'types.js';
import { EXIT, visit } from 'unist-util-visit';

export default function remarkInsertHeadings(options: Option | Option[]) {
  return (tree: Root) => {
    const initialHeadingCountByDepth = countHeadingsByDepth(tree);

    const config = Array.isArray(options) ? options : [options];

    const grouped = groupByPosition(config);

    for (const [position, entries] of grouped) {
      const items = position === 'start' ? [...entries].reverse() : entries;

      for (const { text, minHeadingCount } of items) {
        const depth = 2;

        if (headingExists(tree, text, depth)) continue;

        const originalCount = initialHeadingCountByDepth[depth] ?? 0;
        if (
          typeof minHeadingCount === 'number' &&
          originalCount < minHeadingCount
        ) {
          continue;
        }

        const newHeading: RootContent = {
          type: 'heading',
          depth,
          children: [{ type: 'text', value: text }],
        };

        const index = getInsertionIndex(tree.children, position, depth);
        if (index !== -1) {
          tree.children.splice(index, 0, newHeading);
        }
      }
    }
  };
}

function groupByPosition(config: Option[]) {
  const map = new Map<'start' | 'end', Option[]>();
  for (const entry of config) {
    const position = entry.position ?? 'start';
    if (!map.has(position)) map.set(position, []);
    map.get(position)!.push(entry);
  }
  return map;
}

function headingExists(tree: Root, text: string, depth: number) {
  let found = false;

  visit(tree, 'heading', (node) => {
    if (
      node.depth === depth &&
      node.children.length === 1 &&
      node.children[0].type === 'text' &&
      node.children[0].value === text
    ) {
      found = true;
      return EXIT;
    }
  });

  return found;
}

function getInsertionIndex(
  nodes: RootContent[],
  position: 'start' | 'end',
  targetDepth = 2
) {
  if (position === 'end') return nodes.length;

  if (position === 'start') {
    let hasContent = false;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (!hasContent && isContentBlock(node)) {
        hasContent = true;
        continue;
      }

      if (node.type === 'heading' && node.depth === targetDepth) {
        return i;
      }
    }

    return nodes.length;
  }

  return -1;
}

function isContentBlock(node: RootContent) {
  return (
    node.type === 'paragraph' ||
    node.type === 'blockquote' ||
    node.type === 'list' ||
    node.type === 'code'
  );
}

function countHeadingsByDepth(tree: Root): Record<number, number> {
  const counts: Record<number, number> = {};

  visit(tree, 'heading', (node) => {
    counts[node.depth] = (counts[node.depth] || 0) + 1;
  });

  return counts;
}
