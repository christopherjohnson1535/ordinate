// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileDropzoneProps extends BaseComponentProps {
  /**
   * Called when the user drops files on the zone, with the dropped files in `event.detail.value`.
   * Every dropped file is passed on, whatever its type, so check the files you receive.
   */
  onChange?: NonCancelableEventHandler<FileDropzoneProps.ChangeDetail>;
  /**
   * The content of the zone, usually a short instruction such as "Drop files to upload".
   * Dropping only works with a pointer, so offer a `FileInput` as well.
   */
  children?: React.ReactNode;
}

export namespace FileDropzoneProps {
  export interface ChangeDetail {
    value: File[];
  }
}
