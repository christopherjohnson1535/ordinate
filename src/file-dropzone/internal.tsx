// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { fireNonCancelableEvent } from '../internal/events';
import { hasFiles, useFilesDragging } from '../internal/hooks/use-files-dragging';
import { FileDropzoneProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalFileDropzoneProps extends FileDropzoneProps {
  /**
   * Lets other components position the zone. Not part of the public API.
   */
  className?: string;
}

export function InternalFileDropzone({ onChange, children, className, ...rest }: InternalFileDropzoneProps) {
  const pageDragging = useFilesDragging();
  const [over, setOver] = useState(false);

  const accept = (event: React.DragEvent<HTMLDivElement>) => {
    if (!hasFiles(event.dataTransfer)) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setOver(true);
  };

  const leave = (event: React.DragEvent<HTMLDivElement>) => {
    // Leave also fires when the pointer moves onto a child of the zone, which is still over it.
    const next = event.relatedTarget;
    if (!(next instanceof Node && event.currentTarget.contains(next))) {
      setOver(false);
    }
  };

  const drop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOver(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length > 0) {
      fireNonCancelableEvent(onChange, { value: files });
    }
  };

  // A drag that ends elsewhere, such as outside the window, never leaves the zone.
  const active = over && pageDragging;

  return (
    <div
      {...rest}
      className={clsx(styles.root, pageDragging && styles['page-dragging'], active && styles.active, className)}
      onDragEnter={accept}
      onDragOver={accept}
      onDragLeave={leave}
      onDrop={drop}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
}
