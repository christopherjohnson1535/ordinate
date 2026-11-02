// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ModalProps } from './interfaces';
import { InternalModal } from './internal';

export type { ModalProps };

export default function Modal({
  kind = 'neutral',
  reference,
  visible,
  onDismiss,
  header,
  footer,
  children,
  size = 'medium',
  position = 'center',
  disableContentPaddings = false,
  hideDismissButton = false,
  closeAriaLabel,
  ...props
}: ModalProps) {
  return (
    <InternalModal
      {...getBaseProps(props)}
      kind={kind}
      reference={reference}
      visible={visible}
      onDismiss={onDismiss}
      header={header}
      footer={footer}
      size={size}
      position={position}
      disableContentPaddings={disableContentPaddings}
      hideDismissButton={hideDismissButton}
      closeAriaLabel={closeAriaLabel}
    >
      {children}
    </InternalModal>
  );
}
