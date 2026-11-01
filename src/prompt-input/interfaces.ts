// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { CancelableEventHandler, KeyDetail as BaseKeyDetail, NonCancelableEventHandler } from '../internal/events';

export interface PromptInputProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The text of the prompt. The prompt input is controlled: update this in `onChange`.
   */
  value: string;
  /**
   * Called on every change with the new text in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<PromptInputProps.ChangeDetail>;
  /**
   * Called when the user sends the prompt, by pressing Enter without Shift or by clicking the action
   * button, with the text in `event.detail.value`. Shift+Enter starts a new line instead. Clear
   * `value` here if the prompt should empty once sent.
   */
  onAction?: NonCancelableEventHandler<PromptInputProps.ActionDetail>;
  /**
   * The number of lines the prompt shows while it is empty or short.
   */
  minRows?: number;
  /**
   * The number of lines the prompt grows to before it scrolls. Set `-1` to let it grow without limit.
   */
  maxRows?: number;
  /**
   * The built-in icon of the action button.
   */
  actionButtonIconName?: IconProps.Name;
  /**
   * Accessible name of the action button. Defaults to "Send".
   */
  actionButtonAriaLabel?: string;
  /**
   * Disables the action button and sending with Enter, for example while a reply is still arriving
   * or while the prompt is empty. The text stays editable.
   */
  disableActionButton?: boolean;
  /**
   * Hint text shown while the prompt is empty. Do not use it in place of a label.
   */
  placeholder?: string;
  /**
   * Prevents changes and sending, and removes the prompt from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents changes and sending but keeps the text focusable and selectable.
   */
  readOnly?: boolean;
  /**
   * Controls shown in a row below the text, such as buttons to attach a file or pick a mode. The
   * action button moves into this row when it is set.
   */
  secondaryActions?: React.ReactNode;
  /**
   * Content shown above the text, inside the same box, such as the files attached to the prompt.
   */
  secondaryContent?: React.ReactNode;
  /**
   * Removes the padding around `secondaryActions`, for controls that bring their own.
   */
  disableSecondaryActionsPaddings?: boolean;
  /**
   * Moves focus to the prompt when it first renders.
   */
  autoFocus?: boolean;
  /**
   * The native `spellcheck` attribute. When not set, the browser decides.
   */
  spellcheck?: boolean;
  /**
   * Turns off browser autocorrect and automatic capitalization, for prompts such as commands or code.
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
   * Accessible name, for a prompt without a visible label.
   */
  ariaLabel?: string;
  /**
   * Marks the prompt as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * Called when a key is pressed in the prompt. Call `preventDefault()` to stop the key's default
   * action, including sending on Enter.
   */
  onKeyDown?: CancelableEventHandler<PromptInputProps.KeyDetail>;
  /**
   * Called when a key is released in the prompt.
   */
  onKeyUp?: CancelableEventHandler<PromptInputProps.KeyDetail>;
  /**
   * Called when the prompt gains focus.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when the prompt loses focus.
   */
  onBlur?: NonCancelableEventHandler;
}

export namespace PromptInputProps {
  export interface ChangeDetail {
    value: string;
  }

  export interface ActionDetail {
    value: string;
  }

  export type KeyDetail = BaseKeyDetail;

  export interface Ref {
    /**
     * Moves keyboard focus to the prompt.
     */
    focus(): void;
    /**
     * Selects all of the prompt's text.
     */
    select(): void;
  }
}
