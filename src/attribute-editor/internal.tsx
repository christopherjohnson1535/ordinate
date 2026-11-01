// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { getBreakpoint } from '../internal/breakpoints';
import { fireNonCancelableEvent } from '../internal/events';
import { getFirstTabbable } from '../internal/focus';
import { useContainerWidth } from '../internal/hooks/use-container-width';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalLiveRegion } from '../live-region/internal';
import { AttributeField } from './field';
import { AttributeEditorProps } from './interfaces';
import { isColumnLayout, resolveLayout, toGridTemplate } from './layout';

import styles from './styles.css.js';

export interface InternalAttributeEditorProps<T> extends AttributeEditorProps<T> {
  /**
   * Replaces the text of a row's remove button, such as "Undo" for a row that is marked for removal
   * rather than removed. Not part of the public API.
   */
  getRemoveButtonText?: (item: T, itemIndex: number) => string | undefined;
}

type PendingFocus = { type: 'add'; itemCount: number } | { type: 'remove'; itemIndex: number; itemCount: number };

type GridStyle = React.CSSProperties & { '--attribute-editor-columns': string };

const gridStyle = (template: string): GridStyle => ({ '--attribute-editor-columns': template });

function InternalAttributeEditorWithRef<T>(
  {
    items = [],
    definition,
    onAddButtonClick,
    onRemoveButtonClick,
    addButtonText,
    removeButtonText,
    removeButtonAriaLabel,
    isItemRemovable = () => true,
    empty,
    additionalInfo,
    disableAddButton = false,
    gridLayout,
    i18nStrings,
    getRemoveButtonText,
    ...rest
  }: InternalAttributeEditorProps<T>,
  ref: React.Ref<AttributeEditorProps.Ref>
) {
  const i18n = useInternalI18n('attribute-editor');
  const baseId = useId();
  const headingId = (fieldIndex: number) => `${baseId}heading-${fieldIndex}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(rootRef);
  // Until the editor is measured, as on the server, the stacked layout is the one that always fits.
  const layout = resolveLayout(gridLayout, definition.length, width === null ? 'default' : getBreakpoint(width));
  const columns = isColumnLayout(layout);
  const hasHeadings = definition.some(field => field.label || field.info);

  const addButtonRef = useRef<ButtonProps.Ref>(null);
  const pendingFocusRef = useRef<PendingFocus | null>(null);
  const [announcement, setAnnouncement] = useState('');

  // Rows and their buttons are looked up when needed, so render never depends on refs to them.
  const findRow = (itemIndex: number) =>
    rootRef.current?.querySelector<HTMLElement>(`.${styles.rows} > :nth-child(${itemIndex + 1})`) ?? null;

  const focusRemoveButton = (itemIndex: number) => {
    const button = findRow(itemIndex)?.querySelector<HTMLElement>(`.${styles['remove-button']}`);
    if (button) {
      button.focus();
    } else {
      addButtonRef.current?.focus();
    }
  };

  useImperativeHandle(ref, () => ({
    focusRemoveButton,
    focusAddButton: () => addButtonRef.current?.focus(),
  }));

  // Focus follows the change only once the new items arrive, which may be after an async update.
  useEffect(() => {
    const pending = pendingFocusRef.current;
    pendingFocusRef.current = null;
    if (pending?.type === 'add' && items.length > pending.itemCount) {
      const row = findRow(items.length - 1);
      (row && getFirstTabbable(row))?.focus();
    } else if (pending?.type === 'remove' && items.length < pending.itemCount) {
      focusRemoveButton(pending.itemIndex);
      setAnnouncement(
        i18n('itemRemovedAriaLive', i18nStrings?.itemRemovedAriaLive, { itemNumber: pending.itemIndex + 1 }) ?? ''
      );
    }
    // Only a change of items settles a pending focus move.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleAdd = () => {
    pendingFocusRef.current = { type: 'add', itemCount: items.length };
    setAnnouncement('');
    fireNonCancelableEvent(onAddButtonClick, null);
  };

  const handleRemove = (itemIndex: number) => {
    pendingFocusRef.current = { type: 'remove', itemIndex, itemCount: items.length };
    setAnnouncement('');
    fireNonCancelableEvent(onRemoveButtonClick, { itemIndex });
  };

  const renderRemoveButton = (item: T, itemIndex: number) =>
    isItemRemovable(item) ? (
      <InternalButton
        className={styles['remove-button']}
        formAction="none"
        ariaLabel={removeButtonAriaLabel?.(item)}
        onClick={() => handleRemove(itemIndex)}
      >
        {getRemoveButtonText?.(item, itemIndex) ?? i18n('removeButtonText', removeButtonText)}
      </InternalButton>
    ) : null;

  const renderField = (item: T, itemIndex: number, fieldIndex: number) => (
    <div key={fieldIndex} className={styles.field}>
      <AttributeField
        definition={definition[fieldIndex]}
        item={item}
        itemIndex={itemIndex}
        headingId={columns && hasHeadings ? headingId(fieldIndex) : undefined}
      />
    </div>
  );

  const renderColumnRow = (item: T, itemIndex: number) => (
    <>
      {definition.map((_, fieldIndex) => renderField(item, itemIndex, fieldIndex))}
      <div className={clsx(styles['remove-cell'], styles['remove-cell-aligned'])}>
        {renderRemoveButton(item, itemIndex)}
      </div>
    </>
  );

  const renderStackedRow = (item: T, itemIndex: number) => {
    let nextField = 0;
    const lastLine = layout.rows.length - 1;
    return (
      <>
        {layout.rows.map((widths, lineIndex) => {
          const fieldIndexes = widths.map(() => nextField++);
          const withButton = lineIndex === lastLine && !layout.removeButtonOwnRow;
          return (
            <div key={lineIndex} className={styles.line} style={gridStyle(toGridTemplate(widths, withButton))}>
              {fieldIndexes.map(fieldIndex => renderField(item, itemIndex, fieldIndex))}
              {withButton && (
                <div className={styles['remove-cell']}>
                  {hasHeadings && <span className={styles['label-spacer']} aria-hidden="true" />}
                  <div className={styles['remove-cell-aligned']}>{renderRemoveButton(item, itemIndex)}</div>
                </div>
              )}
            </div>
          );
        })}
        {layout.removeButtonOwnRow && <div className={styles['own-row']}>{renderRemoveButton(item, itemIndex)}</div>}
      </>
    );
  };

  return (
    <div {...rest} ref={rootRef} className={styles.root}>
      {items.length === 0 ? (
        empty && <div className={styles.empty}>{empty}</div>
      ) : (
        <div
          className={clsx(styles.grid, columns ? styles.columns : styles.stacked)}
          style={columns ? gridStyle(toGridTemplate(layout.rows[0], true)) : undefined}
        >
          {columns && hasHeadings && (
            <div className={styles.headings}>
              {definition.map((field, fieldIndex) => (
                <div key={fieldIndex} className={styles.heading}>
                  {field.label && (
                    <span id={headingId(fieldIndex)} className={styles['heading-label']}>
                      {field.label}
                    </span>
                  )}
                  {field.info && <span className={styles['heading-info']}>{field.info}</span>}
                </div>
              ))}
            </div>
          )}
          <ul className={styles.rows}>
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className={styles.row}>
                {columns ? renderColumnRow(item, itemIndex) : renderStackedRow(item, itemIndex)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.footer}>
        <InternalButton
          ref={addButtonRef}
          className={styles['add-button']}
          formAction="none"
          disabled={disableAddButton}
          onClick={handleAdd}
        >
          {i18n('addButtonText', addButtonText)}
        </InternalButton>
        {additionalInfo && <div className={styles['additional-info']}>{additionalInfo}</div>}
      </div>
      <InternalLiveRegion hidden={true}>{announcement}</InternalLiveRegion>
    </div>
  );
}

export const InternalAttributeEditor = React.forwardRef(InternalAttributeEditorWithRef) as <T>(
  props: InternalAttributeEditorProps<T> & { ref?: React.Ref<AttributeEditorProps.Ref> }
) => React.ReactElement;
