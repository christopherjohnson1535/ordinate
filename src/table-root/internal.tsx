// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { TableContext, TableContextValue } from '../internal/context/table-context';
import { useResizeObserver } from '../internal/hooks/use-resize-observer';
import { TableRootProps } from './interfaces';
import { useStickyHeader } from './use-sticky-header';

import styles from './styles.css.js';

// The class that switches density tokens to their compact values for a subtree.
const compactModeClassName = 'ord-compact-mode';

export interface InternalTableRootProps extends TableRootProps {
  /**
   * Lets other components position the table. Not part of the public API.
   */
  className?: string;
  /**
   * Lines the outer columns up with the padding of a surrounding container.
   */
  edgeInset?: TableContextValue['edgeInset'];
  /**
   * The narrowest the table may get, in pixels, so a fixed layout keeps room for its flexible column.
   */
  minInlineSize?: number;
  tableRef?: React.RefObject<HTMLTableElement | null>;
}

export function InternalTableRoot({
  children,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ariaRowcount,
  stickyHeader = false,
  stickyHeaderVerticalOffset = 0,
  stripedRows = false,
  wrapLines = false,
  contentDensity = 'comfortable',
  layout = 'auto',
  edgeInset = 'cell',
  minInlineSize,
  className,
  tableRef: externalTableRef,
  ...rest
}: InternalTableRootProps) {
  const wrapperRef = useStickyHeader(stickyHeader, stickyHeaderVerticalOffset, styles['head-stuck']);
  const ownTableRef = useRef<HTMLTableElement>(null);
  const tableRef = externalTableRef ?? ownTableRef;
  const [scrollable, setScrollable] = useState(false);

  const checkScrollable = () => {
    const wrapper = wrapperRef.current;
    setScrollable(wrapper ? wrapper.scrollWidth > wrapper.clientWidth : false);
  };
  useResizeObserver(wrapperRef, checkScrollable);
  useResizeObserver(tableRef, checkScrollable);

  const context = useMemo<TableContextValue>(
    () => ({ wrapLines, stripedRows, layout, edgeInset }),
    [wrapLines, stripedRows, layout, edgeInset]
  );

  return (
    <div
      {...rest}
      ref={wrapperRef}
      className={clsx(styles.root, contentDensity === 'compact' && compactModeClassName, className)}
      // A table wider than its wrapper scrolls sideways, which keyboard users can only do once the
      // wrapper can take focus.
      tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? 'region' : undefined}
      aria-label={scrollable ? ariaLabel : undefined}
      aria-labelledby={scrollable ? ariaLabelledby : undefined}
    >
      <table
        ref={tableRef}
        className={clsx(styles.table, styles[`layout-${layout}`])}
        style={minInlineSize !== undefined ? { minInlineSize } : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-rowcount={ariaRowcount}
      >
        <TableContext.Provider value={context}>{children}</TableContext.Provider>
      </table>
    </div>
  );
}
