// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Header from '../header';
import { HeaderProps } from '../header/interfaces';
import { InternalHeader } from '../header/internal';

const isPresent = (node: React.ReactNode) => node !== undefined && node !== null && node !== false && node !== '';

/**
 * Turns a header counter such as "(12)" into the label of a dimension line, "12". The brackets only set the
 * count apart from the heading text, which the dimension line already does.
 */
export function toMeasure(counter: React.ReactNode): React.ReactNode {
  if (typeof counter === 'string') {
    const match = /^\s*\((.*)\)\s*$/.exec(counter);
    return match ? match[1] : counter;
  }
  return counter;
}

/**
 * Moves the counter of a Header passed as a collection's `header` into the dimension line on the collection's
 * opening construction line, as Container draws its `measure`. The heading keeps the counter for screen readers,
 * wrapped in `hiddenClassName`, so its name does not change; the dimension line is then drawing only. Any other
 * header is returned as it is, with no measure.
 */
export function liftHeaderCounter(
  header: React.ReactNode,
  hiddenClassName: string
): { header: React.ReactNode; measure: React.ReactNode } {
  if (!React.isValidElement<HeaderProps>(header) || (header.type !== Header && header.type !== InternalHeader)) {
    return { header, measure: undefined };
  }
  const { counter } = header.props;
  if (!isPresent(counter)) {
    return { header, measure: undefined };
  }
  return {
    header: React.cloneElement(header, { counter: <span className={hiddenClassName}>{counter}</span> }),
    measure: toMeasure(counter),
  };
}
