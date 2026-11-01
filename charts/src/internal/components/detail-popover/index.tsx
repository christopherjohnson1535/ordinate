// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Button, { ButtonProps } from '@ordinate/components/button';
import clsx from 'clsx';

import { SeriesStyle } from '../../series-style';
import { FloatingPanel } from '../floating-panel';
import { Swatch, SwatchKind } from '../marks';

import styles from './styles.css.js';

export interface DetailRow {
  id: string;
  title: React.ReactNode;
  value: React.ReactNode;
  kind?: SwatchKind;
  style?: SeriesStyle;
  emphasized?: boolean;
  dimmed?: boolean;
}

export interface DetailPopoverProps {
  trigger: React.RefObject<Element | null>;
  /** Changes when the trigger moves to another position. */
  triggerKey: string | number;
  header: React.ReactNode;
  rows: ReadonlyArray<DetailRow>;
  /** A row set apart below the others, such as the total of a stack. */
  summary?: DetailRow;
  footer?: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  /**
   * A pinned popover is a dialog with a close button. Otherwise it only mirrors what the chart
   * announces, so it is hidden from assistive technology.
   */
  pinned: boolean;
  dismissAriaLabel: string;
  onDismiss: () => void;
  dismissButtonRef?: React.Ref<ButtonProps.Ref>;
  panelRef?: React.Ref<HTMLSpanElement>;
  onKeyDown?: React.KeyboardEventHandler;
  onBlur?: React.FocusEventHandler;
  className?: string;
}

function Row({ row, className }: { row: DetailRow; className?: string }) {
  return (
    <span
      className={clsx(
        styles.row,
        row.emphasized && styles['row-emphasized'],
        row.dimmed && styles['row-dimmed'],
        className
      )}
    >
      <span className={styles.key}>
        {row.kind && row.style && <Swatch kind={row.kind} seriesStyle={row.style} />}
        <span className={styles['key-text']}>{row.title}</span>
      </span>
      <span className={styles.value}>{row.value}</span>
    </span>
  );
}

/**
 * The values at one position of a chart, next to it.
 */
export function DetailPopover({
  trigger,
  triggerKey,
  header,
  rows,
  summary,
  footer,
  size,
  pinned,
  dismissAriaLabel,
  onDismiss,
  dismissButtonRef,
  panelRef,
  onKeyDown,
  onBlur,
  className,
}: DetailPopoverProps) {
  const headerId = React.useId();
  return (
    <FloatingPanel
      ref={panelRef}
      trigger={trigger}
      triggerKey={triggerKey}
      preferredSide="right"
      gap={6}
      role={pinned ? 'dialog' : undefined}
      aria-labelledby={pinned ? headerId : undefined}
      aria-hidden={pinned ? undefined : true}
      className={clsx(styles.root, styles[`size-${size}`], className)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <span className={styles.header}>
        <span id={headerId} className={styles.title}>
          {header}
        </span>
        {pinned && (
          <span className={styles.dismiss}>
            <Button
              ref={dismissButtonRef}
              variant="icon"
              iconName="close"
              formAction="none"
              ariaLabel={dismissAriaLabel}
              onClick={onDismiss}
            />
          </span>
        )}
      </span>
      <span className={styles.rows}>
        {rows.map(row => (
          <Row key={row.id} row={row} />
        ))}
        {summary && <Row row={summary} className={styles.summary} />}
      </span>
      {footer && <span className={styles.footer}>{footer}</span>}
    </FloatingPanel>
  );
}
