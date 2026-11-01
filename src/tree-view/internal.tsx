// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { getLogicalArrowStep } from '../internal/direction';
import { fireNonCancelableEvent } from '../internal/events';
import { getTabbableElements } from '../internal/focus';
import { useBrowserLayoutEffect } from '../internal/hooks/use-browser-layout-effect';
import { useControllable } from '../internal/hooks/use-controllable';
import { useInternalI18n } from '../internal/i18n/context';
import { TreeViewProps } from './interfaces';
import { buildVisibleTree, findAncestorIds, TreeNode } from './utils';

import styles from './styles.css.js';

const savedTabIndex = 'data-tree-view-tabindex';

// Keeps the tree a single tab stop: only the actions of the item holding the tab stop
// can be reached with Tab. The consumer's own tabindex is restored when its item gets it back.
function updateActionTabStops(root: HTMLElement, activeId: string | undefined) {
  for (const container of root.querySelectorAll<HTMLElement>(`.${styles.actions}`)) {
    if (container.dataset.itemId === activeId) {
      for (const element of container.querySelectorAll<HTMLElement>(`[${savedTabIndex}]`)) {
        const original = element.getAttribute(savedTabIndex);
        if (original) {
          element.setAttribute('tabindex', original);
        } else {
          element.removeAttribute('tabindex');
        }
        element.removeAttribute(savedTabIndex);
      }
    } else {
      for (const element of getTabbableElements(container)) {
        element.setAttribute(savedTabIndex, element.getAttribute('tabindex') ?? '');
        element.tabIndex = -1;
      }
    }
  }
}

function plainLabel(item: TreeViewProps.TreeItem): string | undefined {
  if (item.announcementLabel !== undefined) {
    return item.announcementLabel;
  }
  return typeof item.content === 'string' || typeof item.content === 'number' ? String(item.content) : undefined;
}

