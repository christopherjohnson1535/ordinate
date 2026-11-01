// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

/**
 * A code editor with syntax highlighting, a status bar, user preferences and a resize handle.
 *
 * The editor engine is CodeMirror 6. It is loaded with a dynamic `import()` the first time a
 * code editor renders, so bundlers split it into separate chunks and applications that never
 * render a code editor do not download it. CodeMirror is a dependency of `@ordinate-ui/components`,
 * so there is nothing extra to install.
 *
 * Each language package is loaded only when an editor uses that language.
 */
export interface CodeEditorProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The code. The editor is controlled: update this in `onChange` or `onDelayedChange`.
   */
  value: string;
  /**
   * Called as the user types, with the new code in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<CodeEditorProps.ChangeDetail>;
  /**
   * Called once the user has stopped typing for half a second, with the code in
   * `event.detail.value`. Use it for work that should not run on every key press, such as
   * validation or saving a draft.
   */
  onDelayedChange?: NonCancelableEventHandler<CodeEditorProps.ChangeDetail>;
  /**
   * The language of the code, which sets the syntax highlighting, indentation and completions.
   * Use `text` for code without highlighting.
   */
  language: CodeEditorProps.Language;
  /**
   * The language name shown in the status bar. Defaults to the name of `language`, such as
   * "JavaScript". Set it for a dialect of a supported language, such as "JSON with comments".
   */
  languageLabel?: string;
  /**
   * The user's editor preferences:
   * * `wrapLines` wraps long lines instead of scrolling sideways.
   * * `theme` is `light`, `dark`, or `auto` to match the page's color mode.
   * * `showGutter` shows line numbers. Defaults to `true`.
   *
   * The user changes them in the preferences modal. Store them with `onPreferencesChange`, for
   * example per user, and pass them back. When not set, the editor keeps them itself, starting
   * with wrapped lines and the `auto` theme.
   */
  preferences?: CodeEditorProps.Preferences;
  /**
   * Called when the user confirms new preferences in the preferences modal, with the preferences
   * in `event.detail`.
   */
  onPreferencesChange?: NonCancelableEventHandler<CodeEditorProps.Preferences>;
  /**
   * The height of the editing area in pixels, not counting the status bar. The user changes it
   * with the resize handle. Pass it together with `onEditorContentResize` to keep the height,
   * for example per user. When not set, the editor keeps the height itself, starting at 480.
   */
  editorContentHeight?: number;
  /**
   * Called when the user resizes the editing area, with the new height in pixels in
   * `event.detail.height`.
   */
  onEditorContentResize?: NonCancelableEventHandler<CodeEditorProps.ResizeDetail>;
  /**
   * Shows the loading state instead of the editor, for example while the code itself is loading.
   * The editor also shows it on its own while the editor engine loads.
   */
  loading?: boolean;
  /**
   * Prevents changes to the code. The code stays focusable, selectable and searchable.
   */
  readOnly?: boolean;
  /**
   * Accessible name of the editing area, for an editor without a visible label. Inside a
   * `FormField`, the field's label names it.
   */
  ariaLabel?: string;
  /**
   * Replaces the built-in labels and messages: the loading and error states, the status bar, the
   * preferences modal and the resize handle.
   */
  i18nStrings?: CodeEditorProps.I18nStrings;
}

export namespace CodeEditorProps {
  export type Language =
    'javascript' | 'typescript' | 'json' | 'yaml' | 'html' | 'css' | 'python' | 'markdown' | 'text';

  export type Theme = 'light' | 'dark' | 'auto';

  export interface Preferences {
    /**
     * Wraps long lines instead of scrolling sideways.
     */
    wrapLines: boolean;
    /**
     * `light`, `dark`, or `auto` to match the page's color mode.
     */
    theme: Theme;
    /**
     * Shows line numbers in a gutter before the code. Defaults to `true`.
     */
    showGutter?: boolean;
  }

  export interface ChangeDetail {
    value: string;
  }

  export interface ResizeDetail {
    height: number;
  }

  export interface I18nStrings {
    /**
     * Text of the loading state.
     */
    loadingState?: string;
    /**
     * Text of the error state, shown when the editor engine could not be loaded.
     */
    errorState?: string;
    /**
     * Label of the button that tries to load the editor engine again.
     */
    errorStateRecovery?: string;
    /**
     * Accessible name of the error state's icon.
     */
    errorIconAriaLabel?: string;
    /**
     * Accessible name of the group that holds the editor and its status bar.
     */
    editorGroupAriaLabel?: string;
    /**
     * Accessible name of the status bar.
     */
    statusBarGroupAriaLabel?: string;
    /**
     * The cursor position in the status bar. Both numbers start at 1.
     */
    cursorPosition?: (row: number, column: number) => string;
    /**
     * The number of syntax errors in the status bar. Selecting it moves the cursor to the next error.
     */
    errorsCount?: (count: number) => string;
    /**
     * The number of warnings in the status bar. Selecting it moves the cursor to the next warning.
     */
    warningsCount?: (count: number) => string;
    /**
     * Message shown on a syntax error in the code.
     */
    syntaxErrorMessage?: string;
    /**
     * Label of the status bar toggle that makes Tab move focus out of the editor instead of
     * indenting. Pressing Escape and then Tab also moves focus out, once.
     */
    tabFocusToggleLabel?: string;
    /**
     * Accessible name of the button that opens the preferences.
     */
    preferencesButtonAriaLabel?: string;
    /**
     * Heading of the preferences modal.
     */
    preferencesModalHeader?: string;
    /**
     * Label of the button that closes the preferences without saving them.
     */
    preferencesModalCancel?: string;
    /**
     * Label of the button that saves the preferences.
     */
    preferencesModalConfirm?: string;
    /**
     * Label of the line wrapping preference.
     */
    preferencesModalWrapLines?: string;
    /**
     * Label of the line numbers preference.
     */
    preferencesModalShowGutter?: string;
    /**
     * Label of the theme preference.
     */
    preferencesModalTheme?: string;
    /**
     * Label of the theme that matches the page's color mode.
     */
    preferencesModalThemeAuto?: string;
    /**
     * Label of the light theme.
     */
    preferencesModalThemeLight?: string;
    /**
     * Label of the dark theme.
     */
    preferencesModalThemeDark?: string;
    /**
     * Accessible name of the handle that resizes the editing area.
     */
    resizeHandleAriaLabel?: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus into the editing area, once the editor has loaded.
     */
    focus(): void;
  }
}
