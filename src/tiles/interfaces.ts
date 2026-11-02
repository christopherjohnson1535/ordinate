// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface TilesProps extends BaseComponentProps, Omit<FormFieldControlProps, 'controlId' | 'invalid'> {
  /**
   * The value of the selected tile, or `null` for no selection. The tiles are controlled: update this
   * in `onChange`.
   */
  value: string | null;
  /**
   * The tiles. Each item has:
   * * `value`: the value reported in `onChange` and sent with the form.
   * * `label`: the title of the tile, next to its radio button.
   * * `description` (optional): text below the label.
   * * `image` (optional): an image or illustration shown at the bottom of the tile. Give it its own alt text.
   * * `disabled` (optional): prevents selecting this tile.
   * * `controlId` (optional): ID of the tile's native input. Generated when not set.
   */
  items?: ReadonlyArray<TilesProps.Item>;
  /**
   * Called when the user selects a tile, with its value in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<TilesProps.ChangeDetail>;
  /**
   * The number of tiles in a row, from 1 to 4. By default it follows the number of tiles: one row of up
   * to three, or two by two for four. Rows collapse to one column when the tiles are too narrow.
   */
  columns?: number;
  /**
   * What the choice sets, told by the color of the corner marks: `configuration`, `resource`, `policy`
   * or `neutral`. Neutral graphite when left out.
   */
  kind?: TilesProps.Kind;
  /**
   * The native `name` shared by the radio buttons. Generated when not set.
   */
  name?: string;
  /**
   * Prevents changes but keeps the tiles focusable and submitted with the form.
   */
  readOnly?: boolean;
  /**
   * Accessible name for the group. Inside a `FormField`, the field's label names the group instead.
   */
  ariaLabel?: string;
  /**
   * Marks the group as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * ID of the content the tiles show or hide, such as another form field.
   */
  ariaControls?: string;
}

export namespace TilesProps {
  export type Kind = 'configuration' | 'resource' | 'policy' | 'neutral';
  export interface Item {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    image?: React.ReactNode;
    disabled?: boolean;
    controlId?: string;
  }

  export interface ChangeDetail {
    value: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the selected tile, or to the first tile that can be selected.
     */
    focus(): void;
  }
}
