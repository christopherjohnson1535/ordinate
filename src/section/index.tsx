// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SectionProps } from './interfaces';
import { InternalSection } from './internal';

export type { SectionProps };

export default function Section({
  children,
  heading,
  description,
  headingLevel = 2,
  actions,
  tone = 'default',
  width = 'default',
  spacing = 'default',
  rule = 'none',
  ...props
}: SectionProps) {
  return (
    <InternalSection
      {...getBaseProps(props)}
      heading={heading}
      description={description}
      headingLevel={headingLevel}
      actions={actions}
      tone={tone}
      width={width}
      spacing={spacing}
      rule={rule}
    >
      {children}
    </InternalSection>
  );
}
