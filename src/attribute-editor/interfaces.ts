// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { Breakpoint } from '../internal/breakpoints';
import { NonCancelableEventHandler } from '../internal/events';

export interface AttributeEditorProps<T = unknown> extends BaseComponentProps {
  /**
   * The rows to edit, one item per row. The attribute editor is controlled: add and remove items in
   * `onAddButtonClick` and `onRemoveButtonClick`, and update them from the controls' own events.
   */
  items?: ReadonlyArray<T>;
  /**
   * The fields of each row, in order. Each field has:
   * * `label`: the field's label. On wide layouts it is shown once, above the first row.
   * * `info`: content next to the label, such as an info link.
   * * `control`: the control of the field, or a function that returns it for an item and its index.
   * * `errorText`: a function that returns an error for an item, shown below the control.
   * * `warningText`: a function that returns a warning for an item. An error takes precedence.
   * * `constraintText`: a function that returns a hint for an item, such as the allowed characters.
   *
   * The controls pick up the label and messages the same way they do inside a `FormField`.
   */
  definition: ReadonlyArray<AttributeEditorProps.FieldDefinition<T>>;
  /**
   * Called when the user clicks the add button. Add an item to `items` here. Focus moves to the
   * first control of the new row.
   */
  onAddButtonClick?: NonCancelableEventHandler;
  /**
   * Called when the user clicks a row's remove button, with the row's position in
   * `event.detail.itemIndex`. Remove the item from `items` here. Focus moves to the next row's remove
   * button, or to the add button after the last row, and the removal is announced.
   */
  onRemoveButtonClick?: NonCancelableEventHandler<AttributeEditorProps.RemoveButtonClickDetail>;
  /**
   * Text of the add button. Defaults to "Add new item".
   */
  addButtonText?: string;
  /**
   * Text of each row's remove button. Defaults to "Remove".
   */
  removeButtonText?: string;
  /**
   * Returns the accessible name of a row's remove button, such as "Remove tag Environment", so that
   * screen reader users can tell the buttons apart. Return `undefined` to use the button text.
   */
  removeButtonAriaLabel?: (item: T) => string | undefined;
  /**
   * Returns whether a row can be removed. Rows that cannot have no remove button. All rows can be
   * removed by default.
   */
  isItemRemovable?: (item: T) => boolean;
  /**
   * Shown in place of the rows while `items` is empty.
   */
  empty?: React.ReactNode;
  /**
   * Text below the add button, such as how many more items can be added.
   */
  additionalInfo?: React.ReactNode;
  /**
   * Disables the add button, for example when a limit is reached. Say why in `additionalInfo`.
   */
  disableAddButton?: boolean;
  /**
   * How the fields of a row are laid out at each width of the editor. Each entry applies from its
   * `breakpoint` up (`default` is the narrowest) and has:
   * * `rows`: the fields in lines, each line a list of relative widths. `[[2, 1]]` puts the first
   *   field and the second side by side in one line, the first twice as wide. `[[1], [1]]` stacks them.
   *   Every field of `definition` needs a width.
   * * `removeButton.ownRow`: puts the remove button on its own line below the fields.
   *
   * When every field sits in one line, the labels are shown once as column headings. Without this
   * prop, the fields stack on narrow editors and line up in columns on wider ones.
   */
  gridLayout?: ReadonlyArray<AttributeEditorProps.GridLayout>;
  /**
   * Text the attribute editor announces on its own:
   * * `itemRemovedAriaLive`: announced after a row is removed. Defaults to "Item 2 removed",
   *   with the row's position. Passed as a fixed string, it is announced as is.
   */
  i18nStrings?: AttributeEditorProps.I18nStrings;
}

export namespace AttributeEditorProps {
  export interface FieldDefinition<T> {
    label?: React.ReactNode;
    info?: React.ReactNode;
    control?: React.ReactNode | ((item: T, itemIndex: number) => React.ReactNode);
    errorText?: (item: T, itemIndex: number) => React.ReactNode;
    warningText?: (item: T, itemIndex: number) => React.ReactNode;
    constraintText?: (item: T, itemIndex: number) => React.ReactNode;
  }

  export interface RemoveButtonClickDetail {
    itemIndex: number;
  }

  export interface GridLayout {
    breakpoint?: Breakpoint;
    rows: ReadonlyArray<ReadonlyArray<number>>;
    removeButton?: { ownRow?: boolean };
  }

  export interface I18nStrings {
    itemRemovedAriaLive?: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the remove button of the row at `itemIndex`, counting from 0.
     */
    focusRemoveButton(itemIndex: number): void;
    /**
     * Moves keyboard focus to the add button.
     */
    focusAddButton(): void;
  }
}
