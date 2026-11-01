// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ArticleProps } from './interfaces';
import { InternalArticle } from './internal';

export type { ArticleProps };

export default function Article({
  children,
  lead,
  byline,
  dropCap = false,
  columns = 1,
  measure = 'default',
  ...props
}: ArticleProps) {
  return (
    <InternalArticle
      {...getBaseProps(props)}
      lead={lead}
      byline={byline}
      dropCap={dropCap}
      columns={columns}
      measure={measure}
    >
      {children}
    </InternalArticle>
  );
}
