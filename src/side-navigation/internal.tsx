// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useId, useState } from 'react';
import clsx from 'clsx';

import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { isPlainLeftClick } from '../internal/link-click';
import { SideNavigationProps } from './interfaces';
import { containsCode, containsHref, splitAtDividers } from './utils';

import styles from './styles.css.js';

type Expandable = SideNavigationProps.Section | SideNavigationProps.ExpandableLinkGroup;

interface NavigationContextValue {
  activeHref?: string;
  /**
   * Some link carries a code, so every link keeps the code column and the texts line up.
   */
  hasCodes: boolean;
  idPrefix: string;
  externalIconAriaLabel: (item: SideNavigationProps.Link) => string | undefined;
  follow: (event: React.MouseEvent, detail: SideNavigationProps.FollowDetail) => boolean;
  isExpanded: (path: string, item: Expandable) => boolean;
  setExpanded: (path: string, item: Expandable, expanded: boolean) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

function useNavigation(): NavigationContextValue {
  return useContext(NavigationContext)!;
}

function defaultExpanded(item: Expandable, activeHref: string | undefined): boolean {
  if (item.type === 'section') {
    return item.defaultExpanded ?? true;
  }
  return item.defaultExpanded ?? containsHref(item.items, activeHref);
}

interface ItemProps<T extends SideNavigationProps.Item> {
  item: T;
  path: string;
}

// Marks drawn as type rather than icons, the way an index on a sheet is lettered.
function ToggleMark({ expanded }: { expanded: boolean }) {
  return (
    <span className={styles['toggle-mark']} aria-hidden="true">
      {expanded ? '\u2212' : '+'}
    </span>
  );
}

function SetLabel({ code, text }: { code?: string; text: string }) {
  return (
    <span className={styles['set-label']}>
      {code && (
        <>
          <span className={styles['set-code']}>{code}</span> <span aria-hidden="true">{'\u00b7'}</span>{' '}
        </>
      )}
      <span>{text}</span>
    </span>
  );
}

function NavLink({
  text,
  href,
  code,
  external = false,
  type,
  info,
  item,
  onFollowed,
  children,
}: {
  text: string;
  href: string;
  code?: string;
  external?: boolean;
  type: SideNavigationProps.FollowType;
  info?: React.ReactNode;
  item?: SideNavigationProps.Link;
  onFollowed?: () => void;
  children?: React.ReactNode;
}) {
  const { activeHref, hasCodes, follow, externalIconAriaLabel } = useNavigation();
  const active = href === activeHref;
  return (
    <div className={styles['link-row']}>
      <a
        className={clsx(styles.link, active && styles['link-active'])}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-current={active ? 'page' : undefined}
        onClick={event => {
          if (isPlainLeftClick(event)) {
            onFollowed?.();
            follow(event, { href, text, external, type });
          }
        }}
      >
        {hasCodes && (
          <>
            <span className={styles.code}>{code}</span>{' '}
          </>
        )}
        <span className={styles.text}>
          {text}
          {external && item && (
            <>
              {' '}
              <span className={styles['external-mark']} aria-hidden="true">
                {'\u2197'}
              </span>
              <span className={styles['screenreader-only']}>{externalIconAriaLabel(item)}</span>
            </>
          )}
        </span>
      </a>
      {info && <span className={styles.info}>{info}</span>}
      {children}
    </div>
  );
}

function Section({ item, path }: ItemProps<SideNavigationProps.Section>) {
  const { idPrefix, isExpanded, setExpanded } = useNavigation();
  const expanded = isExpanded(path, item);
  const contentId = `${idPrefix}-${path}`;
  return (
    <li className={clsx(styles.item, styles.section)}>
      <button
        type="button"
        className={styles['section-toggle']}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded(path, item, !expanded)}
      >
        <SetLabel code={item.code} text={item.text} />
        <ToggleMark expanded={expanded} />
      </button>
      <div id={contentId} className={styles['section-items']} hidden={!expanded}>
        <ItemList items={item.items} path={path} />
      </div>
    </li>
  );
}

function SectionGroup({ item, path }: ItemProps<SideNavigationProps.SectionGroup>) {
  const { idPrefix } = useNavigation();
  const titleId = `${idPrefix}-${path}-title`;
  return (
    <li className={clsx(styles.item, styles['section-group'])}>
      <div id={titleId} className={styles['section-group-title']}>
        <SetLabel code={item.code} text={item.title} />
      </div>
      <div role="group" aria-labelledby={titleId}>
        <ItemList items={item.items} path={path} />
      </div>
    </li>
  );
}

