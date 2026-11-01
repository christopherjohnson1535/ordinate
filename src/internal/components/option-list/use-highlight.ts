// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';
import type React from 'react';

import { findEnabled, OptionItem } from './utils';

export type HighlightSource = 'keyboard' | 'mouse';

interface Highlight {
  index: number;
  source: HighlightSource;
}

const pageSize = 10;

export interface HighlightState {
  /**
   * The highlighted option, or -1. Always within the current options.
   */
  highlightedIndex: number;
  source: HighlightSource;
  setHighlight(index: number, source: HighlightSource): void;
  /**
   * Highlights `index` from the keyboard, ignoring -1 so the highlight stays put at the ends of the list.
   */
  moveHighlight(index: number): void;
  /**
   * Highlights an option under the pointer, unless it is disabled.
   */
  hoverOption(index: number): void;
  /**
   * Moves the highlight for Up, Down, Page Up and Page Down, and for Home and End unless focus is in a text
   * input, where those keys move the caret. Returns whether the key was handled.
   */
  handleNavigationKey(event: React.KeyboardEvent, inTextInput: boolean): boolean;
}

/**
 * The highlighted option of a list that keeps focus elsewhere and points at the option with
 * `aria-activedescendant`. A keyboard highlight scrolls its option into view and draws a focus ring;
 * a pointer highlight does neither, so the list does not jump under the mouse.
 */
export function useHighlight(optionItems: ReadonlyArray<OptionItem>, getOptionId: (index: number) => string) {
  const [highlight, setHighlightState] = useState<Highlight>({ index: -1, source: 'keyboard' });
  const highlightedIndex = highlight.index < optionItems.length ? highlight.index : -1;
  const highlightedId = highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined;

  useEffect(() => {
    if (highlight.source !== 'keyboard' || !highlightedId) {
      return;
    }
    // jsdom does not implement scrollIntoView.
    document.getElementById(highlightedId)?.scrollIntoView?.({ block: 'nearest' });
  }, [highlight, highlightedId]);

  const setHighlight = (index: number, source: HighlightSource) => setHighlightState({ index, source });

  const moveHighlight = (index: number) => {
    if (index >= 0) {
      setHighlight(index, 'keyboard');
    }
  };

  const hoverOption = (index: number) => {
    if (!optionItems[index]?.disabled && (highlightedIndex !== index || highlight.source !== 'mouse')) {
      setHighlight(index, 'mouse');
    }
  };

  const handleNavigationKey = (event: React.KeyboardEvent, inTextInput: boolean): boolean => {
    const last = optionItems.length - 1;
    let target: number;
    switch (event.key) {
      case 'ArrowDown':
        target = findEnabled(optionItems, highlightedIndex + 1, 1);
        break;
      case 'ArrowUp':
        target = findEnabled(optionItems, highlightedIndex < 0 ? last : highlightedIndex - 1, -1);
        break;
      case 'PageDown':
        target = findEnabled(optionItems, Math.min(highlightedIndex + pageSize, last), -1);
        break;
      case 'PageUp':
        target = findEnabled(optionItems, Math.max(highlightedIndex - pageSize, 0), 1);
        break;
      case 'Home':
      case 'End':
        if (inTextInput) {
          return false;
        }
        target = event.key === 'Home' ? findEnabled(optionItems, 0, 1) : findEnabled(optionItems, last, -1);
        break;
      default:
        return false;
    }
    event.preventDefault();
    moveHighlight(target);
    return true;
  };

  const state: HighlightState = {
    highlightedIndex,
    source: highlight.source,
    setHighlight,
    moveHighlight,
    hoverOption,
    handleNavigationKey,
  };
  return state;
}
