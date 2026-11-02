// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IconName } from './generated/icons';

/**
 * Names the icons had before they were given Ordinate's own names. They still render, with a warning, until
 * the next major version. Keys are the old names and values the new ones.
 */
export const deprecatedIconNames = {
  'add-plus': 'add',
  'anchor-link': 'link',
  'angle-down': 'chevron-down',
  'angle-left': 'chevron-left',
  'angle-left-double': 'chevron-left-double',
  'angle-right': 'chevron-right',
  'angle-right-double': 'chevron-right-double',
  'angle-up': 'chevron-up',
  'backward-10-seconds': 'skip-back-10',
  call: 'phone',
  'caret-down-filled': 'caret-down-solid',
  'caret-left-filled': 'caret-left-solid',
  'caret-right-filled': 'caret-right-solid',
  'caret-up-filled': 'caret-up-solid',
  'closed-caption': 'captions',
  'closed-caption-unavailable': 'captions-off',
  'command-prompt': 'terminal',
  'delete-marker': 'file-delete',
  'drag-indicator': 'drag-handle',
  'edit-gen-ai': 'edit-assist',
  ellipsis: 'more',
  envelope: 'mail',
  'exit-full-screen': 'fullscreen-exit',
  external: 'open-outside',
  'face-happy-filled': 'face-happy-solid',
  'face-neutral-filled': 'face-neutral-solid',
  'face-sad-filled': 'face-sad-solid',
  'forward-10-seconds': 'skip-forward-10',
  'full-screen': 'fullscreen',
  'gen-ai': 'assist',
  'gen-ai-token': 'assist-token',
  'heart-filled': 'heart-solid',
  'insert-row': 'row-add',
  'internal-link': 'go-to',
  'light-dark': 'color-mode',
  'lock-private': 'locked',
  multiscreen: 'screens',
  'resize-area': 'resize-handle',
  search: 'find',
  'search-gen-ai': 'find-assist',
  settings: 'adjust',
  'star-filled': 'star-solid',
  'status-in-progress': 'underway',
  'status-info': 'note',
  'status-negative': 'fault',
  'status-not-started': 'queued',
  'status-pending': 'waiting',
  'status-positive': 'complete',
  'status-stopped': 'halted',
  'status-warning': 'caution',
  'subtract-minus': 'subtract',
  'suggestions-gen-ai': 'suggestions-assist',
  'thumbs-down-filled': 'thumbs-down-solid',
  'thumbs-up-filled': 'thumbs-up-solid',
  'treeview-collapse': 'node-collapse',
  'treeview-expand': 'node-expand',
  'upload-download': 'transfer',
  'user-profile': 'person',
  'user-profile-active': 'person-active',
  'view-full': 'layout-full',
  'view-horizontal': 'layout-horizontal',
  'view-vertical': 'layout-vertical',
  'zoom-to-fit': 'zoom-fit',
} as const satisfies Record<string, IconName>;

export type DeprecatedIconName = keyof typeof deprecatedIconNames;

const legacyNames: Partial<Record<IconName, DeprecatedIconName>> = Object.fromEntries(
  Object.entries(deprecatedIconNames).map(([legacy, current]) => [current, legacy])
);

export function isDeprecatedIconName(name: string): name is DeprecatedIconName {
  return Object.prototype.hasOwnProperty.call(deprecatedIconNames, name);
}

/**
 * The current name for an icon name, old or new.
 */
export function resolveIconName(name: IconName | DeprecatedIconName): IconName {
  return isDeprecatedIconName(name) ? deprecatedIconNames[name] : name;
}

/**
 * The old name of an icon that was renamed, so an IconProvider written with old names still applies.
 */
export function legacyIconName(name: IconName): DeprecatedIconName | undefined {
  return legacyNames[name];
}
