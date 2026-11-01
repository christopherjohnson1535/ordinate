// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { PaginationProps } from './interfaces';
import { InternalPagination } from './internal';

export type { PaginationProps };

export default function Pagination({
  currentPageIndex,
  pagesCount,
  openEnd = false,
  disabled = false,
  ariaLabels,
  onChange,
  onNextPageClick,
  onPreviousPageClick,
  ...props
}: PaginationProps) {
  return (
    <InternalPagination
      {...getBaseProps(props)}
      currentPageIndex={currentPageIndex}
      pagesCount={pagesCount}
      openEnd={openEnd}
      disabled={disabled}
      ariaLabels={ariaLabels}
      onChange={onChange}
      onNextPageClick={onNextPageClick}
      onPreviousPageClick={onPreviousPageClick}
    />
  );
}
