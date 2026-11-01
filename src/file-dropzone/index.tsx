// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { FileDropzoneProps } from './interfaces';
import { InternalFileDropzone } from './internal';

export type { FileDropzoneProps };

export default function FileDropzone({ onChange, children, ...props }: FileDropzoneProps) {
  return (
    <InternalFileDropzone {...getBaseProps(props)} onChange={onChange}>
      {children}
    </InternalFileDropzone>
  );
}
