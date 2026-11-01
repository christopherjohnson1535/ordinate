// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ButtonDropdownProps } from './interfaces';
import { InternalButtonDropdown } from './internal';

export type { ButtonDropdownProps };

const ButtonDropdown = React.forwardRef(
  (
    {
      items,
      expandableGroups = false,
      onItemClick,
      onItemFollow,
      children,
      variant = 'normal',
      mainAction,
      expandToViewport = false,
      disabled = false,
      loading = false,
      loadingText,
      ariaLabel,
      ...props
    }: ButtonDropdownProps,
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => (
    <InternalButtonDropdown
      {...getBaseProps(props)}
      ref={ref}
      items={items}
      expandableGroups={expandableGroups}
      onItemClick={onItemClick}
      onItemFollow={onItemFollow}
      variant={variant}
      mainAction={mainAction}
      expandToViewport={expandToViewport}
      disabled={disabled}
      loading={loading}
      loadingText={loadingText}
      ariaLabel={ariaLabel}
    >
      {children}
    </InternalButtonDropdown>
  )
);

ButtonDropdown.displayName = 'ButtonDropdown';

export default ButtonDropdown;
