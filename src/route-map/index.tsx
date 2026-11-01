// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { RouteMapProps } from './interfaces';
import { InternalRouteMap } from './internal';

export type { RouteMapProps };

/**
 * A route of lines, each a row of stops, that bend at right angles onto one shared run into a
 * terminus, drawn like a transit map. Use it to show the parts of a course or a program and how far
 * someone has come. Each line can be a link.
 */
export default function RouteMap({
  lines,
  terminus,
  selectedLineId,
  currentStopId,
  currentStopLabel,
  ariaLabel,
  onFollow,
  ...props
}: RouteMapProps) {
  return (
    <InternalRouteMap
      {...getBaseProps(props)}
      lines={lines}
      terminus={terminus}
      selectedLineId={selectedLineId}
      currentStopId={currentStopId}
      currentStopLabel={currentStopLabel}
      ariaLabel={ariaLabel}
      onFollow={onFollow}
    />
  );
}