export function InternalTreeView<T>({
  items,
  getItemId,
  getItemChildren,
  renderItem,
  expandedItems,
  onItemToggle,
  renderItemToggleIcon,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  i18nStrings,
  ...rest
}: TreeViewProps<T>) {
  const i18n = useInternalI18n('tree-view');
  const baseId = useId();
  const rootRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const [expanded, setExpanded] = useControllable<ReadonlyArray<string>>(expandedItems, []);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const accessors = { getItemId, getItemChildren };
  const { roots, visible } = buildVisibleTree(items, accessors, new Set(expanded));
  const byId = new Map(visible.map(node => [node.id, node]));

  // The tab stop stays on the focused item, or moves to its closest visible ancestor when
  // a collapse hides it, or falls back to the first item.
  const tabStopId = (() => {
    if (focusedId !== null && !byId.has(focusedId)) {
      const ancestors = findAncestorIds(items, accessors, focusedId) ?? [];
      const visibleAncestor = [...ancestors].reverse().find(id => byId.has(id));
      if (visibleAncestor) {
        return visibleAncestor;
      }
    }
    return focusedId !== null && byId.has(focusedId) ? focusedId : visible[0]?.id;
  })();

  useBrowserLayoutEffect(() => {
    if (rootRef.current) {
      updateActionTabStops(rootRef.current, tabStopId);
    }
  });

  const focusItem = (id: string) => {
    setFocusedId(id);
    itemRefs.current.get(id)?.focus();
  };

  const toggle = (node: TreeNode<T>, nextExpanded: boolean) => {
    if (!node.hasChildren || node.expanded === nextExpanded) {
      return;
    }
    setExpanded(nextExpanded ? [...expanded, node.id] : expanded.filter(id => id !== node.id));
    fireNonCancelableEvent(onItemToggle, { id: node.id, item: node.item, expanded: nextExpanded });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.getAttribute('role') !== 'treeitem') {
      return;
    }
    const node = byId.get(target.dataset.itemId ?? '');
    if (!node) {
      return;
    }
    const position = visible.indexOf(node);
    const step = getLogicalArrowStep(event.key, target);
    if (event.key === 'ArrowDown' && position < visible.length - 1) {
      focusItem(visible[position + 1].id);
    } else if (event.key === 'ArrowUp' && position > 0) {
      focusItem(visible[position - 1].id);
    } else if (event.key === 'Home') {
      focusItem(visible[0].id);
    } else if (event.key === 'End') {
      focusItem(visible[visible.length - 1].id);
    } else if (step === 1) {
      if (node.hasChildren && !node.expanded) {
        toggle(node, true);
      } else if (node.expanded) {
        focusItem(node.children[0].id);
      }
    } else if (step === -1) {
      if (node.expanded) {
        toggle(node, false);
      } else if (node.parentId !== null) {
        focusItem(node.parentId);
      }
    } else if (event.key === '*') {
      const siblings = node.parentId === null ? roots : (byId.get(node.parentId)?.children ?? []);
      const collapsed = siblings.filter(sibling => sibling.hasChildren && !sibling.expanded);
      if (collapsed.length > 0) {
        setExpanded([...expanded, ...collapsed.map(sibling => sibling.id)]);
        for (const sibling of collapsed) {
          fireNonCancelableEvent(onItemToggle, { id: sibling.id, item: sibling.item, expanded: true });
        }
      }
    } else {
      return;
    }
    event.preventDefault();
  };

  const renderNode = (node: TreeNode<T>) => {
    const rendered = renderItem(node.item, node.index);
    const contentId = `${baseId}-${node.id}-content`;
    const secondaryId = `${baseId}-${node.id}-secondary`;
    // The secondary text is visible, so it is part of the name voice control users can speak.
    const labelIds = rendered.secondaryContent ? `${contentId} ${secondaryId}` : contentId;
    const label = plainLabel(rendered);
    const toggleLabel = node.expanded
      ? i18n('collapseButtonLabel', i18nStrings?.collapseButtonLabel?.(node.item), {
          hasLabel: label === undefined ? 'false' : 'true',
          label: label ?? '',
        })
      : i18n('expandButtonLabel', i18nStrings?.expandButtonLabel?.(node.item), {
          hasLabel: label === undefined ? 'false' : 'true',
          label: label ?? '',
        });

    return (
      <li
        key={node.id}
        ref={element => {
          if (element) {
            itemRefs.current.set(node.id, element);
          } else {
            itemRefs.current.delete(node.id);
          }
        }}
        role="treeitem"
        className={clsx(styles.item, node.index === node.setSize - 1 && styles['item-last'])}
        data-item-id={node.id}
        aria-level={node.level}
        aria-setsize={node.setSize}
        aria-posinset={node.index + 1}
        aria-expanded={node.hasChildren ? node.expanded : undefined}
        aria-label={rendered.announcementLabel}
        aria-labelledby={rendered.announcementLabel === undefined ? labelIds : undefined}
        tabIndex={node.id === tabStopId ? 0 : -1}
        onFocus={event => {
          if ((event.target as Element).closest('[role="treeitem"]') === event.currentTarget) {
            setFocusedId(node.id);
          }
        }}
      >
        <div className={styles.row}>
          <span className={styles['toggle-slot']}>
            {node.hasChildren && (
              <button
                type="button"
                className={styles.toggle}
                tabIndex={-1}
                aria-label={toggleLabel}
                onClick={() => {
                  toggle(node, !node.expanded);
                  focusItem(node.id);
                }}
              >
                {renderItemToggleIcon ? (
                  renderItemToggleIcon({ expanded: node.expanded })
                ) : (
                  <InternalIcon name={node.expanded ? 'treeview-collapse' : 'treeview-expand'} />
                )}
              </button>
            )}
          </span>
          {rendered.icon && <span className={styles.icon}>{rendered.icon}</span>}
          <span className={styles.text}>
            <span id={contentId} className={styles.content}>
              {rendered.content}
            </span>
            {rendered.secondaryContent && (
              <span id={secondaryId} className={styles['secondary-content']}>
                {rendered.secondaryContent}
              </span>
            )}
          </span>
          {rendered.actions && (
            <span className={styles.actions} data-item-id={node.id}>
              {rendered.actions}
            </span>
          )}
        </div>
        {node.expanded && (
          <ul role="group" className={styles.group}>
            {node.children.map(renderNode)}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div {...rest} className={styles.root}>
      <ul
        ref={rootRef}
        role="tree"
        className={styles.tree}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        onKeyDown={handleKeyDown}
      >
        {roots.map(renderNode)}
      </ul>
    </div>
  );
}
