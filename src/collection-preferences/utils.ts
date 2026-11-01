// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from './interfaces';

type ContentDisplayItem = CollectionPreferencesProps.ContentDisplayItem;
type ContentDisplayOption = CollectionPreferencesProps.ContentDisplayOption;

/**
 * Lines the stored column order up with the columns that exist. Unknown and repeated IDs are dropped,
 * columns missing from a stored order are added at the end, hidden, and always-visible columns are shown.
 * Without a stored order every column is shown in the order of the options.
 */
export function normalizeContentDisplay(
  options: ReadonlyArray<ContentDisplayOption>,
  contentDisplay: ReadonlyArray<ContentDisplayItem> | undefined
): ReadonlyArray<ContentDisplayItem> {
  const optionsById = new Map(options.map(option => [option.id, option]));
  const listed = new Map<string, ContentDisplayItem>();
  for (const item of contentDisplay ?? []) {
    if (optionsById.has(item.id) && !listed.has(item.id)) {
      listed.set(item.id, item);
    }
  }
  const missing = options
    .filter(option => !listed.has(option.id))
    .map(option => ({ id: option.id, visible: contentDisplay === undefined }));
  return [...listed.values(), ...missing].map(item =>
    optionsById.get(item.id)?.alwaysVisible && !item.visible ? { ...item, visible: true } : item
  );
}

/**
 * Returns a copy of the list with the item at `from` moved to `to`.
 */
export function moveItem<T>(items: ReadonlyArray<T>, from: number, to: number): T[] {
  const next = items.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/**
 * The preferences the modal starts from when it opens.
 */
export function createDraft<Custom>(
  preferences: CollectionPreferencesProps.Preferences<Custom> | undefined,
  contentDisplayOptions: ReadonlyArray<ContentDisplayOption> | undefined
): CollectionPreferencesProps.Preferences<Custom> {
  const draft = { ...preferences };
  if (contentDisplayOptions) {
    draft.contentDisplay = normalizeContentDisplay(contentDisplayOptions, preferences?.contentDisplay);
  }
  return draft;
}
