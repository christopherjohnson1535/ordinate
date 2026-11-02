// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TabsProps extends BaseComponentProps {
  /**
   * The tabs, in order. Each tab has:
   * * `id` (string): Identifies the tab in `activeTabId` and `onChange`.
   * * `label` (ReactNode): The text of the tab.
   * * `reference` (ReactNode): A short reference after the label, such as R1, in the color of `kind`.
   * * `content` (ReactNode): Shown in the panel below the tabs while the tab is active.
   * * `disabled` (boolean): The tab cannot be activated. Keyboard users can still reach it to read why.
   * * `disabledReason` (string): Says why the tab is disabled. Shown on hover and focus.
   * * `href` (string): Renders the tab as a link. A plain click follows the link and fires `onChange`.
   * * `dismissible` (boolean): Adds a close button after the label.
   * * `dismissLabel` (string): Accessible name of the close button.
   * * `onDismiss` (function): Called when the user clicks the close button.
   * * `action` (ReactNode): A control shown after the label, such as an icon button with a menu.
   */
  tabs: ReadonlyArray<TabsProps.Tab>;
  /**
   * The ID of the active tab. Without it the tabs manage the active tab themselves, starting
   * with the first one that is not disabled.
   */
  activeTabId?: string;
  /**
   * Called when the user activates a tab, by clicking it or moving to it with the arrow keys.
   */
  onChange?: NonCancelableEventHandler<TabsProps.ChangeDetail>;
  /**
   * The style of the tabs:
   * * `default` places the tabs over the page, on a construction line.
   * * `container` draws the tabs and their content as one container.
   * * `stacked` is a container that shares borders with stacked containers next to it.
   */
  variant?: TabsProps.Variant;
  /**
   * What the views show, told by the color of the construction lines and the tab references:
   * `configuration`, `resource`, `policy` or `neutral`. Neutral graphite when left out.
   */
  kind?: TabsProps.Kind;
  /**
   * Accessible name of the tab list.
   */
  ariaLabel?: string;
  /**
   * The ID of the element that names the tab list, such as a heading.
   */
  ariaLabelledby?: string;
  /**
   * Removes the padding around the tab content.
   */
  disableContentPaddings?: boolean;
  /**
   * Accessible names of the controls the tabs add on their own. Each one replaces the built-in message.
   * * `scrollLeftAriaLabel` names the button that scrolls toward the first tab, at the start of the row.
   * * `scrollRightAriaLabel` names the button that scrolls toward the last tab, at the end of the row.
   * * `dismissAriaLabel` names a close button when its tab has no `dismissLabel`.
   */
  i18nStrings?: TabsProps.I18nStrings;
}

export namespace TabsProps {
  export type Variant = 'default' | 'container' | 'stacked';

  export type Kind = 'configuration' | 'resource' | 'policy' | 'neutral';

  export interface Tab {
    id: string;
    label: React.ReactNode;
    reference?: React.ReactNode;
    content?: React.ReactNode;
    disabled?: boolean;
    disabledReason?: string;
    href?: string;
    dismissible?: boolean;
    dismissLabel?: string;
    onDismiss?: NonCancelableEventHandler<DismissDetail>;
    action?: React.ReactNode;
  }

  export interface ChangeDetail {
    activeTabId: string;
    activeTabHref?: string;
  }

  export interface DismissDetail {
    tabId: string;
  }

  export interface I18nStrings {
    scrollLeftAriaLabel?: string;
    scrollRightAriaLabel?: string;
    dismissAriaLabel?: string;
  }
}
