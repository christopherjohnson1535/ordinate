// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { InternalButtonDropdown } from '../button-dropdown/internal';
import { CommandLineContext } from '../internal/context/command-line-context';
import { CancelableCustomEvent, fireCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { TopNavigationProps } from './interfaces';
import { computeUtilityLayout, isSameLayout, UtilityLayout } from './layout';
import { getOverflowItems, parseOverflowItemId } from './overflow';
import { canCollapseText, Utility } from './utility';

import styles from './styles.css.js';

// Layout effects do nothing on the server, and React 18 warns when they are used there.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// The share of the bar kept for the search field before utilities give up their text.
const searchShare = 0.3;

const fullLayout: UtilityLayout = { collapseText: false, overflowed: [] };

function readPixels(value: string): number {
  return parseFloat(value) || 0;
}

function isPlainLeftClick(event: React.MouseEvent) {
  return event.button === 0 && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
}

export function InternalTopNavigation({ identity, utilities = [], search, i18nStrings, ...rest }: TopNavigationProps) {
  const i18n = useInternalI18n('top-navigation');
  const rootRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<UtilityLayout>(fullLayout);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const ruler = measureRef.current;
    if (!root || !ruler) {
      return;
    }
    const width = (name: string) => ruler.querySelector<HTMLElement>(`[data-measure="${name}"]`)?.offsetWidth ?? 0;
    const rootStyle = window.getComputedStyle(root);
    const inner =
      root.clientWidth -
      readPixels(rootStyle.getPropertyValue('padding-inline-start')) -
      readPixels(rootStyle.getPropertyValue('padding-inline-end'));
    const rootGap = readPixels(rootStyle.columnGap);
    const regions = search ? 3 : 2;
    const available = inner - width('identity') - (search ? inner * searchShare : 0) - rootGap * (regions - 1);

    const next = computeUtilityLayout({
      available,
      utilities: utilities.map((utility, index) => ({
        full: width(`full-${index}`),
        collapsed: width(`collapsed-${index}`),
        canCollapseText: canCollapseText(utility),
        canOverflow: !utility.disableUtilityCollapse,
      })),
      overflowTriggerWidth: width('overflow'),
      gap: readPixels(window.getComputedStyle(ruler).columnGap),
    });
    setLayout(current => (isSameLayout(current, next) ? current : next));
  }, [utilities, search]);

  // Measures after every render, because utility text, icons and fonts all change the widths.
  useBrowserLayoutEffect(measure);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => measure());
    observer.observe(root);
    return () => observer.disconnect();
  }, [measure]);

  const overflowed = new Set(layout.overflowed);
  const overflowLabel = i18n('overflowMenuTriggerText', i18nStrings?.overflowMenuTriggerText);

  const handleOverflowEvent =
    (kind: 'click' | 'follow') => (event: CancelableCustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
      const { index, itemId } = parseOverflowItemId(event.detail.id);
      const utility = utilities[index];
      if (!utility) {
        return;
      }
      if (utility.type === 'menu-dropdown') {
        fireCancelableEvent(
          kind === 'click' ? utility.onItemClick : utility.onItemFollow,
          { ...event.detail, id: itemId },
          event
        );
      } else if (kind === 'click') {
        fireCancelableEvent(
          utility.onClick,
          { button: 0, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false },
          event
        );
      }
    };

  const identityContent = (
    <>
      {identity.logo && (
        <img className={styles.logo} src={identity.logo.src} alt={identity.title ? '' : identity.logo.alt} />
      )}
      {identity.title && <span className={styles.title}>{identity.title}</span>}
    </>
  );

  const overflowMenu = (
    <InternalButtonDropdown
      triggerClassName={`${styles.utility} ${styles['icon-only']}`}
      variant="icon"
      triggerIconName="menu"
      ariaLabel={overflowLabel}
      expandableGroups={true}
      items={getOverflowItems(utilities, layout.overflowed)}
      onItemClick={handleOverflowEvent('click')}
      onItemFollow={handleOverflowEvent('follow')}
    />
  );

  return (
    <header {...rest} ref={rootRef} className={styles.root}>
      <div className={styles.identity}>
        <a
          className={styles['identity-link']}
          href={identity.href}
          onClick={event => {
            if (isPlainLeftClick(event)) {
              fireCancelableEvent(identity.onFollow, null, event);
            }
          }}
        >
          {identityContent}
        </a>
      </div>
      {search && (
        <div className={styles.search}>
          <CommandLineContext.Provider value={true}>{search}</CommandLineContext.Provider>
        </div>
      )}
      {utilities.length > 0 && (
        <div className={styles.utilities}>
          {utilities.map((utility, index) =>
            overflowed.has(index) ? null : <Utility key={index} utility={utility} collapsed={layout.collapseText} />
          )}
          {overflowed.size > 0 && (
            <span className={styles['utility-slot']} data-overflow-menu="">
              {overflowMenu}
            </span>
          )}
        </div>
      )}
      <div
        ref={element => {
          // Set directly, because React 18 does not know the attribute.
          element?.setAttribute('inert', '');
        }}
        className={styles['ruler-frame']}
        aria-hidden="true"
      >
        <div ref={measureRef} className={styles.ruler}>
          <span className={`${styles.identity} ${styles['identity-link']}`} data-measure="identity">
            {identityContent}
          </span>
          {utilities.map((utility, index) => (
            <React.Fragment key={index}>
              <span className={styles['ruler-item']} data-measure={`full-${index}`}>
                <Utility utility={utility} collapsed={false} />
              </span>
              <span className={styles['ruler-item']} data-measure={`collapsed-${index}`}>
                <Utility utility={utility} collapsed={true} />
              </span>
            </React.Fragment>
          ))}
          <span className={styles['ruler-item']} data-measure="overflow">
            <span className={styles['utility-slot']}>{overflowMenu}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
