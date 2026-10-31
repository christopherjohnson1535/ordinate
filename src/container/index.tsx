// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ContainerProps } from './interfaces';
import { InternalContainer } from './internal';

export type { ContainerProps };

export default function Container({
  header,
  disableHeaderPaddings = false,
  disableContentPaddings = false,
  footer,
  disableFooterPaddings = false,
  fitHeight = false,
  variant = 'default',
  children,
  ...props
}: ContainerProps) {
  return (
    <InternalContainer
      {...getBaseProps(props)}
      header={header}
      disableHeaderPaddings={disableHeaderPaddings}
      disableContentPaddings={disableContentPaddings}
      footer={footer}
      disableFooterPaddings={disableFooterPaddings}
      fitHeight={fitHeight}
      variant={variant}
    >
      {children}
    </InternalContainer>
  );
}
