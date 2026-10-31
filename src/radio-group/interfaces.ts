// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface RadioGroupProps extends BaseComponentProps, Omit<FormFieldControlProps, 'controlId' | 'invalid'> {
  /**
   * The value of the selected item, or `null` for no selection. The group is controlled: update this
   * in `onChange`.
   */
  value: string | null;
  /**
   * The options. Each item has:
   * * `value`: the value reported in `onChange` and sent with the form.
   * * `label`: the text next to the radio button.
   * * `description` (optional): text below the label.
   * * `disabled` (optional): prevents selecting this item.
   * * `controlId` (optional): ID of the item's native input. Generated when not set.
   */
  items?: ReadonlyArray<RadioGroupProps.Item>;
  /**
   * Called when the user selects an item, with its value in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<RadioGroupProps.ChangeDetail>;
  /**
   * The native `name` shared by the radio buttons. Generated when not set.
   */
  name?: string;
  /**
   * Prevents changes to the whole group but keeps it focusable and submitted with the form.
   */
  readOnly?: boolean;
  /**
   * Lays the items out in a column or in a row.
   */
  direction?: RadioGroupProps.Direction;
  /**
   * Accessible name for the group. Inside a `FormField`, the field's label names the group instead.
   */
  ariaLabel?: string;
  /**
   * Marks the group as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * ID of the content the group shows or hides, such as another form field.
   */
  ariaControls?: string;
}

export namespace RadioGroupProps {
  export interface Item {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
    controlId?: string;
  }

  export type Direction = 'vertical' | 'horizontal';

  export interface ChangeDetail {
    value: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the selected item, or to the first item that can be selected.
     */
    focus(): void;
  }
}
