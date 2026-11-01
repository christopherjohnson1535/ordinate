// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import CodeEditor, { CodeEditorProps } from '../../../lib/components/code-editor';
import type {
  EditorConfig,
  EditorEngine,
  EditorInstance,
  EditorOptions,
} from '../../../lib/components/code-editor/engine/interfaces';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/code-editor/styles.css.js';

// The engine is replaced by a stand-in that records what the component asks of it, so these tests
// cover the component's own behavior. code-editor-engine.test.tsx runs the real CodeMirror.
interface FakeEditor extends EditorInstance {
  options: EditorOptions;
  value: string;
  language: CodeEditorProps.Language;
  config: EditorConfig;
  content: HTMLElement;
}

const engine = vi.hoisted(() => ({
  load: vi.fn(),
  editors: [] as unknown[],
}));

vi.mock('../../../lib/components/code-editor/engine/load', () => ({ loadEditorEngine: engine.load }));

function createFakeEngine(): EditorEngine {
  return {
    createEditor(options) {
      const content = document.createElement('div');
      content.setAttribute('contenteditable', 'true');
      content.setAttribute('role', 'textbox');
      content.setAttribute('aria-multiline', 'true');
      content.tabIndex = 0;
      const applyAttributes = (attributes: Record<string, string>) => {
        for (const name of [
          'id',
          'aria-label',
          'aria-labelledby',
          'aria-describedby',
          'aria-invalid',
          'aria-readonly',
        ]) {
          content.removeAttribute(name);
        }
        for (const [name, value] of Object.entries(attributes)) {
          content.setAttribute(name, value);
        }
      };
      applyAttributes(options.config.contentAttributes);
      content.textContent = options.value;
      options.parent.appendChild(content);

      const editor: FakeEditor = {
        options,
        content,
        value: options.value,
        language: options.language,
        config: options.config,
        setValue: vi.fn((value: string) => {
          editor.value = value;
          content.textContent = value;
        }),
        setLanguage: vi.fn((language: CodeEditorProps.Language) => {
          editor.language = language;
        }),
        configure: vi.fn((config: EditorConfig) => {
          editor.config = config;
          applyAttributes(config.contentAttributes);
        }),
        goToNextDiagnostic: vi.fn(),
        focus: vi.fn(() => content.focus()),
        destroy: vi.fn(() => content.remove()),
      };
      engine.editors.push(editor);
      return editor;
    },
  };
}

function lastEditor(): FakeEditor {
  return engine.editors[engine.editors.length - 1] as FakeEditor;
}

function getWrapper() {
  return createWrapper().findCodeEditor()!;
}

async function renderLoaded(element: React.ReactElement) {
  const result = render(element);
  await act(async () => {});
  return result;
}

beforeEach(() => {
  engine.editors.length = 0;
  engine.load.mockReset();
  engine.load.mockResolvedValue(createFakeEngine());
});

afterEach(() => {
  vi.useRealTimers();
});

