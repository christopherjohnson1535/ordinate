// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TagEditorProps } from './interfaces';

export const defaultAllowedCharacterPattern = /^[\p{L}\p{Z}\p{N}_.:/=+\-@]*$/u;
export const maxKeyLength = 128;
export const maxValueLength = 256;

export type KeyError = 'empty' | 'duplicate' | 'invalid' | 'tooLong';
export type ValueError = 'invalid' | 'tooLong';

export interface TagErrors {
  key?: KeyError;
  value?: ValueError;
}

// A pattern with the global or sticky flag keeps state between calls, which would make every other test fail.
function matches(pattern: RegExp, text: string): boolean {
  pattern.lastIndex = 0;
  return pattern.test(text);
}

function keyError(tag: TagEditorProps.Tag, earlierKeys: Set<string>, pattern: RegExp): KeyError | undefined {
  if (tag.existing) {
    return undefined;
  }
  if (tag.key === '') {
    return 'empty';
  }
  if (tag.key.length > maxKeyLength) {
    return 'tooLong';
  }
  if (!matches(pattern, tag.key)) {
    return 'invalid';
  }
  return earlierKeys.has(tag.key) ? 'duplicate' : undefined;
}

function valueError(tag: TagEditorProps.Tag, pattern: RegExp): ValueError | undefined {
  if (tag.value.length > maxValueLength) {
    return 'tooLong';
  }
  return matches(pattern, tag.value) ? undefined : 'invalid';
}

/**
 * The errors of each tag, in order. Tags marked for removal have none, and only a later tag with
 * the same key counts as the duplicate.
 */
export function validateTags(tags: ReadonlyArray<TagEditorProps.Tag>, pattern: RegExp): TagErrors[] {
  const seenKeys = new Set<string>();
  return tags.map(tag => {
    if (tag.markedForRemoval) {
      return {};
    }
    const errors = { key: keyError(tag, seenKeys, pattern), value: valueError(tag, pattern) };
    seenKeys.add(tag.key);
    return errors;
  });
}

export function countActiveTags(tags: ReadonlyArray<TagEditorProps.Tag>): number {
  return tags.filter(tag => !tag.markedForRemoval).length;
}

export function isValid(tags: ReadonlyArray<TagEditorProps.Tag>, pattern: RegExp, tagLimit: number): boolean {
  return (
    countActiveTags(tags) <= tagLimit &&
    validateTags(tags, pattern).every(errors => errors.key === undefined && errors.value === undefined)
  );
}
