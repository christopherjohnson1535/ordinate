// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';
import type React from 'react';

import { getLabel, OptionItem } from './utils';

const resetMs = 500;

export function isTypeAheadKey(event: React.KeyboardEvent): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
}

/**
 * Finds options by the first letters of their labels as the user types, the way native selects do.
 */
export function useTypeAhead(optionItems: ReadonlyArray<OptionItem>) {
  const state = useRef({ text: '', timer: undefined as ReturnType<typeof setTimeout> | undefined });

  useEffect(() => () => clearTimeout(state.current.timer), []);

  return {
    /**
     * Adds `character` to the typed text and returns the next option from `from` whose label starts with it,
     * or -1. Repeating one letter cycles through the options that start with it.
     */
    find(character: string, from: number): number {
      const current = state.current;
      clearTimeout(current.timer);
      current.text += character.toLowerCase();
      current.timer = setTimeout(() => (current.text = ''), resetMs);

      const cycling = current.text.split('').every(letter => letter === current.text[0]);
      const search = cycling ? current.text[0] : current.text;
      const start = cycling || from < 0 ? from + 1 : from;
      for (let offset = 0; offset < optionItems.length; offset++) {
        const index = (start + offset) % optionItems.length;
        const item = optionItems[index];
        if (!item.disabled && getLabel(item.option).toLowerCase().startsWith(search)) {
          return index;
        }
      }
      return -1;
    },
    /**
     * Whether the user is in the middle of typing, so Space belongs to the typed text.
     */
    isTyping(): boolean {
      return state.current.text !== '';
    },
  };
}
