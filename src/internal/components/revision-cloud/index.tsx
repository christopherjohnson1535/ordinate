// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '../../hooks/use-resize-observer';
import { cloudPath } from './path';

import styles from './styles.css.js';

export interface RevisionCloudProps {
  /**
   * Draws the cloud and its marker. Without it the content is shown as is.
   */
  active: boolean;
  /**
   * A short mark at the top end corner of the cloud, such as "△1". It is drawn only, so say the
   * same thing in text that is read, such as the error message.
   */
  marker?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

interface Size {
  width: number;
  height: number;
}

/**
 * Circles its content with a scalloped outline, as a drawing marks a part that needs revising.
 * The outline is measured from the content box, so it keeps whole scallops at any size.
 */
export function RevisionCloud({ active, marker, className, children }: RevisionCloudProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size | null>(null);

  useResizeObserver(rootRef, () => {
    const element = rootRef.current;
    if (!element) {
      return;
    }
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    setSize(current => (current?.width === width && current.height === height ? current : { width, height }));
  });

  const path = active && size ? cloudPath(size.width, size.height) : '';

  return (
    <div ref={rootRef} className={clsx(styles.root, active && styles.active, className)}>
      {children}
      {path && (
        <svg
          className={styles.cloud}
          aria-hidden="true"
          focusable="false"
          width={size!.width}
          height={size!.height}
          viewBox={`0 0 ${size!.width} ${size!.height}`}
        >
          <path d={path} />
        </svg>
      )}
      {active && marker && (
        <span className={styles.marker} aria-hidden="true">
          {marker}
        </span>
      )}
    </div>
  );
}