describe('CodeEditor', () => {
  describe('loading the engine', () => {
    test('shows the loading state until the engine has loaded', async () => {
      let resolve: (value: EditorEngine) => void = () => {};
      engine.load.mockReturnValue(new Promise<EditorEngine>(done => (resolve = done)));
      render(<CodeEditor ariaLabel="Policy" value="{}" language="json" />);
      const wrapper = getWrapper();

      expect(screen.getByRole('status')).toHaveTextContent('Loading code editor');
      expect(wrapper.findEditorContent()).toBeNull();
      expect(wrapper.findLanguageLabel().getText()).toBe('JSON');
      expect(wrapper.findCursorPosition()).toBeNull();

      await act(async () => resolve(createFakeEngine()));
      expect(wrapper.findLoadingState()).toBeNull();
      expect(wrapper.findEditorContent()!.getElement()).toHaveTextContent('{}');
      expect(wrapper.findCursorPosition()!.getText()).toBe('Ln 1, Col 1');
    });

    test('shows an error with a retry when the engine fails to load', async () => {
      engine.load.mockRejectedValueOnce(new Error('offline'));
      await renderLoaded(<CodeEditor ariaLabel="Policy" value="{}" language="json" />);
      const wrapper = getWrapper();

      expect(screen.getByRole('alert')).toHaveTextContent('The code editor could not be loaded.');
      expect(wrapper.findEditorContent()).toBeNull();

      wrapper.findErrorRecoveryButton()!.click();
      expect(wrapper.findLoadingState()).not.toBeNull();
      await act(async () => {});
      expect(engine.load).toHaveBeenCalledTimes(2);
      expect(wrapper.findErrorState()).toBeNull();
      expect(wrapper.findEditorContent()).not.toBeNull();
    });

    test('the loading property shows the loading state over a loaded editor', async () => {
      const { rerender } = await renderLoaded(
        <CodeEditor ariaLabel="Policy" value="{}" language="json" loading={true} />
      );
      const wrapper = getWrapper();
      expect(wrapper.findLoadingState()).not.toBeNull();
      expect(wrapper.findByClassName(styles.surface)!.getElement()).not.toBeVisible();

      rerender(<CodeEditor ariaLabel="Policy" value="{}" language="json" loading={false} />);
      expect(wrapper.findLoadingState()).toBeNull();
      expect(wrapper.findByClassName(styles.surface)!.getElement()).toBeVisible();
      expect(engine.editors).toHaveLength(1);
    });

    test('destroys the editor when it unmounts', async () => {
      const { unmount } = await renderLoaded(<CodeEditor ariaLabel="Policy" value="" language="json" />);
      const editor = lastEditor();
      unmount();
      expect(editor.destroy).toHaveBeenCalledOnce();
    });
  });

  describe('value and language', () => {
    test('creates the editor with the value, language and defaults', async () => {
      await renderLoaded(<CodeEditor ariaLabel="Policy" value="a: 1" language="yaml" />);
      expect(lastEditor().options).toMatchObject({
        value: 'a: 1',
        language: 'yaml',
        config: { wrapLines: true, showGutter: true, readOnly: false, tabMovesFocus: false },
      });
      expect(lastEditor().config.syntaxErrorMessage).toBe('Syntax error');
    });

    test('passes new values and languages to the editor without recreating it', async () => {
      const { rerender } = await renderLoaded(<CodeEditor ariaLabel="Code" value="a" language="javascript" />);
      rerender(<CodeEditor ariaLabel="Code" value="b" language="typescript" />);
      expect(engine.editors).toHaveLength(1);
      expect(lastEditor().value).toBe('b');
      expect(lastEditor().language).toBe('typescript');
      expect(getWrapper().findLanguageLabel().getText()).toBe('TypeScript');
    });

    test('fires onChange as the user types and onDelayedChange once typing pauses', async () => {
      const onChange = vi.fn();
      const onDelayedChange = vi.fn();
      await renderLoaded(
        <CodeEditor
          ariaLabel="Code"
          value=""
          language="python"
          onChange={event => onChange(event.detail)}
          onDelayedChange={event => onDelayedChange(event.detail)}
        />
      );
      vi.useFakeTimers();
      act(() => lastEditor().options.listeners.onChange('p'));
      act(() => lastEditor().options.listeners.onChange('pr'));
      expect(onChange.mock.calls).toEqual([[{ value: 'p' }], [{ value: 'pr' }]]);
      expect(onDelayedChange).not.toHaveBeenCalled();

      act(() => vi.advanceTimersByTime(500));
      expect(onDelayedChange.mock.calls).toEqual([[{ value: 'pr' }]]);
    });

    test('works as a controlled editor', async () => {
      function Controlled() {
        const [value, setValue] = useState('x = 1');
        return (
          <CodeEditor
            ariaLabel="Code"
            value={value}
            language="python"
            onChange={event => setValue(event.detail.value)}
          />
        );
      }
      await renderLoaded(<Controlled />);
      act(() => lastEditor().options.listeners.onChange('x = 2'));
      expect(lastEditor().setValue).toHaveBeenLastCalledWith('x = 2');
    });

    test('does not push the starting value back into a new editor', async () => {
      await renderLoaded(<CodeEditor ariaLabel="Code" value="x = 1" language="python" />);
      // The editor was created with this value; sending it again when the instance arrives would undo
      // anything typed in between.
      expect(lastEditor().setValue).not.toHaveBeenCalled();
    });

    test('names the language with languageLabel', async () => {
      await renderLoaded(<CodeEditor ariaLabel="Code" value="" language="json" languageLabel="JSON with comments" />);
      expect(getWrapper().findLanguageLabel().getText()).toBe('JSON with comments');
    });

    test('names plain text', async () => {
      await renderLoaded(<CodeEditor ariaLabel="Notes" value="" language="text" />);
      expect(getWrapper().findLanguageLabel().getText()).toBe('Plain text');
    });
  });

  describe('status bar', () => {
    test('shows the cursor position reported by the editor', async () => {
      await renderLoaded(<CodeEditor ariaLabel="Code" value="" language="css" />);
      act(() => lastEditor().options.listeners.onCursorChange({ row: 12, column: 4 }));
      expect(getWrapper().findCursorPosition()!.getText()).toBe('Ln 12, Col 4');
    });

    test('counts errors and warnings and moves to the next one', async () => {
      await renderLoaded(<CodeEditor ariaLabel="Code" value="" language="json" />);
      const wrapper = getWrapper();
      expect(wrapper.findErrorsCount().getText()).toBe('0 errors');
      expect(wrapper.findErrorsCount().getElement()).toBeDisabled();

      act(() => lastEditor().options.listeners.onDiagnosticsChange({ errors: 1, warnings: 3 }));
      expect(wrapper.findErrorsCount().getText()).toBe('1 error');
      expect(wrapper.findWarningsCount().getText()).toBe('3 warnings');

      wrapper.findErrorsCount().click();
      expect(lastEditor().goToNextDiagnostic).toHaveBeenCalledWith('error');
      wrapper.findWarningsCount().click();
      expect(lastEditor().goToNextDiagnostic).toHaveBeenCalledWith('warning');
    });

    test('the Tab toggle switches whether Tab moves focus', async () => {
      await renderLoaded(<CodeEditor ariaLabel="Code" value="" language="json" />);
      const toggle = getWrapper().findTabFocusToggle();
      expect(toggle.getElement()).toHaveAccessibleName('Tab moves focus');
      expect(toggle.getElement()).toHaveAttribute('aria-pressed', 'false');

      toggle.click();
      expect(toggle.getElement()).toHaveAttribute('aria-pressed', 'true');
      expect(lastEditor().config.tabMovesFocus).toBe(true);
    });

    test("the editor's own shortcut updates the Tab toggle", async () => {
      await renderLoaded(<CodeEditor ariaLabel="Code" value="" language="json" />);
      act(() => lastEditor().options.listeners.onTabMovesFocusToggle());
      expect(getWrapper().findTabFocusToggle().getElement()).toHaveAttribute('aria-pressed', 'true');
      expect(lastEditor().config.tabMovesFocus).toBe(true);
    });

    test('takes its labels from i18nStrings', async () => {
      await renderLoaded(
        <CodeEditor
          ariaLabel="Code"
          value=""
          language="json"
          i18nStrings={{
            cursorPosition: (row, column) => `Line ${row}, column ${column}`,
            errorsCount: count => `Errors: ${count}`,
            tabFocusToggleLabel: 'Tab leaves the editor',
            preferencesButtonAriaLabel: 'Settings',
            statusBarGroupAriaLabel: 'Editor status',
          }}
        />
      );
      const wrapper = getWrapper();
      expect(wrapper.findCursorPosition()!.getText()).toBe('Line 1, column 1');
      expect(wrapper.findErrorsCount().getText()).toBe('Errors: 0');
      expect(wrapper.findTabFocusToggle().getText()).toBe('Tab leaves the editor');
      expect(wrapper.findPreferencesButton().getElement()).toHaveAccessibleName('Settings');
      expect(screen.getByRole('group', { name: 'Editor status' })).toBeInTheDocument();
    });
  });

  describe('preferences', () => {
    test('confirming saves the draft and fires onPreferencesChange', async () => {
      const onPreferencesChange = vi.fn();
      await renderLoaded(
        <CodeEditor
          ariaLabel="Code"
          value=""
          language="json"
          onPreferencesChange={event => onPreferencesChange(event.detail)}
        />
      );
      const wrapper = getWrapper();
      expect(wrapper.findPreferencesModal()).toBeNull();

      wrapper.findPreferencesButton().click();
      const modal = wrapper.findPreferencesModal()!;
      expect(modal.isVisible()).toBe(true);
      expect(modal.findHeader()!.getText()).toBe('Editor preferences');
      expect(modal.findWrapLinesCheckbox().findNativeInput().getElement()).toBeChecked();
      expect(modal.findThemeRadioGroup().getSelectedValue()).toBe('auto');

      modal.findWrapLinesCheckbox().findNativeInput().click();
      modal.findShowGutterCheckbox().findNativeInput().click();
      modal.findThemeRadioGroup().findInputByValue('dark')!.click();
      modal.findConfirmButton().click();

      expect(onPreferencesChange).toHaveBeenCalledWith({ wrapLines: false, theme: 'dark', showGutter: false });
      expect(wrapper.findPreferencesModal()).toBeNull();
      expect(lastEditor().config).toMatchObject({ wrapLines: false, showGutter: false });
      expect(wrapper.findEditor().getElement()).toHaveClass(styles['theme-dark']);
      expect(wrapper.findPreferencesButton().getElement()).toHaveFocus();
    });

    test('cancelling discards the draft', async () => {
      const onPreferencesChange = vi.fn();
      await renderLoaded(
        <CodeEditor ariaLabel="Code" value="" language="json" onPreferencesChange={onPreferencesChange} />
      );
      const wrapper = getWrapper();
      wrapper.findPreferencesButton().click();
      wrapper.findPreferencesModal()!.findWrapLinesCheckbox().findNativeInput().click();
      wrapper.findPreferencesModal()!.findCancelButton().click();

      expect(onPreferencesChange).not.toHaveBeenCalled();
      expect(lastEditor().config.wrapLines).toBe(true);
      expect(wrapper.findPreferencesButton().getElement()).toHaveFocus();

      wrapper.findPreferencesButton().click();
      expect(wrapper.findPreferencesModal()!.findWrapLinesCheckbox().findNativeInput().getElement()).toBeChecked();
    });

    test('follows controlled preferences', async () => {
      const { rerender } = await renderLoaded(
        <CodeEditor ariaLabel="Code" value="" language="json" preferences={{ wrapLines: false, theme: 'light' }} />
      );
      expect(lastEditor().config).toMatchObject({ wrapLines: false, showGutter: true });
      expect(getWrapper().findEditor().getElement()).toHaveClass(styles['theme-light']);

      rerender(
        <CodeEditor
          ariaLabel="Code"
          value=""
          language="json"
          preferences={{ wrapLines: true, theme: 'auto', showGutter: false }}
        />
      );
      expect(lastEditor().config).toMatchObject({ wrapLines: true, showGutter: false });
      expect(getWrapper().findEditor().getElement()).not.toHaveClass(styles['theme-light']);
    });
  });

  describe('resizing', () => {
    test('starts at 480 pixels and resizes with the keyboard', async () => {
      const onEditorContentResize = vi.fn();
      await renderLoaded(
        <CodeEditor
          ariaLabel="Code"
          value=""
          language="json"
          onEditorContentResize={event => onEditorContentResize(event.detail)}
        />
      );
      const wrapper = getWrapper();
      const handle = wrapper.findResizeHandle();
      expect(wrapper.findEditor().getElement()).toHaveStyle({ blockSize: '480px' });
      expect(handle.getElement()).toHaveAttribute('role', 'separator');
      expect(handle.getElement()).toHaveAccessibleName('Resize editor');

      handle.keydown('ArrowDown');
      expect(onEditorContentResize).toHaveBeenLastCalledWith({ height: 496 });
      expect(wrapper.findEditor().getElement()).toHaveStyle({ blockSize: '496px' });

      handle.keydown('ArrowUp');
      handle.keydown('ArrowUp');
      expect(onEditorContentResize).toHaveBeenLastCalledWith({ height: 464 });
    });

    test('keeps a controlled height', async () => {
      const onEditorContentResize = vi.fn();
      await renderLoaded(
        <CodeEditor
          ariaLabel="Code"
          value=""
          language="json"
          editorContentHeight={200}
          onEditorContentResize={event => onEditorContentResize(event.detail)}
        />
      );
      const wrapper = getWrapper();
      wrapper.findResizeHandle().keydown('Home');
      expect(onEditorContentResize).toHaveBeenLastCalledWith({ height: 64 });
      expect(wrapper.findEditor().getElement()).toHaveStyle({ blockSize: '200px' });
    });
  });

  describe('accessibility and forms', () => {
    test('names the editable element with ariaLabel and the group with its label', async () => {
      await renderLoaded(<CodeEditor ariaLabel="Startup script" value="" language="python" />);
      expect(screen.getByRole('textbox', { name: 'Startup script' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Code editor' })).toBeInTheDocument();
    });

    test('takes its ID, label, description and error from a form field', async () => {
      await renderLoaded(
        <FormField label="Policy" description="An IAM policy document." errorText="The policy is not valid JSON.">
          <CodeEditor value="{" language="json" />
        </FormField>
      );
      const content = screen.getByRole('textbox', { name: 'Policy' });
      expect(content).toHaveAttribute('aria-invalid', 'true');
      expect(content).toHaveAttribute('id');
      expect(content).toHaveAccessibleDescription('The policy is not valid JSON. An IAM policy document.');
    });

    test('read-only reaches the editor and assistive technology', async () => {
      await renderLoaded(<CodeEditor ariaLabel="Audit log" value="ok" language="text" readOnly={true} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-readonly', 'true');
      expect(lastEditor().config.readOnly).toBe(true);
    });

    test('focuses the editor through its ref', async () => {
      const ref = React.createRef<CodeEditorProps.Ref>();
      await renderLoaded(<CodeEditor ref={ref} ariaLabel="Code" value="" language="json" />);
      act(() => ref.current!.focus());
      expect(lastEditor().focus).toHaveBeenCalledOnce();
      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    test('lays the code out left to right in a right-to-left page', async () => {
      await renderLoaded(
        <div dir="rtl">
          <CodeEditor ariaLabel="Code" value="" language="json" />
        </div>
      );
      expect(getWrapper().findEditor().getElement()).toHaveAttribute('dir', 'ltr');
      expect(getWrapper().findStatusBar().getElement()).not.toHaveAttribute('dir');
    });

    test('passes the id and data attributes to the root', async () => {
      await renderLoaded(<CodeEditor id="policy" data-testid="policy-editor" value="" language="json" />);
      expect(getWrapper().getElement()).toHaveAttribute('id', 'policy');
      expect(getWrapper().getElement()).toHaveAttribute('data-testid', 'policy-editor');
    });

    test('has no accessibility violations', async () => {
      const { container } = await renderLoaded(
        <FormField label="Policy" errorText="Not valid JSON.">
          <CodeEditor value="{" language="json" />
        </FormField>
      );
      act(() => lastEditor().options.listeners.onDiagnosticsChange({ errors: 1, warnings: 0 }));
      await expectNoAxeViolations(container);
    });

    test('has no accessibility violations while loading or with the preferences open', async () => {
      engine.load.mockReturnValue(new Promise(() => {}));
      const { container } = render(<CodeEditor ariaLabel="Code" value="" language="json" />);
      await expectNoAxeViolations(container);
      getWrapper().findPreferencesButton().click();
      await expectNoAxeViolations(container);
    });
  });
});
