// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { SpaceBetweenProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalSpaceBetweenProps extends SpaceBetweenProps {
  /**
   * Lets other components position the layout. Not part of the public API.
   */
  className?: string;
}

interface Item {
  key: string;
  node: React.ReactNode;
}

// React.Children.toArray flattens arrays but keeps fragments whole. Each fragment child
// should still get its own slot, so fragments are opened here, with their key as a prefix
// to keep the keys unique.
function flattenChildren(children: React.ReactNode, keyPrefix = ''): Item[] {
  return React.Children.toArray(children).flatMap(child => {
    const key = `${keyPrefix}${React.isValidElement(child) ? child.key : ''}`;
    if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment) {
      return flattenChildren(child.props.children, `${key}/`);
    }
    return [{ key, node: child }];
  });
}

export function InternalSpaceBetween({
  direction = 'vertical',
  size,
  alignItems,
  className,
  children,
  ...rest
}: InternalSpaceBetweenProps) {
  return (
    <div
      {...rest}
      className={clsx(
        styles.root,
        styles[direction],
        styles[`size-${size}`],
        alignItems && styles[`align-${alignItems}`],
        className
      )}
    >
      {flattenChildren(children).map(({ key, node }) => (
        <div key={key} className={styles.child}>
          {node}
        </div>
      ))}
    </div>
  );
}
