// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ContainerProps } from './interfaces';
import { InternalContainer } from './internal';

export type { ContainerProps };

export default function Container({
  kind = 'neutral',
  reference,
  heading,
  headingLevel = 2,
  description,
  measure,
  actions,
  footer,
  fitHeight = false,
  children,
  ...props
}: ContainerProps) {
  return (
    <InternalContainer
      {...getBaseProps(props)}
      kind={kind}
      reference={reference}
      heading={heading}
      headingLevel={headingLevel}
      description={description}
      measure={measure}
      actions={actions}
      footer={footer}
      fitHeight={fitHeight}
    >
      {children}
    </InternalContainer>
  );
}
