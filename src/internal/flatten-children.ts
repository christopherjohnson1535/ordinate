// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

function flatten(children: React.ReactNode, keyPrefix: string): React.ReactNode[] {
  return React.Children.toArray(children).flatMap(child => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return [child];
    }
    const key = `${keyPrefix}${child.key}`;
    if (child.type === React.Fragment) {
      return flatten(child.props.children, key);
    }
    return [React.cloneElement(child, { key })];
  });
}

/**
 * The children of a layout as a flat list, with fragments expanded, so that every child placed in a
 * fragment still takes its own cell. Empty children are dropped and every element keeps a unique key.
 */
export function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  return flatten(children, '');
}

/**
 * A key for a child of `flattenChildren`, for the element that wraps it.
 */
export function childKey(child: React.ReactNode, index: number): React.Key {
  return React.isValidElement(child) && child.key !== null ? child.key : `index-${index}`;
}
