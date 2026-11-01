// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ExpandableSectionProps } from './interfaces';
import { InternalExpandableSection } from './internal';

export type { ExpandableSectionProps };

const ExpandableSection = React.forwardRef(
  (
    {
      variant = 'default',
      headerText,
      header,
      headerDescription,
      headerCounter,
      headerInfo,
      headerActions,
      headerAriaLabel,
      expanded,
      defaultExpanded = false,
      onChange,
      disableContentPaddings = false,
      headingTagOverride,
      children,
      ...props
    }: ExpandableSectionProps,
    ref: React.Ref<ExpandableSectionProps.Ref>
  ) => (
    <InternalExpandableSection
      {...getBaseProps(props)}
      ref={ref}
      variant={variant}
      headerText={headerText}
      header={header}
      headerDescription={headerDescription}
      headerCounter={headerCounter}
      headerInfo={headerInfo}
      headerActions={headerActions}
      headerAriaLabel={headerAriaLabel}
      expanded={expanded}
      defaultExpanded={defaultExpanded}
      onChange={onChange}
      disableContentPaddings={disableContentPaddings}
      headingTagOverride={headingTagOverride}
    >
      {children}
    </InternalExpandableSection>
  )
);

ExpandableSection.displayName = 'ExpandableSection';

export default ExpandableSection;
