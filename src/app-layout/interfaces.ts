// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface AppLayoutProps extends BaseComponentProps {
  /**
   * The main content of the page, drawn on a framed sheet: a heavy ink border, grid reference
   * letters along its top edge and, when `titleBlock` is set, a title block along its foot.
   */
  content?: React.ReactNode;
  /**
   * The strip of labelled cells pinned to the foot of the sheet, usually a `TitleBlock` naming the
   * project, the sheet and its revision. It stays at the bottom of the sheet when the content is
   * short.
   */
  titleBlock?: React.ReactNode;
  /**
   * The kind of page, which sets a sensible maximum content width and which side panels
   * start open when their state is not controlled:
   * * `default`: up to 1280px wide.
   * * `table`, `cards` and `dashboard`: the full width, for dense collections.
   * * `form`: up to 800px wide; the help panel starts open and the navigation closed.
   * * `wizard`: up to 1080px wide; the help panel starts open and the navigation closed.
   */
  contentType?: AppLayoutProps.ContentType;
  /**
   * How the toggles are arranged on wide screens:
   * * `default`: the navigation and the side panels collapse to slim rails of icon toggles.
   * * `toolbar`: a toolbar above the content holds the breadcrumbs and all toggles, and
   *   closed panels take no space.
   *
   * Narrow screens always use the toolbar.
   */
  variant?: AppLayoutProps.Variant;
  /**
   * The navigation, usually a `SideNavigation`. It sits on the grey frame beside the sheet, like
   * the index of a drawing set.
   */
  navigation?: React.ReactNode;
  /**
   * Whether the navigation is open. Leave it unset to let the layout manage it, or set it
   * and update it in `onNavigationChange`.
   */
  navigationOpen?: boolean;
  /**
   * Called when the navigation opens or closes, with the new state in `event.detail.open`.
   * Also called when the layout becomes narrow, which closes the navigation.
   */
  onNavigationChange?: NonCancelableEventHandler<AppLayoutProps.ChangeDetail>;
  /**
   * Removes the navigation and its toggle. The navigation is also left out when
   * `navigation` is not set.
   */
  navigationHide?: boolean;
  /**
   * The width of the open navigation on wide screens, in pixels.
   */
  navigationWidth?: number;
  /**
   * Breadcrumbs for the page, usually a `BreadcrumbGroup`. Shown above the content, or in
   * the toolbar.
   */
  breadcrumbs?: React.ReactNode;
  /**
   * Notifications for the page, usually a `Flashbar`. Shown as notes in the margin beside the
   * sheet, or above the breadcrumbs (see `notificationsPosition`).
   */
  notifications?: React.ReactNode;
  /**
   * Where the notifications go:
   * * `margin` (the default): in a column beside the sheet, like notes in the margin of a drawing.
   *   Layouts too narrow for the column put them above the breadcrumbs instead.
   * * `top`: above the breadcrumbs, across the width of the content.
   */
  notificationsPosition?: AppLayoutProps.NotificationsPosition;
  /**
   * Keeps the notifications in view while the content scrolls.
   */
  stickyNotifications?: boolean;
  /**
   * The help panel, usually a `HelpPanel`. Shown at the end of the line.
   */
  tools?: React.ReactNode;
  /**
   * Whether the help panel is open. Leave it unset to let the layout manage it, or set it
   * and update it in `onToolsChange`.
   */
  toolsOpen?: boolean;
  /**
   * Called when the help panel opens or closes, with the new state in `event.detail.open`.
   */
  onToolsChange?: NonCancelableEventHandler<AppLayoutProps.ChangeDetail>;
  /**
   * Removes the help panel and its toggle. The help panel is also left out when `tools`
   * is not set.
   */
  toolsHide?: boolean;
  /**
   * The width of the open help panel on wide screens, in pixels.
   */
  toolsWidth?: number;
  /**
   * A `SplitPanel`, which shows details of the selected item next to or below the content.
   */
  splitPanel?: React.ReactNode;
  /**
   * Whether the split panel is open. Leave it unset to let the layout manage it, or set it
   * and update it in `onSplitPanelToggle`.
   */
  splitPanelOpen?: boolean;
  /**
   * Called when the user opens or closes the split panel, with the new state in
   * `event.detail.open`.
   */
  onSplitPanelToggle?: NonCancelableEventHandler<AppLayoutProps.ChangeDetail>;
  /**
   * The size of the split panel in pixels: its height at the bottom, its width at the side.
   * Leave it unset to let the layout manage it.
   */
  splitPanelSize?: number;
  /**
   * Called while the user resizes the split panel, with the new size in `event.detail.size`.
   */
  onSplitPanelResize?: NonCancelableEventHandler<AppLayoutProps.SplitPanelResizeDetail>;
  /**
   * The split panel's position: `bottom` below the content, or `side` next to it. The
   * layout uses the bottom position while it is too narrow for the side.
   */
  splitPanelPreferences?: AppLayoutProps.SplitPanelPreferences;
  /**
   * Called when the user picks another position in the split panel's preferences.
   */
  onSplitPanelPreferencesChange?: NonCancelableEventHandler<AppLayoutProps.SplitPanelPreferences>;
  /**
   * Extra panels that open at the end of the line, each with a trigger next to the help
   * panel's. Each drawer has:
   * * `id` (string): Identifies the drawer in `activeDrawerId`.
   * * `content` (ReactNode): The drawer's content, usually a `Drawer`.
   * * `trigger` (object): The icon of the trigger, as `iconName` or `iconSvg`.
   * * `ariaLabels` (object): `drawerName` names the panel and its trigger; `triggerButton`,
   *   `closeButton` and `resizeHandle` name those controls when the defaults do not fit.
   * * `badge` (boolean): Adds a dot to the trigger, to show that the drawer has something new.
   * * `resizable` (boolean): Lets the user resize the drawer.
   * * `defaultSize` (number): The starting width in pixels.
   * * `onResize`: Called while the user resizes the drawer, with `size` and `id`.
   */
  drawers?: ReadonlyArray<AppLayoutProps.Drawer>;
  /**
   * The ID of the open drawer, or `null` when none is open. Leave it unset to let the
   * layout manage it. The help panel and the drawers share one place, so opening a drawer
   * closes the help panel.
   */
  activeDrawerId?: string | null;
  /**
   * Called when a drawer opens or closes. `event.detail.activeDrawerId` is the open drawer,
   * or `null`.
   */
  onDrawerChange?: NonCancelableEventHandler<AppLayoutProps.DrawerChangeDetail>;
  /**
   * A CSS selector for a fixed header above the layout, such as the element around a
   * `TopNavigation`. The layout keeps its sticky parts below it.
   */
  headerSelector?: string;
  /**
   * A CSS selector for a fixed footer below the layout. The layout keeps its sticky parts
   * above it.
   */
  footerSelector?: string;
  /**
   * Makes the layout fill its parent's height and scroll the content inside itself instead
   * of scrolling the page. Use it when the layout sits in a region of fixed height, such
   * as a demo or an embedded view. The parent must have a height.
   */
  disableBodyScroll?: boolean;
  /**
   * The maximum width of the content in pixels, overriding the width set by `contentType`.
   */
  maxContentWidth?: number;
  /**
   * The narrowest the content may get on wide screens, in pixels. The split panel moves to
   * the bottom when the side position would squeeze the content below this width.
   */
  minContentWidth?: number;
  /**
   * Removes the padding around the content, for content that brings its own.
   */
  disableContentPaddings?: boolean;
  /**
   * Accessible names for the layout's regions and toggles:
   * * `navigation`, `tools`, `notifications`: The regions.
   * * `navigationToggle`, `navigationClose`: The buttons that open and close the navigation.
   * * `toolsToggle`, `toolsClose`: The buttons that open and close the help panel.
   * * `drawers`: The group of panel toggles in the toolbar.
   */
  ariaLabels?: AppLayoutProps.Labels;
}

