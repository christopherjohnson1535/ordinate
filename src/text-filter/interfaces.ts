// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TextFilterProps extends BaseComponentProps {
  /**
   * The text in the filter. The text filter is controlled: update this in `onChange`.
   */
  filteringText: string;
  /**
   * Called on every change with the new text in `event.detail.filteringText`, including when the
   * clear button empties the filter.
   */
  onChange?: NonCancelableEventHandler<TextFilterProps.ChangeDetail>;
  /**
   * Called once the user has stopped typing for a moment, with the text in `event.detail.filteringText`.
   * Use it for work that should not run on every keystroke, such as a request to a server.
   */
  onDelayedChange?: NonCancelableEventHandler<TextFilterProps.ChangeDetail>;
  /**
   * Hint text shown while the filter is empty, such as "Find instances".
   */
  filteringPlaceholder?: string;
  /**
   * Accessible name of the filter input. Say what is being filtered, such as "Find instances".
   */
  filteringAriaLabel?: string;
  /**
   * Accessible name of the button that clears the filter.
   */
  filteringClearAriaLabel?: string;
  /**
   * A short result count shown next to the input while it has text, such as "12 matches".
   * Changes are announced to screen readers.
   */
  countText?: string;
  /**
   * Prevents changes and removes the filter from the tab order.
   */
  disabled?: boolean;
}

export namespace TextFilterProps {
  export interface ChangeDetail {
    filteringText: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the filter input.
     */
    focus(): void;
  }
}
