// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TokenGroupProps extends BaseComponentProps {
  /**
   * The tokens. Each item has:
   * * `label`: the text of the token.
   * * `labelTag` (optional): a short secondary text after the label.
   * * `description` (optional): text below the label.
   * * `tags` (optional): short texts in a row below the description.
   * * `iconName` (optional): a built-in icon before the label.
   * * `disabled` (optional): dims the token and removes its dismiss button.
   * * `dismissLabel` (optional): accessible name of the dismiss button. Defaults to "Remove" and the label.
   */
  items?: ReadonlyArray<TokenGroupProps.Item>;
  /**
   * Called when the user dismisses a token, with its position in `items` in `event.detail.itemIndex`.
   * Remove the item from `items` here. Without this handler, tokens have no dismiss button.
   */
  onDismiss?: NonCancelableEventHandler<TokenGroupProps.DismissDetail>;
  /**
   * - `horizontal` wraps the tokens in rows.
   * - `vertical` stacks the tokens, one per line.
   */
  alignment?: TokenGroupProps.Alignment;
  /**
   * Shows only this many tokens, with a button that shows the rest.
   */
  limit?: number;
  /**
   * Shows the tokens as part of a read-only value: they stay at full contrast but cannot be dismissed.
   */
  readOnly?: boolean;
  /**
   * Accessible name of the list of tokens.
   */
  ariaLabel?: string;
  /**
   * Text for the button that shows or hides the tokens beyond `limit`:
   * * `limitShowMore`: shows the hidden tokens, such as "Show 3 more".
   * * `limitShowFewer`: hides them again.
   */
  i18nStrings?: TokenGroupProps.I18nStrings;
}

export namespace TokenGroupProps {
  export type Alignment = 'horizontal' | 'vertical';

  export interface Item {
    label: string;
    labelTag?: string;
    description?: string;
    tags?: ReadonlyArray<string>;
    iconName?: IconProps.Name;
    disabled?: boolean;
    dismissLabel?: string;
  }

  export interface DismissDetail {
    itemIndex: number;
  }

  export interface I18nStrings {
    limitShowMore?: string;
    limitShowFewer?: string;
  }
}
