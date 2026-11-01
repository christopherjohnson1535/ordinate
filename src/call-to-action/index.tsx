// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { CallToActionProps } from './interfaces';
import { InternalCallToAction } from './internal';

export type { CallToActionProps };

export default function CallToAction({
  heading,
  description,
  actions,
  children,
  tone = 'inverted',
  headingLevel = 2,
  ...props
}: CallToActionProps) {
  return (
    <InternalCallToAction
      {...getBaseProps(props)}
      heading={heading}
      description={description}
      actions={actions}
      tone={tone}
      headingLevel={headingLevel}
    >
      {children}
    </InternalCallToAction>
  );
}
