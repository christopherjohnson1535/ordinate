// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { EditorEngine } from './interfaces';

let pending: Promise<EditorEngine> | null = null;

/**
 * Loads the CodeMirror engine once per page. The dynamic import keeps CodeMirror in its own chunks,
 * so it is only downloaded when a code editor renders. A failed load is forgotten, so a retry
 * imports again.
 */
export function loadEditorEngine(): Promise<EditorEngine> {
  if (!pending) {
    pending = import('./codemirror').then(
      module => module.codeMirrorEngine,
      error => {
        pending = null;
        throw error;
      }
    );
  }
  return pending;
}
