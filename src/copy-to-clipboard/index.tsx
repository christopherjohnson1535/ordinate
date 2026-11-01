// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { CopyToClipboardProps } from './interfaces';
import { InternalCopyToClipboard } from './internal';

export type { CopyToClipboardProps };

export default function CopyToClipboard({
  textToCopy,
  variant = 'button',
  copyButtonText,
  copyButtonAriaLabel,
  copySuccessText,
  copyErrorText,
  textToDisplay,
  popoverRenderWithPortal = false,
  disabled = false,
  disabledReason,
  ...props
}: CopyToClipboardProps) {
  return (
    <InternalCopyToClipboard
      {...getBaseProps(props)}
      textToCopy={textToCopy}
      variant={variant}
      copyButtonText={copyButtonText}
      copyButtonAriaLabel={copyButtonAriaLabel}
      copySuccessText={copySuccessText}
      copyErrorText={copyErrorText}
      textToDisplay={textToDisplay}
      popoverRenderWithPortal={popoverRenderWithPortal}
      disabled={disabled}
      disabledReason={disabledReason}
    />
  );
}
