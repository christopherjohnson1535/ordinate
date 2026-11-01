// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { forEachDiagnostic, lintKeymap } from '@codemirror/lint';
import { highlightSelectionMatches, search, searchKeymap } from '@codemirror/search';
import { Annotation, Compartment, EditorState, Extension, Prec, StateEffect } from '@codemirror/state';
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view';

import { CodeEditorProps } from '../interfaces';
import { countDiagnostics, syntaxErrorLinter } from './diagnostics';
import {
  CursorPosition,
  DiagnosticCounts,
  DiagnosticSeverity,
  EditorConfig,
  EditorEngine,
  EditorInstance,
  EditorListeners,
  EditorOptions,
} from './interfaces';
import { loadLanguage } from './languages';
import { ordinateTheme } from './theme';

// Marks changes made by `setValue`, which must not be reported back as user edits.
const externalChange = Annotation.define<boolean>();

type ConfigurableKey = 'wrapLines' | 'showGutter' | 'readOnly' | 'contentAttributes';

const configurable: Record<ConfigurableKey, (config: EditorConfig) => Extension> = {
  wrapLines: config => (config.wrapLines ? EditorView.lineWrapping : []),
  showGutter: config => (config.showGutter ? [lineNumbers(), highlightActiveLineGutter()] : []),
  readOnly: config => EditorState.readOnly.of(config.readOnly),
  contentAttributes: config => EditorView.contentAttributes.of(config.contentAttributes),
};

const configurableKeys = Object.keys(configurable) as ConfigurableKey[];

function sameAttributes(a: Record<string, string>, b: Record<string, string>): boolean {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(key => a[key] === b[key]);
}

function isSame(key: ConfigurableKey, previous: EditorConfig, next: EditorConfig): boolean {
  return key === 'contentAttributes'
    ? sameAttributes(previous.contentAttributes, next.contentAttributes)
    : previous[key] === next[key];
}

function getCursorPosition(state: EditorState): CursorPosition {
  const head = state.selection.main.head;
  const line = state.doc.lineAt(head);
  return { row: line.number, column: head - line.from + 1 };
}

// Replaces only the part that differs, so the cursor and the undo history stay where they are
// when the new value is a small edit of the old one.
function minimalChange(current: string, next: string) {
  let start = 0;
  const shorter = Math.min(current.length, next.length);
  while (start < shorter && current[start] === next[start]) {
    start++;
  }
  let end = 0;
  while (end < shorter - start && current[current.length - 1 - end] === next[next.length - 1 - end]) {
    end++;
  }
  return { from: start, to: current.length - end, insert: next.slice(start, next.length - end) };
}

class CodeMirrorEditor implements EditorInstance {
  private readonly view: EditorView;
  private readonly compartments: Record<ConfigurableKey, Compartment>;
  private readonly languageCompartment = new Compartment();
  private config: EditorConfig;
  private language: CodeEditorProps.Language | null = null;
  private languageRequest = 0;
  private cursor: CursorPosition = { row: 1, column: 1 };
  private diagnostics: DiagnosticCounts = { errors: 0, warnings: 0 };

  constructor({ parent, value, language, config, listeners }: EditorOptions) {
    this.config = config;
    this.compartments = Object.fromEntries(configurableKeys.map(key => [key, new Compartment()])) as Record<
      ConfigurableKey,
      Compartment
    >;
    this.view = new EditorView({
      parent,
      state: EditorState.create({ doc: value, extensions: this.extensions(listeners) }),
    });
    this.view.setTabFocusMode(config.tabMovesFocus);
    this.setLanguage(language);
  }

  private extensions(listeners: EditorListeners): Extension[] {
    return [
      ...configurableKeys.map(key => this.compartments[key].of(configurable[key](this.config))),
      this.languageCompartment.of([]),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      search(),
      syntaxErrorLinter(() => this.config.syntaxErrorMessage),
      ordinateTheme,
      // The editor's own shortcut for Tab behavior goes through the component, so the status bar
      // toggle always shows the current behavior.
      Prec.highest(
        keymap.of([
          {
            key: 'Ctrl-m',
            mac: 'Shift-Alt-m',
            run: () => {
              listeners.onTabMovesFocusToggle();
              return true;
            },
          },
        ])
      ),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      EditorView.updateListener.of(update => {
        if (update.docChanged && !update.transactions.every(transaction => transaction.annotation(externalChange))) {
          listeners.onChange(update.state.doc.toString());
        }
        if (update.docChanged || update.selectionSet) {
          const cursor = getCursorPosition(update.state);
          if (cursor.row !== this.cursor.row || cursor.column !== this.cursor.column) {
            this.cursor = cursor;
            listeners.onCursorChange(cursor);
          }
        }
        const diagnostics = countDiagnostics(update.state);
        if (diagnostics.errors !== this.diagnostics.errors || diagnostics.warnings !== this.diagnostics.warnings) {
          this.diagnostics = diagnostics;
          listeners.onDiagnosticsChange(diagnostics);
        }
      }),
    ];
  }

  setValue(value: string): void {
    const current = this.view.state.doc.toString();
    if (current === value) {
      return;
    }
    this.view.dispatch({ changes: minimalChange(current, value), annotations: externalChange.of(true) });
  }

  setLanguage(language: CodeEditorProps.Language): void {
    if (language === this.language) {
      return;
    }
    this.language = language;
    const request = ++this.languageRequest;
    loadLanguage(language).then(
      extension => {
        // A newer language request, or a destroyed editor, makes this result stale.
        if (request === this.languageRequest) {
          this.view.dispatch({ effects: this.languageCompartment.reconfigure(extension) });
        }
      },
      error => console.warn(`[ordinate] CodeEditor: could not load the "${language}" language.`, error)
    );
  }

  configure(config: EditorConfig): void {
    const previous = this.config;
    this.config = config;
    const effects: StateEffect<unknown>[] = configurableKeys
      .filter(key => !isSame(key, previous, config))
      .map(key => this.compartments[key].reconfigure(configurable[key](config)));
    if (effects.length > 0) {
      this.view.dispatch({ effects });
    }
    if (previous.tabMovesFocus !== config.tabMovesFocus) {
      this.view.setTabFocusMode(config.tabMovesFocus);
    }
  }

  goToNextDiagnostic(severity: DiagnosticSeverity): void {
    const ranges: Array<{ from: number; to: number }> = [];
    forEachDiagnostic(this.view.state, (diagnostic, from, to) => {
      if (diagnostic.severity === severity) {
        ranges.push({ from, to });
      }
    });
    const head = this.view.state.selection.main.head;
    const next = ranges.find(range => range.from > head) ?? ranges[0];
    if (next) {
      this.view.dispatch({ selection: { anchor: next.from, head: next.to }, scrollIntoView: true });
    }
    this.view.focus();
  }

  focus(): void {
    this.view.focus();
  }

  destroy(): void {
    this.languageRequest++;
    this.view.destroy();
  }
}

export const codeMirrorEngine: EditorEngine = {
  createEditor: options => new CodeMirrorEditor(options),
};