export namespace AppLayoutProps {
  export type ContentType = 'default' | 'table' | 'cards' | 'form' | 'wizard' | 'dashboard';

  export type Variant = 'default' | 'toolbar';

  export type NotificationsPosition = 'margin' | 'top';

  export type SplitPanelPosition = 'bottom' | 'side';

  export interface ChangeDetail {
    open: boolean;
  }

  export interface SplitPanelResizeDetail {
    size: number;
  }

  export interface SplitPanelPreferences {
    position: SplitPanelPosition;
  }

  export interface DrawerChangeDetail {
    activeDrawerId: string | null;
  }

  export interface DrawerResizeDetail {
    id: string;
    size: number;
  }

  export interface DrawerTrigger {
    iconName?: IconProps.Name;
    iconSvg?: React.ReactNode;
  }

  export interface DrawerAriaLabels {
    drawerName: string;
    triggerButton?: string;
    closeButton?: string;
    resizeHandle?: string;
  }

  export interface Drawer {
    id: string;
    content: React.ReactNode;
    trigger: DrawerTrigger;
    ariaLabels: DrawerAriaLabels;
    badge?: boolean;
    resizable?: boolean;
    defaultSize?: number;
    onResize?: NonCancelableEventHandler<DrawerResizeDetail>;
  }

  export interface Labels {
    navigation?: string;
    navigationToggle?: string;
    navigationClose?: string;
    tools?: string;
    toolsToggle?: string;
    toolsClose?: string;
    notifications?: string;
    drawers?: string;
  }

  export interface Ref {
    /**
     * Opens the help panel and moves focus to its close button, for example from an
     * "Info" link.
     */
    openTools(): void;
    /**
     * Closes the navigation when it covers the content on a narrow screen. Call it after
     * the user follows a navigation link.
     */
    closeNavigationIfNecessary(): void;
    /**
     * Moves focus to the help panel's close button, if the panel is open.
     */
    focusToolsClose(): void;
  }
}
