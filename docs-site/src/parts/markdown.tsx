// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

// Doc comments in the API definitions use a small part of Markdown: paragraphs, bulleted lists
// (nested by indentation), `code`, **bold**, _emphasis_ and [links](url). This renders exactly
// that, so the descriptions read the same here as in an editor's hover card.

const inlinePattern = /(`[^`]+`|\*\*[^*]+\*\*|_[^_\s][^_]*_|\[[^\]]+\]\([^)]+\))/g;

export function renderInline(text: string, keyPrefix = ''): React.ReactNode[] {
  return text.split(inlinePattern).map((part, index) => {
    const key = `${keyPrefix}${index}`;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (/^_[^_]/.test(part) && part.endsWith('_')) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <a key={key} href={link[2]}>
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

interface ListNode {
  text: string;
  children: ListNode[];
}

type Block = { type: 'paragraph'; text: string } | { type: 'list'; items: ListNode[] };

const bulletPattern = /^(\s*)[*-]\s+(.*)$/;

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  // Each open list level, with the indentation that started it.
  let stack: { indent: number; items: ListNode[] }[] = [];

  const closeParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
      paragraph = [];
    }
  };
  const closeList = () => {
    if (stack.length) {
      blocks.push({ type: 'list', items: stack[0].items });
      stack = [];
    }
  };

  for (const line of source.split('\n')) {
    const bullet = bulletPattern.exec(line);
    if (bullet) {
      closeParagraph();
      const indent = bullet[1].length;
      const node: ListNode = { text: bullet[2], children: [] };
      if (!stack.length) {
        stack.push({ indent, items: [node] });
        continue;
      }
      while (stack.length > 1 && indent < stack[stack.length - 1].indent) {
        stack.pop();
      }
      const top = stack[stack.length - 1];
      if (indent > top.indent) {
        const parent = top.items[top.items.length - 1];
        stack.push({ indent, items: parent.children });
        parent.children.push(node);
      } else {
        top.items.push(node);
      }
    } else if (!line.trim()) {
      closeParagraph();
      closeList();
    } else if (stack.length && /^\s+/.test(line)) {
      // A wrapped continuation of the last bullet.
      const top = stack[stack.length - 1];
      top.items[top.items.length - 1].text += ` ${line.trim()}`;
    } else {
      closeList();
      paragraph.push(line.trim());
    }
  }
  closeParagraph();
  closeList();
  return blocks;
}

function List({ items, depth }: { items: ListNode[]; depth: number }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {renderInline(item.text, `${depth}-${index}-`)}
          {item.children.length > 0 && <List items={item.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

/** Renders a doc comment. Wrap it in TextContent, or in a container that styles `p`, `ul` and `code`. */
export function Markdown({ source }: { source: string }) {
  return (
    <>
      {parseBlocks(source).map((block, index) =>
        block.type === 'paragraph' ? (
          <p key={index}>{renderInline(block.text, `${index}-`)}</p>
        ) : (
          <List key={index} items={block.items} depth={0} />
        )
      )}
    </>
  );
}

/** The first sentence of a doc comment, without Markdown, for search results and summaries. */
export function firstSentence(source = ''): string {
  const plain = source.replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
  const match = /^(.+?[.!?])(\s|$)/.exec(plain.split('\n')[0]);
  return (match ? match[1] : plain.split('\n')[0]).trim();
}
