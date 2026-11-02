// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { ConstructionTopLine } from '../internal/components/construction';
import { SlidingMarker, useSlidingMarker } from '../internal/components/sliding-marker';
import { getLogicalArrowStep } from '../internal/direction';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { isPlainLeftClick } from '../internal/link-click';
import { TabsProps } from './interfaces';
import { useScrollOverflow } from './use-scroll-overflow';

import styles from './styles.css.js';

interface Tooltip {
  index: number;
  left: number;
  top: number;
}

function firstEnabled(tabs: ReadonlyArray<TabsProps.Tab>) {
  return tabs.find(tab => !tab.disabled);
}

export function InternalTabs({
  tabs,
  activeTabId,
  onChange,
  variant = 'default',
  kind = 'neutral',
  ariaLabel,
  ariaLabelledby,
  disableContentPaddings = false,
  i18nStrings,
  ...rest
}: TabsProps) {
  const i18n = useInternalI18n('tabs');
  const baseId = useId();
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLElement | null)[]>([]);
  const [ownActiveTabId, setOwnActiveTabId] = useState(() => firstEnabled(tabs)?.id);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const overflow = useScrollOverflow(scrollerRef, rowRef);

  const requestedId = activeTabId ?? ownActiveTabId;
  const activeTab = tabs.find(tab => tab.id === requestedId) ?? firstEnabled(tabs);
  // The active tab holds the single tab stop of the list, unless it cannot take focus.
  const tabStop = activeTab && !activeTab.disabled ? activeTab : firstEnabled(tabs);

  const activeIndex = activeTab ? tabs.indexOf(activeTab) : -1;
  // The marker takes in the open tab's own action and close button, which sit beside it in the row.
  const marker = useSlidingMarker(rowRef, () => {
    const element = tabRefs.current[activeIndex];
    if (!element || !activeTab) {
      return [];
    }
    const extras = Array.from(rowRef.current?.querySelectorAll<HTMLElement>(`.${styles['tab-extras']}`) ?? []).find(
      candidate => candidate.getAttribute('data-tab-id') === activeTab.id
    );
    return extras ? [element, extras] : [element];
  });

  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = (index: number) => `${baseId}-panel-${index}`;
  const reasonId = (index: number) => `${baseId}-reason-${index}`;

  const activate = (tab: TabsProps.Tab) => {
    if (tab.disabled || tab.id === activeTab?.id) {
      return;
    }
    setOwnActiveTabId(tab.id);
    fireNonCancelableEvent(onChange, { activeTabId: tab.id, activeTabHref: tab.href });
  };

  const showTooltip = (index: number) => {
    const tab = tabs[index];
    const element = tabRefs.current[index];
    const header = headerRef.current;
    if (!tab.disabled || !tab.disabledReason || !element || !header) {
      return;
    }
    const tabRect = element.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    setTooltip({ index, left: tabRect.left - headerRect.left, top: tabRect.bottom - headerRect.top });
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const index = tabRefs.current.findIndex(element => element === event.target);
    if (index === -1) {
      return;
    }
    const last = tabs.length - 1;
    const step = getLogicalArrowStep(event.key, event.currentTarget);
    let target: number;
    if (step !== 0) {
      target = (index + step + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      target = 0;
    } else if (event.key === 'End') {
      target = last;
    } else {
      return;
    }
    event.preventDefault();
    tabRefs.current[target]?.focus();
    activate(tabs[target]);
  };

  const dismiss = (tab: TabsProps.Tab) => fireNonCancelableEvent(tab.onDismiss, { tabId: tab.id });

  // Tabs and their extra controls sit in one row, interleaved with `order`, while the tab
  // list itself holds only tabs, as the tab pattern requires.
  const renderTab = (tab: TabsProps.Tab, index: number) => {
    const isActive = tab.id === activeTab?.id;
    const tabProps = {
      ref: (element: HTMLElement | null) => {
        tabRefs.current[index] = element;
      },
      id: tabId(index),
      role: 'tab',
      className: clsx(
        styles.tab,
        isActive && styles['tab-active'],
        tab.disabled && styles['tab-disabled'],
        (tab.action || tab.dismissible) && styles['tab-with-extras']
      ),
      style: { order: index * 2 },
      'aria-selected': isActive,
      'aria-controls': panelId(index),
      'aria-disabled': tab.disabled ? true : undefined,
      'aria-describedby': tab.disabled && tab.disabledReason ? reasonId(index) : undefined,
      tabIndex: tab.id === tabStop?.id ? 0 : -1,
      'data-tab-id': tab.id,
      onMouseEnter: () => showTooltip(index),
      onMouseLeave: () => setTooltip(null),
      onFocus: () => showTooltip(index),
      onBlur: () => setTooltip(null),
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === 'Delete' && tab.dismissible && !tab.disabled) {
          event.preventDefault();
          dismiss(tab);
        }
      },
    };
    const label = (
      <>
        <span className={styles['tab-label']}>{tab.label}</span>
        {/* The space keeps the label and reference apart in the tab's name; the flex gap spaces them on screen. */}
        {tab.reference && (
          <>
            {' '}
            <span className={styles.reference}>{tab.reference}</span>
          </>
        )}
      </>
    );

    return tab.href && !tab.disabled ? (
      <a
        key={tab.id}
        {...tabProps}
        href={tab.href}
        onClick={event => {
          if (isPlainLeftClick(event)) {
            activate(tab);
          }
        }}
      >
        {label}
      </a>
    ) : (
      <button key={tab.id} {...tabProps} type="button" onClick={() => activate(tab)}>
        {label}
      </button>
    );
  };

  const renderExtras = (tab: TabsProps.Tab, index: number) => {
    if (!tab.action && !tab.dismissible) {
      return null;
    }
    const isActive = tab.id === activeTab?.id;
    return (
      <span key={tab.id} className={styles['tab-extras']} style={{ order: index * 2 + 1 }} data-tab-id={tab.id}>
        {tab.action && <span className={styles.action}>{tab.action}</span>}
        {tab.dismissible && (
          <button
            type="button"
            className={styles['dismiss-button']}
            aria-label={i18n('dismissAriaLabel', tab.dismissLabel ?? i18nStrings?.dismissAriaLabel)}
            // Only the active tab's close button is a tab stop; Delete on a tab closes it too.
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => dismiss(tab)}
          >
            <InternalIcon name="close" />
          </button>
        )}
      </span>
    );
  };

  const scrollButton = (direction: -1 | 1) => (
    <button
      type="button"
      className={clsx(styles['scroll-button'], styles[direction === -1 ? 'scroll-left' : 'scroll-right'])}
      aria-label={
        direction === -1
          ? i18n('scrollLeftAriaLabel', i18nStrings?.scrollLeftAriaLabel)
          : i18n('scrollRightAriaLabel', i18nStrings?.scrollRightAriaLabel)
      }
      // Keyboard users move through the tabs with the arrow keys, which scrolls them into view.
      tabIndex={-1}
      disabled={direction === -1 ? overflow.atStart : overflow.atEnd}
      onClick={() => overflow.scrollStep(direction)}
    >
      <InternalIcon name={direction === -1 ? 'chevron-left' : 'chevron-right'} />
    </button>
  );

  const tooltipTab = tooltip ? tabs[tooltip.index] : undefined;

  return (
    <div
      {...rest}
      className={clsx(
        styles.root,
        styles[`variant-${variant}`],
        styles[`kind-${kind}`],
        disableContentPaddings && styles['no-paddings']
      )}
    >
      {variant !== 'default' && <ConstructionTopLine kind={kind} />}
      <div ref={headerRef} className={styles.header}>
        {overflow.overflowing && scrollButton(-1)}
        <div ref={scrollerRef} className={styles.scroller} onScroll={overflow.measure}>
          <div ref={rowRef} className={styles['tab-row']}>
            <div
              role="tablist"
              className={styles['tab-list']}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              onKeyDown={onListKeyDown}
            >
              {tabs.map(renderTab)}
            </div>
            <div className={styles['tab-list']}>{tabs.map(renderExtras)}</div>
            {/* Crop marks stand at the corners of the open tab and slide to the next one. */}
            <SlidingMarker position={marker.position} placed={marker.placed} />
          </div>
        </div>
        {overflow.overflowing && scrollButton(1)}
        {tabs.map(
          (tab, index) =>
            tab.disabled &&
            tab.disabledReason && (
              <span key={tab.id} id={reasonId(index)} className={styles['disabled-reason']}>
                {tab.disabledReason}
              </span>
            )
        )}
        {tooltip && tooltipTab?.disabledReason && (
          // The reason is announced through the tab's description, so the visible copy stays out of the tree.
          <div className={styles.tooltip} style={{ left: tooltip.left, top: tooltip.top }} aria-hidden="true">
            {tooltipTab.disabledReason}
          </div>
        )}
      </div>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab?.id;
        return (
          <div
            key={tab.id}
            id={panelId(index)}
            role="tabpanel"
            className={styles.panel}
            aria-labelledby={tabId(index)}
            hidden={!isActive}
            tabIndex={isActive ? 0 : -1}
          >
            {isActive && tab.content}
          </div>
        );
      })}
    </div>
  );
}
