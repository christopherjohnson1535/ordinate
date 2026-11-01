// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface AppLayoutToolbarProps extends BaseComponentProps {
  /**
   * Breadcrumbs for the current page, usually a `BreadcrumbGroup`. They fill the space
   * between the navigation toggle and the drawer triggers.
   */
  breadcrumbs?: React.ReactNode;
  /**
   * Whether the navigation the toggle controls is open. Update it in `onNavigationChange`.
   */
  navigationOpen?: boolean;
  /**
   * Hides the navigation toggle, for pages without navigation.
   */
  navigationHide?: boolean;
  /**
   * Called when the user clicks the navigation toggle, with the requested state in
   * `event.detail.open`.
   */
  onNavigationChange?: NonCancelableEventHandler<AppLayoutToolbarProps.ChangeDetail>;
  /**
   * The drawer triggers shown at the end of the toolbar. Each one has:
   * * `id` (string): Reported in `onDrawerChange`.
   * * `ariaLabel` (string): The accessible name of the trigger, usually the drawer's name.
   * * `iconName` or `iconSvg`: The icon on the trigger.
   * * `badge` (boolean): Adds a dot to the trigger, to show that the drawer has something new.
   */
  drawers?: ReadonlyArray<AppLayoutToolbarProps.Drawer>;
  /**
   * The ID of the open drawer, or `null` when none is open. Its trigger is shown pressed.
   */
  activeDrawerId?: string | null;
  /**
   * Called when the user clicks a drawer trigger. `event.detail.activeDrawerId` is the
   * drawer to open, or `null` when the user clicked the trigger of the open drawer.
   */
  onDrawerChange?: NonCancelableEventHandler<AppLayoutToolbarProps.DrawerChangeDetail>;
  /**
   * Accessible names for the toolbar's controls:
   * * `navigationToggle`: The navigation toggle while the navigation is closed.
   * * `navigationClose`: The navigation toggle while the navigation is open.
   * * `drawers`: The group of drawer triggers.
   */
  ariaLabels?: AppLayoutToolbarProps.AriaLabels;
}

export namespace AppLayoutToolbarProps {
  export interface ChangeDetail {
    open: boolean;
  }

  export interface DrawerChangeDetail {
    activeDrawerId: string | null;
  }

  export interface Drawer {
    id: string;
    ariaLabel: string;
    iconName?: IconProps.Name;
    iconSvg?: React.ReactNode;
    badge?: boolean;
  }

  export interface AriaLabels {
    navigationToggle?: string;
    navigationClose?: string;
    drawers?: string;
  }
}
