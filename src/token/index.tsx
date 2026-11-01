// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TokenProps } from './interfaces';
import { InternalToken } from './internal';

export type { TokenProps };

export default function Token({
  label,
  labelTag,
  description,
  tags,
  icon,
  variant = 'normal',
  disabled = false,
  readOnly = false,
  onDismiss,
  dismissLabel,
  tooltipContent,
  ...props
}: TokenProps) {
  return (
    <InternalToken
      {...getBaseProps(props)}
      label={label}
      labelTag={labelTag}
      description={description}
      tags={tags}
      icon={icon}
      variant={variant}
      disabled={disabled}
      readOnly={readOnly}
      onDismiss={onDismiss}
      dismissLabel={dismissLabel}
      tooltipContent={tooltipContent}
    />
  );
}
