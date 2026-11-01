// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext } from 'react';

export type SplitPanelPosition = 'bottom' | 'side';

/**
 * What the app layout tells the split panel inside it: where it is docked, whether it is
 * open, how big it is, and how to report the user's changes back.
 */
export interface SplitPanelContextValue {
  position: SplitPanelPosition;
  isOpen: boolean;
  size: number;
  minSize: number;
  maxSize: number;
  /**
   * The layout is too narrow for the side position, so the panel is held at the bottom.
   */
  isSidePositionUnavailable: boolean;
  /**
   * The element the app layout moves focus to after the panel remounts in a new position.
   */
  pendingFocusRef: React.RefObject<'preferences' | null>;
  onToggle: () => void;
  onResize: (size: number) => void;
  onPreferencesChange: (preferences: { position: SplitPanelPosition }) => void;
}

export const defaultSplitPanelContext: SplitPanelContextValue = {
  position: 'bottom',
  isOpen: true,
  size: 240,
  minSize: 160,
  maxSize: 240,
  isSidePositionUnavailable: false,
  pendingFocusRef: { current: null },
  onToggle: () => {},
  onResize: () => {},
  onPreferencesChange: () => {},
};

export const SplitPanelContext = createContext<SplitPanelContextValue | null>(null);

/**
 * The split panel's layout state, or `null` outside an app layout.
 */
export function useSplitPanelContext(): SplitPanelContextValue | null {
  return useContext(SplitPanelContext);
}
