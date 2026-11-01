// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface HotspotProps extends BaseComponentProps {
  /**
   * Names this anchor. Tutorial steps point at it through their `hotspotId`.
   */
  hotspotId: string;
  /**
   * The element the hotspot marks. Leave it out to place the hotspot on its own, next to the
   * element it is about.
   */
  children?: React.ReactNode;
  /**
   * Which side of `children` the marker sits on. `right` and `left` follow the reading
   * direction, so `right` is on the left in right-to-left layout.
   */
  side?: HotspotProps.Side;
  /**
   * The side of the marker the annotation opens on. `right` and `left` follow the reading
   * direction. When there is no room on this side, the annotation opens on the opposite side.
   */
  direction?: HotspotProps.Direction;
}

export namespace HotspotProps {
  export type Side = 'left' | 'right';

  export type Direction = 'top' | 'right' | 'bottom' | 'left';
}
