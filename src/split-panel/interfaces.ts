// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface SplitPanelProps extends BaseComponentProps {
  /**
   * The title of the panel, usually the name of the selected item. It is the panel's
   * accessible name and stays visible while the panel is collapsed at the bottom.
   */
  header: string;
  /**
   * Text below the title, such as a short summary of the selected item.
   */
  headerDescription?: React.ReactNode;
  /**
   * Content next to the title, usually an "Info" link that opens the help panel.
   */
  headerInfo?: React.ReactNode;
  /**
   * Actions in the header, before the panel's own buttons, such as a button that edits the
   * selected item.
   */
  headerActions?: React.ReactNode;
  /**
   * Main content of the panel. It scrolls inside the panel.
   */
  children?: React.ReactNode;
  /**
   * What happens when the user closes the panel:
   * * `collapse` keeps a slim bar with the title (at the bottom) or a rail (at the side),
   *   so the user can open the panel again.
   * * `hide` removes the panel from the page. Use it when the panel only makes sense while
   *   something is selected, and open it again from your own controls.
   */
  closeBehavior?: SplitPanelProps.CloseBehavior;
  /**
   * Hides the button that opens the preferences, where the user chooses between the bottom
   * and side positions.
   */
  hidePreferencesButton?: boolean;
  /**
   * Text for the panel's built-in controls:
   * * `openButtonAriaLabel`, `closeButtonAriaLabel`: The open and close buttons.
   * * `resizeHandleAriaLabel`: The handle that resizes the panel.
   * * `preferencesTitle`: The preferences button and the title of the preferences dialog.
   * * `preferencesPositionLabel`, `preferencesPositionDescription`: The position choice.
   * * `preferencesPositionBottom`, `preferencesPositionSide`: The two positions.
   * * `preferencesPositionSideUnavailable`: Shown under the side position while the
   *   layout is too narrow for it.
   * * `preferencesConfirm`, `preferencesCancel`: The dialog's buttons.
   */
  i18nStrings?: SplitPanelProps.I18nStrings;
}

export namespace SplitPanelProps {
  export type CloseBehavior = 'collapse' | 'hide';

  export interface I18nStrings {
    openButtonAriaLabel?: string;
    closeButtonAriaLabel?: string;
    resizeHandleAriaLabel?: string;
    preferencesTitle?: string;
    preferencesPositionLabel?: string;
    preferencesPositionDescription?: string;
    preferencesPositionBottom?: string;
    preferencesPositionSide?: string;
    preferencesPositionSideUnavailable?: string;
    preferencesConfirm?: string;
    preferencesCancel?: string;
  }
}
