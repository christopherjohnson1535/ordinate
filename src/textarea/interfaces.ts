// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { CancelableEventHandler, NonCancelableEventHandler } from '../internal/events';

export interface TextareaProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The current value. The textarea is controlled: update this in `onChange`.
   */
  value: string;
  /**
   * Called on every change with the new value in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<TextareaProps.ChangeDetail>;
  /**
   * The number of lines of text the textarea shows before it scrolls.
   */
  rows?: number;
  /**
   * The directions in which the user can resize the textarea:
   * * `vertical` changes the height only. The textarea always fills the width of its container.
   * * `none` keeps the size fixed. Set `rows` to fit the expected text.
   */
  resize?: TextareaProps.Resize;
  /**
   * Hint text shown while the textarea is empty. Do not use it in place of a label.
   */
  placeholder?: string;
  /**
   * Prevents changes and removes the textarea from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents changes but keeps the text focusable and selectable.
   */
  readOnly?: boolean;
  /**
   * Marks the value as acceptable but worth a second look. An error from `invalid` or the
   * surrounding `FormField` takes precedence. Say what the warning is about in text next to the
   * textarea and point to it with `ariaDescribedby`.
   */
  warning?: boolean;
  /**
   * Moves focus to the textarea when it first renders. Use it only when the textarea is the obvious
   * next step, such as the only field in a modal.
   */
  autoFocus?: boolean;
  /**
   * The native `spellcheck` attribute. When not set, the browser decides. Turn it off for sensitive
   * text: some spellcheckers send the text to an outside service.
   */
  spellcheck?: boolean;
  /**
   * Turns off browser autocorrect and automatic capitalization, for text such as code or identifiers.
   */
  disableBrowserAutocorrect?: boolean;
  /**
   * `true` turns browser autocomplete on, `false` turns it off, and a string sets a specific hint.
   */
  autoComplete?: boolean | string;
  /**
   * The native `name` attribute.
   */
  name?: string;
  /**
   * Accessible name, for a textarea without a visible label.
   */
  ariaLabel?: string;
  /**
   * Marks the textarea as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * Called when a key is pressed in the textarea. Call `preventDefault()` to stop the key's default
   * action, such as inserting a line break.
   */
  onKeyDown?: CancelableEventHandler<TextareaProps.KeyDetail>;
  /**
   * Called when a key is released in the textarea.
   */
  onKeyUp?: CancelableEventHandler<TextareaProps.KeyDetail>;
  /**
   * Called when the textarea gains focus.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when the textarea loses focus.
   */
  onBlur?: NonCancelableEventHandler;
}

export namespace TextareaProps {
  export type Resize = 'vertical' | 'none';

  export interface ChangeDetail {
    value: string;
  }

  export interface KeyDetail {
    key: string;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    /**
     * Whether an input method editor is composing text. Ignore key presses while it is.
     */
    isComposing: boolean;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the textarea.
     */
    focus(): void;
    /**
     * Selects all of the textarea's text.
     */
    select(): void;
  }
}
