// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef, useState } from 'react';

import Box from '@ordinate/components/box';
import Input, { InputProps } from '@ordinate/components/input';
import Modal from '@ordinate/components/modal';

import { componentDocs, groups, loadDefinition } from '../registry/components';
import { guides, sections } from '../registry/guides';
import { href } from './router';

import styles from './search.module.scss';

interface Entry {
  title: string;
  /** What kind of page or part the entry is, such as `Component` or `Property`. */
  kind: string;
  summary: string;
  target: string;
  /** Extra words that should find the entry without being shown. */
  keywords?: string;
}

function pageEntries(): Entry[] {
  const components = componentDocs.map<Entry>(doc => ({
    title: doc.name,
    kind: groups.find(group => group.id === doc.group)?.title ?? 'Component',
    summary: doc.summary,
    target: href(`/components/${doc.folder}`),
    keywords: doc.folder,
  }));
  const pages = guides.map<Entry>(guide => ({
    title: guide.title,
    kind: sections.find(section => section.id === guide.section)?.title ?? 'Guide',
    summary: guide.summary,
    target: href(guide.path),
    keywords: guide.keywords?.join(' '),
  }));
  return [...pages, ...components];
}

// Prop entries need every API definition, so they load the first time search opens.
let apiEntriesPromise: Promise<Entry[]> | null = null;
function loadApiEntries(): Promise<Entry[]> {
  apiEntriesPromise ??= Promise.all(
    componentDocs.map(async doc => {
      const definition = await loadDefinition(doc).catch(() => null);
      if (!definition) {
        return [];
      }
      const target = href(`/components/${doc.folder}`, 'api');
      return [
        ...definition.properties.map(p => ({ name: p.name, kind: 'Property', text: p.description })),
        ...definition.regions.map(r => ({ name: r.name, kind: 'Region', text: r.description })),
        ...definition.events.map(e => ({ name: e.name, kind: 'Event', text: e.description })),
        ...definition.functions.map(f => ({ name: `${f.name}()`, kind: 'Ref function', text: f.description })),
      ]
        .filter(entry => entry.name !== 'id')
        .map<Entry>(entry => ({
          title: `${doc.name} · ${entry.name}`,
          kind: entry.kind,
          summary: (entry.text ?? '').split('\n')[0].replace(/`/g, ''),
          target,
        }));
    })
  ).then(lists => lists.flat());
  return apiEntriesPromise;
}

function score(entry: Entry, query: string): number {
  const title = entry.title.toLowerCase();
  const words = query.split(/\s+/).filter(Boolean);
  if (!words.length) {
    return 0;
  }
  let total = 0;
  for (const word of words) {
    if (title === word) total += 100;
    else if (title.startsWith(word)) total += 60;
    else if (title.split(/[\s·]+/).some(part => part.startsWith(word))) total += 40;
    else if (title.includes(word)) total += 25;
    else if (entry.keywords?.toLowerCase().includes(word)) total += 15;
    else if (entry.summary.toLowerCase().includes(word)) total += 5;
    else return 0;
  }
  // Pages come before the props of a page with the same score.
  return total + (entry.kind === 'Property' || entry.kind === 'Region' || entry.kind === 'Event' ? 0 : 1);
}

function useEntries(active: boolean) {
  const pages = useMemo(() => pageEntries(), []);
  const [api, setApi] = useState<Entry[]>([]);
  useEffect(() => {
    if (active) {
      let current = true;
      loadApiEntries().then(entries => current && setApi(entries));
      return () => {
        current = false;
      };
    }
  }, [active]);
  return useMemo(() => [...pages, ...api], [pages, api]);
}

/** Opens search with Ctrl+K, Cmd+K, or `/` when the focus is not in a text field. */
export function useSearchShortcut(open: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.closest('input, textarea, [contenteditable="true"], .cm-editor');
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);
}

/** The search field in the top bar. Typing in it, or pressing Enter, opens the search dialog. */
export function SearchTrigger({ onOpen }: { onOpen: (query?: string) => void }) {
  const openWith = (query?: string) => onOpen(query);
  return (
    <Input
      type="search"
      value=""
      placeholder="Find a component, prop or guide"
      ariaLabel="Search the documentation"
      onChange={event => openWith(event.detail.value)}
      onKeyDown={event => {
        if (event.detail.key === 'Enter' || event.detail.key === 'ArrowDown') {
          openWith();
        }
      }}
    />
  );
}

const resultLimit = 40;

export function SearchDialog({
  visible,
  initialQuery = '',
  onDismiss,
  onFollow,
}: {
  visible: boolean;
  /**
   * The text to search for when the dialog opens, such as what was typed in the top bar. Give the
   * dialog a new `key` each time it opens so it starts from this text.
   */
  initialQuery?: string;
  onDismiss: () => void;
  onFollow: (target: string) => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState(0);
  const input = useRef<InputProps.Ref>(null);
  const list = useRef<HTMLUListElement>(null);
  const entries = useEntries(visible);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return entries.filter(entry => entry.kind === 'Get started' || entry.kind === 'Foundations').slice(0, 12);
    }
    return entries
      .map(entry => ({ entry, score: score(entry, normalized) }))
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, resultLimit)
      .map(result => result.entry);
  }, [entries, query]);

  useEffect(() => {
    if (visible) {
      window.requestAnimationFrame(() => input.current?.focus());
    }
  }, [visible]);
  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const follow = (entry: Entry) => {
    onDismiss();
    onFollow(entry.target);
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      size="large"
      position="top"
      header="Search"
      reference="S1"
      closeAriaLabel="Close search"
      footer={
        <Box color="text-body-secondary" fontSize="body-s">
          <kbd className={styles.key}>↑</kbd> <kbd className={styles.key}>↓</kbd> to move,{' '}
          <kbd className={styles.key}>Enter</kbd> to open, <kbd className={styles.key}>Esc</kbd> to close.
        </Box>
      }
    >
      <div className={styles.search}>
        <Input
          ref={input}
          type="search"
          value={query}
          placeholder="Button, onChange, revisions…"
          ariaLabel="Search the documentation"
          onChange={event => {
            setQuery(event.detail.value);
            setActive(0);
          }}
          onKeyDown={event => {
            const { key } = event.detail;
            if (key === 'ArrowDown') {
              event.preventDefault();
              setActive(index => Math.min(index + 1, results.length - 1));
            } else if (key === 'ArrowUp') {
              event.preventDefault();
              setActive(index => Math.max(index - 1, 0));
            } else if (key === 'Enter' && results[active]) {
              follow(results[active]);
            }
          }}
        />
        <p className={styles.status} role="status">
          {query.trim()
            ? results.length
              ? `${results.length}${results.length === resultLimit ? '+' : ''} results`
              : `Nothing matches “${query.trim()}”.`
            : 'Start with a component, a property or a topic.'}
        </p>
        <ul ref={list} className={styles.results} aria-label="Results">
          {results.map((entry, index) => (
            <li key={`${entry.target}-${entry.title}`} data-index={index}>
              <a
                href={entry.target}
                className={index === active ? `${styles.result} ${styles.active}` : styles.result}
                aria-current={index === active ? 'true' : undefined}
                onMouseEnter={() => setActive(index)}
                onClick={event => {
                  if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
                    event.preventDefault();
                    follow(entry);
                  }
                }}
              >
                <span className={styles.kind}>{entry.kind}</span>
                <span className={styles.title}>{entry.title}</span>
                {entry.summary && <span className={styles.summary}>{entry.summary}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
