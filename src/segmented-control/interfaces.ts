// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface SegmentedControlProps extends BaseComponentProps {
  /**
   * The segments, in order. Each segment has:
   * * `id`: identifies the segment in `selectedId` and in `onChange`.
   * * `text`: the label of the segment.
   * * `iconName`: a built-in icon shown before the text, or alone.
   * * `iconAlt`: the accessible name of a segment that shows only an icon.
   * * `disabled`: shows the segment but prevents choosing it.
   *
   * Use two to five short segments. For more, use a select.
   */
  options?: ReadonlyArray<SegmentedControlProps.Option>;
  /**
   * The ID of the selected segment, or `null` when none is selected. The control is
   * controlled: update this in `onChange`.
   */
  selectedId: string | null;
  /**
   * Called when the user chooses a different segment, with its ID in `event.detail.selectedId`.
   */
  onChange?: NonCancelableEventHandler<SegmentedControlProps.ChangeDetail>;
  /**
   * Accessible name of the group, for controls without a visible label.
   */
  label?: string;
  /**
   * The ID of an element that labels the group. Takes precedence over `label`.
   */
  ariaLabelledby?: string;
}

export namespace SegmentedControlProps {
  export interface Option {
    id: string;
    text?: string;
    iconName?: IconProps.Name;
    iconAlt?: string;
    disabled?: boolean;
  }

  export interface ChangeDetail {
    selectedId: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the selected segment, or to the first segment that can be chosen.
     */
    focus(): void;
  }
}
