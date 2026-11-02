// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface ModalProps extends BaseComponentProps {
  /**
   * What the modal is about. The kind colors its reference and the marks on its footer rule, as for a
   * container. The reference letter carries the same meaning for anyone who cannot rely on color.
   * - `configuration` for settings people change, drawn in drafting blue.
   * - `resource` for things that exist or run, drawn in teal.
   * - `policy` for rules the system follows, drawn in plum.
   * - `neutral` for anything else, drawn in graphite.
   */
  kind?: ModalProps.Kind;
  /**
   * A short reference set above the title, as on a drawing set, such as `P2`. Other parts of the page can
   * point back to the modal with it.
   */
  reference?: string;
  /**
   * Whether the modal is open. The modal is controlled: set this to `false` in `onDismiss`.
   */
  visible: boolean;
  /**
   * Called when the user asks to close the modal. `event.detail.reason` is one of
   * `closeButton`, `overlay` or `keyboard`.
   */
  onDismiss?: NonCancelableEventHandler<ModalProps.DismissDetail>;
  /**
   * The title of the modal. It also becomes the modal's accessible name.
   */
  header?: React.ReactNode;
  /**
   * Content of the footer, usually the actions. It stands on a rule closed by hash marks.
   */
  footer?: React.ReactNode;
  /**
   * Main content of the modal.
   */
  children?: React.ReactNode;
  /**
   * The width of the modal.
   */
  size?: ModalProps.Size;
  /**
   * Where the modal sits in the viewport:
   * * `center` keeps it vertically centered. Use it when the content does not change size.
   * * `top` anchors it near the top so it grows downward. Use it when the content changes size,
   *   so the modal does not jump while the user works in it.
   */
  position?: ModalProps.Position;
  /**
   * Removes the padding around the content, for content that brings its own, such as a full-bleed table.
   */
  disableContentPaddings?: boolean;
  /**
   * Hides the close button in the header, so the user closes the modal with an action in the footer.
   * Escape and clicks outside the modal still call `onDismiss`.
   */
  hideDismissButton?: boolean;
  /**
   * Accessible name of the close button.
   */
  closeAriaLabel?: string;
}

export namespace ModalProps {
  export type Kind = 'configuration' | 'resource' | 'policy' | 'neutral';

  export type Size = 'small' | 'medium' | 'large';

  export type Position = 'center' | 'top';

  export type DismissReason = 'closeButton' | 'overlay' | 'keyboard';

  export interface DismissDetail {
    reason: DismissReason;
  }
}
