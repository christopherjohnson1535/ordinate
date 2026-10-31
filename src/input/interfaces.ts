// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { CancelableEventHandler, KeyDetail as BaseKeyDetail, NonCancelableEventHandler } from '../internal/events';

export interface InputProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The current value. The input is controlled: update this in `onChange`.
   */
  value: string;
  /**
   * Called on every change with the new value in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<InputProps.ChangeDetail>;
  /**
   * The native input type. A `search` input shows a search icon, and a clear button while it has a value.
   */
  type?: InputProps.Type;
  /**
   * Hints which on-screen keyboard to show, such as `numeric` or `email`, without changing the type.
   */
  inputMode?: InputProps.InputMode;
  /**
   * The allowed increments of a `number` input, or `any`.
   */
  step?: InputProps.Step;
  /**
   * Hint text shown while the input is empty. Do not use it in place of a label.
   */
  placeholder?: string;
  /**
   * A short label drawn inside the top of the input, to save vertical space.
   * Use it only when the input is not in a `FormField` with a label.
   */
  inlineLabelText?: string;
  /**
   * Prevents changes and removes the input from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents changes but keeps the value focusable and selectable.
   */
  readOnly?: boolean;
  /**
   * Focuses the input when it first renders. Avoid it where the input may be out of view.
   */
  autoFocus?: boolean;
  /**
   * Accessible name, for inputs without a visible label.
   */
  ariaLabel?: string;
  /**
   * Marks the input as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * Accessible name of the clear button in a `search` input.
   */
  clearAriaLabel?: string;
  /**
   * The native `name` attribute.
   */
  name?: string;
  /**
   * `true` turns browser autocomplete on, `false` turns it off, and a string sets a specific hint such as `email`.
   */
  autoComplete?: boolean | string;
  /**
   * Turns off automatic correction and capitalization on devices that offer them.
   * Use it for values such as IDs, codes and host names.
   */
  disableBrowserAutocorrect?: boolean;
  /**
   * Turns the browser's spell check on or off. Leave it unset to use the browser default.
   * Turn it off for sensitive values, because some spell checkers send text to a service.
   */
  spellcheck?: boolean;
  /**
   * Called when the input gains focus.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when the input loses focus.
   */
  onBlur?: NonCancelableEventHandler;
  /**
   * Called when a key is pressed in the input, with the key and modifiers in `event.detail`.
   * Call `preventDefault()` to stop the key's default action.
   */
  onKeyDown?: CancelableEventHandler<InputProps.KeyDetail>;
  /**
   * Called when a key is released in the input, with the key and modifiers in `event.detail`.
   */
  onKeyUp?: CancelableEventHandler<InputProps.KeyDetail>;
}

export namespace InputProps {
  export type Type = 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel';

  export type InputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

  export type Step = number | 'any';

  export interface ChangeDetail {
    value: string;
  }

  export type KeyDetail = BaseKeyDetail;

  export interface Ref {
    /**
     * Moves keyboard focus to the input.
     */
    focus(): void;
    /**
     * Selects all of the input's text.
     */
    select(): void;
  }
}
