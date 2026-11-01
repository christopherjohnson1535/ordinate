// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TagEditorProps extends BaseComponentProps {
  /**
   * The tags to edit. Each tag has:
   * * `key`: the tag's key. Keys of existing tags cannot be changed.
   * * `value`: the tag's value, which may be empty.
   * * `existing`: whether the tag is already saved on the resource. Removing an existing tag only
   *   marks it, with an Undo button, so the change can be reviewed before it is saved. A new tag is
   *   removed outright.
   * * `markedForRemoval`: whether an existing tag will be removed when the changes are saved.
   *
   * The tag editor is controlled: update this in `onChange`.
   */
  tags?: ReadonlyArray<TagEditorProps.Tag>;
  /**
   * Called on every change with the new tags in `event.detail.tags`. `event.detail.valid` is false
   * while any tag has an error, such as an empty or duplicate key, or while there are more tags than
   * `tagLimit`. Keep the save action disabled, or block it, while it is false.
   */
  onChange?: NonCancelableEventHandler<TagEditorProps.ChangeDetail>;
  /**
   * Returns a promise of key suggestions for the text typed into a key field. When it rejects, the
   * list shows an error with a retry button.
   */
  keysRequest?: (key: string) => Promise<ReadonlyArray<string>>;
  /**
   * Returns a promise of value suggestions for a key and the text typed into its value field.
   */
  valuesRequest?: (key: string, value: string) => Promise<ReadonlyArray<string>>;
  /**
   * The characters keys and values may contain, as a pattern the whole text must match. Defaults to
   * letters, digits, spaces and `_ . : / = + - @`.
   */
  allowedCharacterPattern?: RegExp;
  /**
   * The most tags the resource can have, counting existing tags that are not marked for removal.
   * The add button is disabled at the limit.
   */
  tagLimit?: number;
  /**
   * Shows a loading state instead of the tags, while the resource's tags are fetched.
   */
  loading?: boolean;
  /**
   * Text the tag editor shows on its own. Fixed strings are shown as is; the functions receive the
   * values to include.
   * * `keyHeader`, `valueHeader`, `optional`: the column labels. `optional` follows the value label.
   * * `keyPlaceholder`, `valuePlaceholder`: hints in empty fields.
   * * `addButton`, `removeButton`, `undoButton`: button texts.
   * * `undoPrompt`: shown in place of the value of a tag marked for removal.
   * * `removeButtonAriaLabel`, `undoButtonAriaLabel`: accessible names of a tag's buttons.
   * * `itemRemovedAriaLive`: announced after a new tag is removed.
   * * `loading`: shown while `loading` is set.
   * * `emptyTags`: shown when there are no tags.
   * * `enteredKeyLabel`, `enteredValueLabel`: the suggestion that uses the text as typed.
   * * `keysSuggestionLoading`, `keysSuggestionError`, `valuesSuggestionLoading`,
   *   `valuesSuggestionError`, `retryText`: the state of loading suggestions.
   * * `emptyKeyError`, `duplicateKeyError`, `invalidKeyError`, `invalidValueError`,
   *   `maxKeyCharLengthError`, `maxValueCharLengthError`: validation messages.
   * * `tagLimit`: how many more tags can be added. `tagLimitReached`: the limit is reached.
   *   `tagLimitExceeded`: there are more tags than the limit.
   */
  i18nStrings?: TagEditorProps.I18nStrings;
}

export namespace TagEditorProps {
  export interface Tag {
    key: string;
    value: string;
    existing: boolean;
    markedForRemoval?: boolean;
  }

  export interface ChangeDetail {
    tags: Tag[];
    valid: boolean;
  }

  export interface I18nStrings {
    keyHeader?: string;
    valueHeader?: string;
    optional?: string;
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    addButton?: string;
    removeButton?: string;
    undoButton?: string;
    undoPrompt?: string;
    removeButtonAriaLabel?: (tag: Tag) => string;
    undoButtonAriaLabel?: (tag: Tag) => string;
    itemRemovedAriaLive?: string;
    loading?: string;
    emptyTags?: string;
    enteredKeyLabel?: (key: string) => string;
    enteredValueLabel?: (value: string) => string;
    keysSuggestionLoading?: string;
    keysSuggestionError?: string;
    valuesSuggestionLoading?: string;
    valuesSuggestionError?: string;
    retryText?: string;
    emptyKeyError?: string;
    duplicateKeyError?: string;
    invalidKeyError?: string;
    invalidValueError?: string;
    maxKeyCharLengthError?: string;
    maxValueCharLengthError?: string;
    tagLimit?: (availableTags: number, tagLimit: number) => string;
    tagLimitReached?: (tagLimit: number) => string;
    tagLimitExceeded?: (tagLimit: number, excessTags: number) => string;
  }
}
