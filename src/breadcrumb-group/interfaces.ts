// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface BreadcrumbGroupProps<
  T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item,
> extends BaseComponentProps {
  /**
   * The path to the current page, from the top level down. Each item has a `text` and an
   * `href`. The last item is the current page and is not rendered as a link. Items may carry
   * extra fields, which come back in event details.
   */
  items: ReadonlyArray<T>;
  /**
   * Accessible name of the breadcrumb navigation.
   */
  ariaLabel?: string;
  /**
   * Accessible name of the button that shows the items hidden for lack of space.
   */
  expandAriaLabel?: string;
  /**
   * Called when the user follows an item with a plain left click or the keyboard. Call
   * `preventDefault()` to handle navigation yourself, for example with a client-side router.
   */
  onFollow?: CancelableEventHandler<BreadcrumbGroupProps.ClickDetail<T>>;
  /**
   * Called on every click on an item, including clicks with modifier keys. Call
   * `preventDefault()` to stop the browser from following the link.
   */
  onClick?: CancelableEventHandler<BreadcrumbGroupProps.ClickDetail<T>>;
}

export namespace BreadcrumbGroupProps {
  export interface Item {
    text: string;
    href: string;
  }

  export interface ClickDetail<T extends Item = Item> {
    item: T;
    text: string;
    href: string;
  }
}
