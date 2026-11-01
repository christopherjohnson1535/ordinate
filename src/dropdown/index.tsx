// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { DropdownProps } from './interfaces';
import { InternalDropdown } from './internal';

export type { DropdownProps };

export default function Dropdown({
  open,
  trigger,
  content,
  header,
  footer,
  onOutsideClick,
  onEscape,
  minWidth = 'trigger',
  maxWidth = 'none',
  ariaRole,
  ariaLabel,
  ariaLabelledby,
  ...props
}: DropdownProps) {
  return (
    <InternalDropdown
      {...getBaseProps(props)}
      open={open}
      trigger={trigger}
      content={content}
      header={header}
      footer={footer}
      onOutsideClick={onOutsideClick}
      onEscape={onEscape}
      minWidth={minWidth}
      maxWidth={maxWidth}
      ariaRole={ariaRole}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
    />
  );
}
