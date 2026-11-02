// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { CheckboxProps } from '../checkbox/interfaces';
import { InternalCheckbox } from '../checkbox/internal';
import { DimensionLine } from '../internal/components/dimension-line';
import { SheetFrame } from '../internal/components/sheet-frame';
import { FormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { useResizeObserver } from '../internal/hooks/use-resize-observer';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalItemCard } from '../item-card/internal';
import { InternalRadioButton } from '../radio-button/internal';
import { InternalStatusIndicator } from '../status-indicator/internal';
import { liftHeaderCounter } from '../table/header-counter';
import { CardsProps } from './interfaces';
import { defaultCardsPerRow, getCardsPerRow, getSectionWidth, getTrackKey, getVisibleSections } from './utils';

import styles from './styles.css.js';

type ControlRef = CheckboxProps.Ref;

export function InternalCards<T>({
  items,
  cardDefinition,
  cardsPerRow = defaultCardsPerRow,
  trackBy,
  selectionType,
  selectedItems = [],
  onSelectionChange,
  isItemDisabled,
  loading = false,
  loadingText,
  empty,
  header,
  filter,
  pagination,
  preferences,
  visibleSections,
  ariaLabels,
  variant = 'container',
  entireCardClickable = false,
  kind = 'neutral',
  ...rest
}: CardsProps<T>) {
  const i18n = useInternalI18n('cards');
  const baseId = useId();
  const headerId = `${baseId}header`;
  const groupName = `ord-cards-${baseId}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useResizeObserver(rootRef, () => setWidth(rootRef.current?.getBoundingClientRect().width ?? 0));
  const columns = getCardsPerRow(cardsPerRow, width);

  const controlRefs = useRef<(ControlRef | null)[]>([]);
  const selectedKeys = new Set(selectedItems.map(item => getTrackKey(trackBy, item)));
  const isSelected = (item: T) => selectedKeys.has(getTrackKey(trackBy, item));
  const isDisabled = (item: T) => Boolean(isItemDisabled?.(item));

  const select = (item: T) => {
    if (isDisabled(item)) {
      return;
    }
    if (selectionType === 'single') {
      if (!isSelected(item)) {
        fireNonCancelableEvent(onSelectionChange, { selectedItems: [item] });
      }
      return;
    }
    const key = getTrackKey(trackBy, item);
    const next = isSelected(item)
      ? selectedItems.filter(selected => getTrackKey(trackBy, selected) !== key)
      : [...selectedItems, item];
    fireNonCancelableEvent(onSelectionChange, { selectedItems: next });
  };

  // Clicks on the control or on links and buttons inside the card do their own thing.
  const handleCardClick = (event: React.MouseEvent, item: T, index: number) => {
    if ((event.target as Element).closest('input, label, a, button') || isDisabled(item)) {
      return;
    }
    controlRefs.current[index]?.focus();
    select(item);
  };

  const sections = getVisibleSections(cardDefinition.sections ?? [], visibleSections);

  const renderSelectionControl = (item: T, index: number, cardHeaderId: string) => {
    const label = ariaLabels?.itemSelectionLabel?.({ selectedItems }, item);
    const common = {
      ref: (control: ControlRef | null) => {
        controlRefs.current[index] = control;
      },
      disabled: isDisabled(item),
      ariaLabel: label,
      ariaLabelledby: label ? undefined : cardHeaderId,
    };
    return selectionType === 'single' ? (
      <InternalRadioButton {...common} name={groupName} checked={isSelected(item)} onSelect={() => select(item)} />
    ) : (
      <InternalCheckbox {...common} checked={isSelected(item)} onChange={() => select(item)} />
    );
  };

  const renderCard = (item: T, index: number) => {
    const cardHeaderId = `${baseId}card${index}`;
    const selected = Boolean(selectionType) && isSelected(item);
    const disabled = isDisabled(item);
    const cardHeader = cardDefinition.header?.(item);
    return (
      <InternalItemCard
        className={clsx(styles.card, Boolean(selectionType) && disabled && styles['card-disabled'])}
        header={cardHeader !== undefined && <span id={cardHeaderId}>{cardHeader}</span>}
        reference={cardDefinition.reference?.(item)}
        kind={kind}
        selected={selected}
        disabled={Boolean(selectionType) && disabled}
        selectionControl={selectionType && renderSelectionControl(item, index, cardHeaderId)}
        onClick={selectionType && entireCardClickable ? event => handleCardClick(event, item, index) : undefined}
      >
        {sections.length > 0 && (
          <div className={styles.sections}>
            {sections.map((section, sectionIndex) => (
              <div
                key={section.id ?? sectionIndex}
                className={styles.section}
                style={{ flexBasis: `${getSectionWidth(section.width)}%` }}
              >
                {section.header && <div className={styles['section-header']}>{section.header}</div>}
                {section.content && <div className={styles['section-content']}>{section.content(item)}</div>}
              </div>
            ))}
          </div>
        )}
      </InternalItemCard>
    );
  };

  const listLabel = ariaLabels?.cardsLabel ?? (selectionType ? ariaLabels?.selectionGroupLabel : undefined);

  let body: React.ReactNode;
  if (loading) {
    body = (
      <div className={styles.loading}>
        <InternalStatusIndicator state="loading">{i18n('loadingText', loadingText)}</InternalStatusIndicator>
      </div>
    );
  } else if (items.length === 0) {
    body = <div className={styles.empty}>{empty}</div>;
  } else {
    body = (
      <ul
        className={styles.list}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        aria-label={listLabel}
        aria-labelledby={!listLabel && header ? headerId : undefined}
      >
        {/* Cards label their own controls; a surrounding form field must not reach every one of them. */}
        <FormFieldContext.Provider value={{}}>
          {items.map((item, index) => (
            <li key={String(trackBy ? getTrackKey(trackBy, item) : index)} className={styles.item}>
              {renderCard(item, index)}
            </li>
          ))}
        </FormFieldContext.Provider>
      </ul>
    );
  }

  // On a sheet the count stands in a dimension line under the heading, as in Container.
  // The heading still holds it for screen readers. The full-page variant has no sheet, so its header shows it.
  const onSheet = variant === 'container';
  const lifted = onSheet ? liftHeaderCounter(header, styles['screenreader-only']) : { header, measure: undefined };

  const hasTools = Boolean(filter || pagination || preferences);
  const heading =
    header || hasTools ? (
      <div className={styles.heading}>
        {header && (
          <div id={headerId} className={styles.header}>
            {lifted.header}
          </div>
        )}
        {lifted.measure !== undefined && (
          <div className={styles.measure} aria-hidden="true">
            <DimensionLine label={lifted.measure} />
          </div>
        )}
        {hasTools && (
          <div className={styles.tools}>
            {filter && <div className={styles.filter}>{filter}</div>}
            {(pagination || preferences) && (
              <div className={styles['tools-end']}>
                {pagination && <div className={styles.pagination}>{pagination}</div>}
                {preferences && <div className={styles.preferences}>{preferences}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    ) : undefined;

  return (
    <div {...rest} ref={rootRef} className={clsx(styles.root, styles[`variant-${variant}`])}>
      {variant === 'container' ? (
        <SheetFrame header={heading}>{body}</SheetFrame>
      ) : (
        <>
          {heading}
          {body}
        </>
      )}
    </div>
  );
}
