// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface SliderProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The current value. The slider is controlled: update this in `onChange`.
   */
  value: number;
  /**
   * The smallest value.
   */
  min: number;
  /**
   * The largest value.
   */
  max: number;
  /**
   * The amount each step moves the value. Defaults to 1.
   */
  step?: number;
  /**
   * Called as the user drags the thumb or presses an arrow key, with the new value in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<SliderProps.ChangeDetail>;
  /**
   * Prevents changes and removes the slider from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents changes but keeps the slider focusable, so the value can still be read.
   */
  readOnly?: boolean;
  /**
   * Draws a tick at every step, like the graduations of a ruler. Use it when there are few steps.
   */
  tickMarks?: boolean;
  /**
   * Hides the line that fills the track from the minimum to the value.
   */
  hideFillLine?: boolean;
  /**
   * Values to label below the track, between the minimum and the maximum, which are always labeled.
   */
  referenceValues?: ReadonlyArray<number>;
  /**
   * Formats a value for the labels below the track, the value shown while the slider is in use,
   * and what screen readers announce, such as `value => `${value}%``.
   */
  valueFormatter?: (value: number) => string;
  /**
   * Accessible name, for a slider without a visible label.
   */
  ariaLabel?: string;
  /**
   * Extra description for screen readers, such as what the values mean.
   */
  ariaDescription?: string;
  /**
   * Called when the slider gains focus.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when the slider loses focus.
   */
  onBlur?: NonCancelableEventHandler;
}

export namespace SliderProps {
  export interface ChangeDetail {
    value: number;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the slider.
     */
    focus(): void;
  }
}
