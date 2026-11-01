// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface PanelLayoutProps extends BaseComponentProps {
  /**
   * The content of the side panel, such as a list of items or a set of filters.
   */
  panelContent?: React.ReactNode;
  /**
   * The content of the main pane, which takes the remaining width.
   */
  mainContent?: React.ReactNode;
  /**
   * Which side the panel is on: `side-start` (left in left-to-right layouts) or `side-end`.
   */
  panelPosition?: PanelLayoutProps.PanelPosition;
  /**
   * The width of the panel, in pixels. Set it together with `onPanelResize` to control the size. Without it,
   * the layout keeps the size itself, starting from `defaultPanelSize`.
   */
  panelSize?: number;
  /**
   * The starting width of the panel, in pixels, when `panelSize` is not set.
   */
  defaultPanelSize?: number;
  /**
   * The narrowest the panel may get, in pixels.
   */
  minPanelSize?: number;
  /**
   * The widest the panel may get, in pixels. The panel never gets wider than the layout.
   */
  maxPanelSize?: number;
  /**
   * Shows a handle between the panes that resizes the panel by dragging, or with the arrow keys, Home and
   * End when the handle has focus.
   */
  resizable?: boolean;
  /**
   * Which panes to show: `all`, `panel-only` or `main-only`. The pane that is shown alone takes the full
   * width. Use it to show one pane at a time on narrow screens.
   */
  display?: PanelLayoutProps.Display;
  /**
   * Makes the panel focusable, so keyboard users can scroll it. Give it an accessible name with `ariaLabel`
   * or `ariaLabelledby`.
   */
  panelFocusable?: PanelLayoutProps.Focusable;
  /**
   * Makes the main pane focusable, so keyboard users can scroll it. Give it an accessible name with
   * `ariaLabel` or `ariaLabelledby`.
   */
  mainFocusable?: PanelLayoutProps.Focusable;
  /**
   * Text for the built-in labels.
   *
   * - `resizeHandleAriaLabel`: accessible name of the resize handle.
   */
  i18nStrings?: PanelLayoutProps.I18nStrings;
  /**
   * Called when the panel is resized, with the new width in `event.detail.panelSize`.
   */
  onPanelResize?: NonCancelableEventHandler<PanelLayoutProps.PanelResizeDetail>;
}

export namespace PanelLayoutProps {
  export type PanelPosition = 'side-start' | 'side-end';

  export type Display = 'all' | 'panel-only' | 'main-only';

  export interface Focusable {
    ariaLabel?: string;
    ariaLabelledby?: string;
  }

  export interface I18nStrings {
    resizeHandleAriaLabel?: string;
  }

  export interface PanelResizeDetail {
    panelSize: number;
  }

  export interface Ref {
    /**
     * Moves focus to the resize handle.
     */
    focusResizeHandle(): void;
  }
}
