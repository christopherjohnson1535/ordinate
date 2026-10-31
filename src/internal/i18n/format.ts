// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Values a message can interpolate.
 */
export type MessageParams = Record<string, string | number>;

type Node = string | Argument;

interface Argument {
  name: string;
  kind: 'simple' | 'plural' | 'select';
  options: Record<string, Node[]>;
}

// Parses the subset of ICU message syntax Ordinate uses: `{name}`,
// `{name, plural, =0 {…} one {…} other {…}}` with `#`, and `{name, select, a {…} other {…}}`.
class Parser {
  private index = 0;

  constructor(private readonly source: string) {}

  parse(): Node[] {
    const nodes = this.nodes();
    if (this.index < this.source.length) {
      throw new Error(`Unexpected "}" in message "${this.source}"`);
    }
    return nodes;
  }

  // Reads text and arguments until the end of the source or a closing brace, which the caller handles.
  private nodes(): Node[] {
    const nodes: Node[] = [];
    let text = '';
    while (this.index < this.source.length) {
      const char = this.source[this.index];
      if (char === '{') {
        if (text) {
          nodes.push(text);
          text = '';
        }
        this.index++;
        nodes.push(this.argument());
      } else if (char === '}') {
        break;
      } else {
        text += char;
        this.index++;
      }
    }
    if (text) {
      nodes.push(text);
    }
    return nodes;
  }

  private argument(): Argument {
    const name = this.until(/[,}]/).trim();
    if (this.source[this.index] === '}') {
      this.index++;
      return { name, kind: 'simple', options: {} };
    }
    this.index++;
    const kind = this.until(/[,}]/).trim();
    if (kind !== 'plural' && kind !== 'select') {
      throw new Error(`Unsupported argument type "${kind}" in message "${this.source}"`);
    }
    this.index++;
    const options: Record<string, Node[]> = {};
    for (;;) {
      this.skipSpace();
      if (this.source[this.index] === '}') {
        this.index++;
        break;
      }
      const key = this.until(/[\s{]/).trim();
      this.skipSpace();
      if (this.source[this.index] !== '{' || !key) {
        throw new Error(`Malformed ${kind} options in message "${this.source}"`);
      }
      this.index++;
      options[key] = this.nodes();
      if (this.source[this.index] !== '}') {
        throw new Error(`Unclosed option in message "${this.source}"`);
      }
      this.index++;
    }
    if (!options.other) {
      throw new Error(`The ${kind} argument "${name}" needs an "other" option in message "${this.source}"`);
    }
    return { name, kind, options };
  }

  private until(stop: RegExp): string {
    const start = this.index;
    while (this.index < this.source.length && !stop.test(this.source[this.index])) {
      this.index++;
    }
    if (this.index >= this.source.length) {
      throw new Error(`Unclosed argument in message "${this.source}"`);
    }
    return this.source.slice(start, this.index);
  }

  private skipSpace(): void {
    while (/\s/.test(this.source[this.index] ?? '')) {
      this.index++;
    }
  }
}

const cache = new Map<string, Node[]>();

function render(nodes: Node[], params: MessageParams, locale: string, count?: number): string {
  return nodes
    .map(node => {
      if (typeof node === 'string') {
        return count === undefined ? node : node.replace(/#/g, new Intl.NumberFormat(locale).format(count));
      }
      const value = params[node.name];
      if (node.kind === 'simple') {
        return value === undefined ? `{${node.name}}` : String(value);
      }
      if (node.kind === 'plural') {
        const number = Number(value);
        const exact = node.options[`=${number}`];
        const category = new Intl.PluralRules(locale).select(number);
        return render(exact ?? node.options[category] ?? node.options.other, params, locale, number);
      }
      return render(node.options[String(value)] ?? node.options.other, params, locale, count);
    })
    .join('');
}

/**
 * Fills a message template with `params`, using `locale` for plural rules and numbers.
 */
export function formatMessage(template: string, params: MessageParams = {}, locale = 'en'): string {
  let nodes = cache.get(template);
  if (!nodes) {
    nodes = new Parser(template).parse();
    cache.set(template, nodes);
  }
  return render(nodes, params, locale);
}
