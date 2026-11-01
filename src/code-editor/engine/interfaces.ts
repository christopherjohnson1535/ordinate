// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CodeEditorProps } from '../interfaces';

/**
 * The contract between the code editor's chrome and the editor engine. The chrome depends only on
 * this, so the engine can load lazily and tests can replace it.
 */
export interface EditorEngine {
  createEditor(options: EditorOptions): EditorInstance;
}

export interface EditorConfig {
  wrapLines: boolean;
  showGutter: boolean;
  readOnly: boolean;
  /**
   * Whether Tab and Shift+Tab move focus out of the editor instead of changing indentation.
   */
  tabMovesFocus: boolean;
  /**
   * Attributes for the editable element, such as its ID and accessible name.
   */
  contentAttributes: Record<string, string>;
  syntaxErrorMessage: string;
}

export interface CursorPosition {
  /**
   * The line, starting at 1.
   */
  row: number;
  /**
   * The column, starting at 1.
   */
  column: number;
}

export interface DiagnosticCounts {
  errors: number;
  warnings: number;
}

export type DiagnosticSeverity = 'error' | 'warning';

export interface EditorListeners {
  /**
   * Called when the user changes the code, but not when `setValue` does.
   */
  onChange(value: string): void;
  onCursorChange(position: CursorPosition): void;
  onDiagnosticsChange(counts: DiagnosticCounts): void;
  /**
   * Called when the user switches Tab behavior with the editor's keyboard shortcut.
   */
  onTabMovesFocusToggle(): void;
}

export interface EditorOptions {
  parent: HTMLElement;
  value: string;
  language: CodeEditorProps.Language;
  config: EditorConfig;
  listeners: EditorListeners;
}

export interface EditorInstance {
  setValue(value: string): void;
  setLanguage(language: CodeEditorProps.Language): void;
  configure(config: EditorConfig): void;
  /**
   * Moves the cursor to the next diagnostic of the given severity and focuses the editor.
   */
  goToNextDiagnostic(severity: DiagnosticSeverity): void;
  focus(): void;
  destroy(): void;
}
