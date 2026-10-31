// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ModalProps } from './interfaces';
import { InternalModal } from './internal';

export type { ModalProps };

export default function Modal({
  visible,
  onDismiss,
  header,
  footer,
  children,
  size = 'medium',
  closeAriaLabel = 'Close',
  ...props
}: ModalProps) {
  return (
    <InternalModal
      {...getBaseProps(props)}
      visible={visible}
      onDismiss={onDismiss}
      header={header}
      footer={footer}
      size={size}
      closeAriaLabel={closeAriaLabel}
    >
      {children}
    </InternalModal>
  );
}
