// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { PopoverProps } from './interfaces';
import { InternalPopover } from './internal';

export type { PopoverProps };

const Popover = React.forwardRef(
  (
    {
      children,
      content,
      header,
      position = 'right',
      size = 'medium',
      fixedWidth = false,
      triggerType = 'text',
      wrapTriggerText = true,
      dismissButton = true,
      dismissAriaLabel,
      renderWithPortal = false,
      ...props
    }: PopoverProps,
    ref: React.Ref<PopoverProps.Ref>
  ) => (
    <InternalPopover
      {...getBaseProps(props)}
      ref={ref}
      content={content}
      header={header}
      position={position}
      size={size}
      fixedWidth={fixedWidth}
      triggerType={triggerType}
      wrapTriggerText={wrapTriggerText}
      dismissButton={dismissButton}
      dismissAriaLabel={dismissAriaLabel}
      renderWithPortal={renderWithPortal}
    >
      {children}
    </InternalPopover>
  )
);

Popover.displayName = 'Popover';

export default Popover;
