// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface BadgeProps extends BaseComponentProps {
  /**
   * The color of the badge:
   * * `grey` for neutral labels and counts.
   * * `blue`, `green` and `red` for information, success and errors.
   * * `severity-critical` to `severity-neutral` for a severity scale. Critical and high are red, medium and low
   *   are ochre, and neutral is grey. Critical has a heavier outline and low a dashed one, so the levels stay
   *   distinct without color.
   */
  color?: BadgeProps.Color;
  /**
   * Text displayed in the badge. Keep it to a word or a number.
   */
  children?: React.ReactNode;
}

export namespace BadgeProps {
  export type Color =
    | 'grey'
    | 'blue'
    | 'green'
    | 'red'
    | 'severity-critical'
    | 'severity-high'
    | 'severity-medium'
    | 'severity-low'
    | 'severity-neutral';
}