function LinkGroup({ item, path }: ItemProps<SideNavigationProps.LinkGroup>) {
  return (
    <li className={clsx(styles.item, styles['link-group'])}>
      <NavLink text={item.text} href={item.href} code={item.code} type="link-group" info={item.info} />
      <div className={styles.nested}>
        <ItemList items={item.items} path={path} />
      </div>
    </li>
  );
}

function ExpandableLinkGroup({ item, path }: ItemProps<SideNavigationProps.ExpandableLinkGroup>) {
  const { idPrefix, isExpanded, setExpanded } = useNavigation();
  const expanded = isExpanded(path, item);
  const contentId = `${idPrefix}-${path}`;
  return (
    <li className={clsx(styles.item, styles['expandable-link-group'])}>
      <NavLink
        text={item.text}
        href={item.href}
        code={item.code}
        type="expandable-link-group"
        // Following the group's own link opens it, so the pages under it come into view.
        onFollowed={() => !expanded && setExpanded(path, item, true)}
      >
        <button
          type="button"
          className={styles['expand-toggle']}
          aria-label={item.text}
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded(path, item, !expanded)}
        >
          <ToggleMark expanded={expanded} />
        </button>
      </NavLink>
      <div id={contentId} className={styles.nested} hidden={!expanded}>
        <ItemList items={item.items} path={path} />
      </div>
    </li>
  );
}

function Item({ item, path }: ItemProps<Exclude<SideNavigationProps.Item, SideNavigationProps.Divider>>) {
  switch (item.type) {
    case 'link':
      return (
        <li className={styles.item}>
          <NavLink
            text={item.text}
            href={item.href}
            code={item.code}
            external={item.external}
            type="link"
            info={item.info}
            item={item}
          />
        </li>
      );
    case 'section':
      return <Section item={item} path={path} />;
    case 'section-group':
      return <SectionGroup item={item} path={path} />;
    case 'link-group':
      return <LinkGroup item={item} path={path} />;
    case 'expandable-link-group':
      return <ExpandableLinkGroup item={item} path={path} />;
  }
}

/**
 * Renders items as lists, broken by a rule at each divider so every list holds only list items.
 */
function ItemList({ items, path }: { items: ReadonlyArray<SideNavigationProps.Item>; path?: string }) {
  return (
    <>
      {splitAtDividers(items).map((run, runIndex) =>
        run === 'divider' ? (
          <hr key={runIndex} className={styles.divider} />
        ) : (
          <ul key={runIndex} className={styles.list}>
            {run.map(({ item, index }) => {
              const itemPath = path === undefined ? String(index) : `${path}-${index}`;
              return <Item key={itemPath} item={item} path={itemPath} />;
            })}
          </ul>
        )
      )}
    </>
  );
}

export function InternalSideNavigation({
  header,
  items = [],
  activeHref,
  ariaLabel,
  externalIconAriaLabel,
  onFollow,
  onChange,
  ...rest
}: SideNavigationProps) {
  const i18n = useInternalI18n('side-navigation');
  const idPrefix = useId();
  const [expandedByPath, setExpandedByPath] = useState<Record<string, boolean>>({});

  const follow = (event: React.MouseEvent, detail: SideNavigationProps.FollowDetail) =>
    fireCancelableEvent(onFollow, detail, event);

  const hasCodes = containsCode(items);
  const context: NavigationContextValue = {
    activeHref,
    hasCodes,
    idPrefix,
    externalIconAriaLabel: item => i18n('externalIconAriaLabel', item.externalIconAriaLabel ?? externalIconAriaLabel),
    follow,
    isExpanded: (path, item) => expandedByPath[path] ?? defaultExpanded(item, activeHref),
    setExpanded: (path, item, expanded) => {
      setExpandedByPath(current => ({ ...current, [path]: expanded }));
      fireNonCancelableEvent(onChange, { item, expanded });
    },
  };

  return (
    <nav
      {...rest}
      className={clsx(styles.root, hasCodes && styles['has-codes'])}
      aria-label={i18n('ariaLabel', ariaLabel)}
    >
      {header && (
        <div className={styles.header}>
          <a
            className={styles['header-link']}
            href={header.href}
            onClick={event => {
              if (isPlainLeftClick(event)) {
                follow(event, { href: header.href, text: header.text, external: false, type: 'header' });
              }
            }}
          >
            {header.logo && <img className={styles.logo} src={header.logo.src} alt={header.logo.alt ?? ''} />}
            {header.text && <span className={styles['header-text']}>{header.text}</span>}
          </a>
        </div>
      )}
      <NavigationContext.Provider value={context}>
        <ItemList items={items} />
      </NavigationContext.Provider>
    </nav>
  );
}
