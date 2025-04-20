# remark-insert-headings

[![npm](https://img.shields.io/npm/v/remark-insert-headings.svg)](https://www.npmjs.com/package/remark-insert-headings) [![Build Status](https://github.com/tgreyuk/remark-insert-headings/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/tgreyuk/remark-insert-headings/actions/workflows/ci.yml)

remark plugin that automatically inserts one or more specified headings into the AST.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [`unified().use(remarkInsertHeadings[, options])`](#unifieduseremarkinsertheadings-options)
  - [`Options`](#options)
- [Related](#related)
- [License](#license)

## What is this?

A [remark](https://github.com/remarkjs/remark) plugin that ensures specific headings are present in the Markdown document by inserting them into the AST at defined positions if they are missing.

## When should I use this?

Several popular remark plugins (such as [remark-toc](https://github.com/remarkjs/remark-toc)) rely on specific headings being present in the input document.

By design, these plugins typically do not create the headings themselves, but instead assume they exist and use them as anchors or insertion points for additional content.

This is where `remark-insert-headings` comes in - it ensures those headings are present before other plugins run.

It's especially useful when:

- You're parsing auto-generated content.
- You're working from templates and don't want to include heading markers manually in input files.

## Install

As with other plugins in the remark ecosystem, this package is ESM only.

```shell
npm install remark-insert-headings
```

## Use

Say we have the following file `example.md` document:

```markdown
# Main heading

Some para

## Content Heading A

Some para

## Content Heading B
```

...and a script `example.js`:

```ts
import fs from 'node:fs/promises';
import { remark } from 'remark';
import remarkInsertHeadings from 'remark-insert-headings';
import remarkToc from 'remark-toc';
import remarkLicense from 'remark-license';

const document = await fs.readFile('example.md', 'utf8');
const file = await remark()
  .use(remarkInsertHeadings, [
    {
      text: 'Contents',
      position: 'start',
      minHeadingCount: 2,
    },
    {
      text: 'License',
      position: 'end',
    },
  ])
  .use(remarkToc)
  .use(remarkLicense)
  .process(document);

console.log(String(file));
```

...then running `node example.js` yields:

```markdown
# Main heading

## Contents

- [Content Heading A](#content-heading-a)
- [Content Heading B](#content-heading-b)
- [License](#license)

## Content Heading A

Some para

## Content Heading B

Some para

## License

[MIT](LICENSE) © John Doe
```

## API

The default export is `remarkInsertHeadings`.

### `unified().use(remarkInsertHeadings[, options])`

This plugin:

- Adds a heading to the document if it doesn't already exist.
- Should be run before dependent plugins that expect those headings to be present.

_Note: All inserted headings use ## (i.e., heading depth 2) by default._

#### Parameters

options ([Options](#options))

#### Returns

Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).

### `Options`

#### Fields (or array of fields)

You can define multiple headings to insert at various positions. The order of the headings will be preserved as defined in the configuration.

You can also pass a single object if you're only inserting one heading.

Each field supports the following:

- `text` (`string`) — The text content of the heading to insert.
- `position` (`"start"`|`"end"`) — Where to insert the heading:
  - `"start"`: after the first paragraph but before the next heading.
  - `"end"`: at the end of the document.
- `minHeadingCount` (`number`, default `0`) - Only insert the heading if the document contains fewer than this number of headings.

## Related

The plugin might be useful to configure the following plugins:

- [remark-toc](https://github.com/remarkjs/remark-toc)
- [remark-contributors](https://github.com/remarkjs/remark-contributors)
- [remark-license](https://github.com/remarkjs/remark-license)
- [remark-usage](https://github.com/remarkjs/remark-usage)

## License

[MIT](LICENSE)
