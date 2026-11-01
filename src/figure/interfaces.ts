// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface FigureProps extends BaseComponentProps {
  /**
   * The picture, usually a `Media`. It can also be a chart, a map or any drawing.
   */
  media?: React.ReactNode;
  /**
   * A sentence or two about the picture, shown below it.
   */
  caption?: React.ReactNode;
  /**
   * A short reference in front of the caption, such as "Fig. 1" or "Plate III", set in a typewriter
   * face.
   */
  label?: React.ReactNode;
  /**
   * Who made the picture, such as "Photo: Ana Ruiz". Shown in small type after the caption.
   */
  credit?: React.ReactNode;
}
