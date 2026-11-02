// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface StatusIndicatorProps extends BaseComponentProps {
  /**
   * The state to show. It picks the mark and its color; the text stays in ink. The names match the icons:
   * - `complete`, `caution`, `fault` and `note` for done, needs attention, failed and for information.
   * - `underway`, `waiting`, `halted` and `queued` for running, waiting on something, stopped and not started.
   * - `loading` shows a spinner.
   */
  state?: StatusIndicatorProps.State;
  /**
   * Text that describes the state, such as "Running" or "3 errors".
   */
  children?: React.ReactNode;
  /**
   * Accessible name for the mark. Without it the mark is decorative. Set it when the text alone does not
   * say what the state is, for example when the text is a time stamp.
   */
  iconAriaLabel?: string;
  /**
   * Replaces the color of the mark that comes with `state`. The mark keeps its shape.
   */
  tone?: StatusIndicatorProps.Tone;
  /**
   * Deprecated: use `state`. The old status names, such as `success` for `complete`, still work with a warning
   * until the next major version.
   */
  type?: StatusIndicatorProps.Type;
  /**
   * Deprecated: use `tone`. The old colors, such as `green` for `complete`, still work with a warning until the
   * next major version.
   */
  colorOverride?: StatusIndicatorProps.Color;
  /**
   * Whether long text wraps onto more lines. When `false`, the text stays on one line and is cut off with
   * an ellipsis.
   */
  wrapText?: boolean;
}

export namespace StatusIndicatorProps {
  export type State =
    'complete' | 'caution' | 'fault' | 'note' | 'underway' | 'waiting' | 'halted' | 'queued' | 'loading';

  export type Tone = 'complete' | 'caution' | 'fault' | 'note' | 'neutral';

  /**
   * Deprecated: the old names of the states. Use `State`.
   */
  export type Type =
    'error' | 'warning' | 'success' | 'info' | 'stopped' | 'pending' | 'in-progress' | 'not-started' | 'loading';

  /**
   * Deprecated: the old colors. Use `Tone`.
   */
  export type Color = 'blue' | 'grey' | 'green' | 'red' | 'yellow';
}
