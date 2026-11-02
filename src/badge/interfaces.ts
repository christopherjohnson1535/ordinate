// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface BadgeProps extends BaseComponentProps {
  /**
   * What the badge means. The badge is set in small mono capitals in ink with a key square in the tone's
   * color before it, like a key on a drawing.
   * - `neutral` for plain labels and counts.
   * - `note`, `complete` and `fault` for information, done and failed.
   * - `critical`, `high`, `medium` and `low` for a severity scale. Critical and high are red, medium and low
   *   ochre. Critical and high have a solid square, medium a half-filled one and low an open one, and
   *   critical is set in bold, so the levels stay distinct without color.
   */
  tone?: BadgeProps.Tone;
  /**
   * Deprecated: use `tone`. The old colors, such as `green` for `complete` and `severity-high` for `high`, still
   * work with a warning until the next major version.
   */
  color?: BadgeProps.Color;
  /**
   * Text displayed in the badge. Keep it to a word or a number.
   */
  children?: React.ReactNode;
}

export namespace BadgeProps {
  export type Tone = 'neutral' | 'note' | 'complete' | 'fault' | 'critical' | 'high' | 'medium' | 'low';

  /**
   * Deprecated: the old colors. Use `Tone`.
   */
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
