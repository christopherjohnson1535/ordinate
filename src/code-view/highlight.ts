// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { Parser } from '@lezer/common';
import { highlightTree, tagHighlighter, tags } from '@lezer/highlight';

import { CodeViewProps } from './interfaces';

/**
 * A run of text on one line, with the kinds of syntax it belongs to, such as `string`.
 */
export interface Segment {
  text: string;
  kinds?: ReadonlyArray<TokenKind>;
}

export type TokenKind =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'property'
  | 'type'
  | 'heading'
  | 'strong'
  | 'emphasis'
  | 'link'
  | 'invalid';

// The same tag groups as the code editor's highlight style, so a file looks the same in both.
const highlighter = tagHighlighter([
  {
    tag: [
      tags.keyword,
      tags.controlKeyword,
      tags.operatorKeyword,
      tags.definitionKeyword,
      tags.moduleKeyword,
      tags.modifier,
      tags.self,
    ],
    class: 'keyword',
  },
  {
    tag: [tags.string, tags.special(tags.string), tags.regexp, tags.character, tags.inserted, tags.monospace],
    class: 'string',
  },
  { tag: [tags.number, tags.bool, tags.null, tags.atom, tags.unit, tags.constant(tags.variableName)], class: 'number' },
  { tag: [tags.comment, tags.meta, tags.processingInstruction], class: 'comment' },
  { tag: [tags.propertyName, tags.attributeName, tags.tagName, tags.labelName, tags.deleted], class: 'property' },
  { tag: [tags.typeName, tags.className, tags.namespace], class: 'type' },
  { tag: tags.heading, class: 'heading' },
  { tag: tags.strong, class: 'strong' },
  { tag: tags.emphasis, class: 'emphasis' },
  { tag: [tags.link, tags.url], class: 'link' },
  { tag: tags.invalid, class: 'invalid' },
  { tag: tags.content, class: 'content' },
]);

// YAML marks unquoted values as plain content. Color them as the strings and numbers they are, so a
// config file reads the same whether or not its values are quoted.
const yamlNumber = /^(-?(\d[\d_]*)?\.?\d+([eE][-+]?\d+)?|0x[\da-fA-F]+|true|false|null|~|\.inf|\.nan)$/;

function kindsOf(classes: string, text: string, language: CodeViewProps.Language): TokenKind[] | undefined {
  const kinds = classes.split(' ').filter(kind => kind !== 'content') as TokenKind[];
  if (classes.split(' ').includes('content') && language === 'yaml' && !kinds.length) {
    kinds.push(yamlNumber.test(text.trim()) ? 'number' : 'string');
  }
  return kinds.length ? kinds : undefined;
}

const parsers = new Map<CodeViewProps.Language, Parser | null>();

/**
 * The parser for `language` if it has already loaded, so a code view can color its first render.
 */
export function getLoadedParser(language: CodeViewProps.Language): Parser | null | undefined {
  return language === 'text' ? null : parsers.get(language);
}

/**
 * Loads the parser for `language`. Each parser is its own chunk, so a page showing YAML never
 * downloads the Python grammar.
 */
export async function loadParser(language: CodeViewProps.Language): Promise<Parser | null> {
  const loaded = getLoadedParser(language);
  if (loaded !== undefined) {
    return loaded;
  }
  const parser = await importParser(language);
  parsers.set(language, parser);
  return parser;
}

async function importParser(language: CodeViewProps.Language): Promise<Parser | null> {
  switch (language) {
    case 'javascript':
      return (await import('@lezer/javascript')).parser.configure({ dialect: 'jsx' });
    case 'typescript':
      return (await import('@lezer/javascript')).parser.configure({ dialect: 'ts jsx' });
    case 'json':
      return (await import('@lezer/json')).parser;
    case 'yaml':
      return (await import('@lezer/yaml')).parser;
    case 'html':
      return (await import('@lezer/html')).parser;
    case 'css':
      return (await import('@lezer/css')).parser;
    case 'python':
      return (await import('@lezer/python')).parser;
    case 'markdown':
      return (await import('@lezer/markdown')).parser;
    default:
      return null;
  }
}

/**
 * Splits `code` into lines of segments. Without a parser every line is one plain segment.
 */
export function toLines(
  code: string,
  parser: Parser | null | undefined,
  language: CodeViewProps.Language
): Segment[][] {
  if (!parser) {
    return code.split('\n').map(text => (text ? [{ text }] : []));
  }
  const lines: Segment[][] = [[]];
  const push = (text: string, kinds?: ReadonlyArray<TokenKind>) => {
    text.split('\n').forEach((part, index) => {
      if (index > 0) {
        lines.push([]);
      }
      if (part) {
        lines[lines.length - 1].push(kinds ? { text: part, kinds } : { text: part });
      }
    });
  };
  let position = 0;
  highlightTree(parser.parse(code), highlighter, (from, to, classes) => {
    if (from > position) {
      push(code.slice(position, from));
    }
    const text = code.slice(from, to);
    push(text, kindsOf(classes, text, language));
    position = to;
  });
  push(code.slice(position));
  return lines;
}
