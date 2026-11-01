// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface CopyToClipboardProps extends BaseComponentProps {
  /**
   * The text written to the clipboard when the user clicks the button.
   */
  textToCopy: string;
  /**
   * How the copy action looks:
   * * `button`: a button with the copy icon and `copyButtonText`.
   * * `icon`: an icon-only button, named by `copyButtonAriaLabel`.
   * * `inline`: `textToDisplay` followed by a small icon button, for use in text or a key-value list.
   */
  variant?: CopyToClipboardProps.Variant;
  /**
   * Text of the `button` variant. Defaults to "Copy".
   */
  copyButtonText?: string;
  /**
   * Accessible name of the button. The `icon` and `inline` variants need it because their
   * button shows no text; it defaults to `copyButtonText`, then to "Copy". In the `button`
   * variant it replaces the visible text for screen readers.
   */
  copyButtonAriaLabel?: string;
  /**
   * Shown next to the button and announced after the text was copied. Defaults to "Copied".
   */
  copySuccessText?: string;
  /**
   * Shown next to the button and announced when the browser refused to copy, for example
   * because the page does not have clipboard permission. Defaults to "Failed to copy".
   */
  copyErrorText?: string;
  /**
   * The text shown by the `inline` variant. Defaults to `textToCopy`. Use it to show a
   * shortened or formatted version, such as a truncated key.
   */
  textToDisplay?: string;
  /**
   * Renders the feedback message at the end of the page body, so a container that clips
   * its content, such as a scrolling table, does not cut it off.
   */
  popoverRenderWithPortal?: boolean;
  /**
   * Renders the button as disabled. Nothing is copied.
   */
  disabled?: boolean;
  /**
   * Says why the button is disabled. It shows in a tooltip on hover and focus, and the
   * disabled button stays focusable so keyboard users can read it.
   */
  disabledReason?: string;
}

export namespace CopyToClipboardProps {
  export type Variant = 'button' | 'icon' | 'inline';
}
