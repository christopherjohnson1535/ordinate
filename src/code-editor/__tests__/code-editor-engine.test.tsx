// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { EditorView } from '@codemirror/view';
import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import CodeEditor from '../../../lib/components/code-editor';
import createWrapper from '../../../lib/components/test-utils/dom';

// jsdom has no layout, and CodeMirror measures text ranges after each update.
beforeAll(() => {
  const emptyRect = () => new DOMRect(0, 0, 0, 0);
  const emptyList = () => Object.assign([], { item: () => null }) as unknown as DOMRectList;
  Range.prototype.getBoundingClientRect = emptyRect;
  Range.prototype.getClientRects = emptyList;
});

function getView(): EditorView {
  const content = createWrapper().findCodeEditor()!.findEditorContent()!.getElement();
  return EditorView.findFromDOM(content)!;
}

function type(view: EditorView, text: string) {
  act(() => {
    const end = view.state.doc.length;
    view.dispatch({
      changes: { from: end, insert: text },
      selection: { anchor: end + text.length },
      userEvent: 'input.type',
    });
  });
}

// The first test pays for importing CodeMirror cold, which can take several seconds on a busy machine.
const engineTimeout = 15000;

async function renderEditor(element: React.ReactElement) {
  const result = render(element);
  await waitFor(() => expect(createWrapper().findCodeEditor()!.findEditorContent()).not.toBeNull(), {
    timeout: engineTimeout,
  });
  return result;
}

describe('CodeEditor with CodeMirror', { timeout: engineTimeout * 2 }, () => {
  test('loads CodeMirror, takes typing and reads the value back', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('const answer = 4');
      return (
        <CodeEditor
          ariaLabel="Script"
          value={value}
          language="javascript"
          onChange={event => {
            onChange(event.detail.value);
            setValue(event.detail.value);
          }}
        />
      );
    }
    await renderEditor(<Controlled />);
    const content = screen.getByRole('textbox', { name: 'Script' });
    expect(content).toHaveTextContent('const answer = 4');

    type(getView(), '2;');
    expect(onChange).toHaveBeenLastCalledWith('const answer = 42;');
    expect(getView().state.doc.toString()).toBe('const answer = 42;');
    expect(content).toHaveTextContent('const answer = 42;');
    // The status bar follows the selection on the next render, which can lag under load.
    await waitFor(() => expect(createWrapper().findCodeEditor()!.findCursorPosition()!.getText()).toBe('Ln 1, Col 19'));
  });

  test('applies a new value from the parent without reporting it as a change', async () => {
    const onChange = vi.fn();
    const { rerender } = await renderEditor(
      <CodeEditor ariaLabel="Config" value="a: 1" language="yaml" onChange={onChange} />
    );
    rerender(<CodeEditor ariaLabel="Config" value={'a: 1\nb: 2'} language="yaml" onChange={onChange} />);
    expect(getView().state.doc.toString()).toBe('a: 1\nb: 2');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('keeps read-only code unchanged and marks it for assistive technology', async () => {
    await renderEditor(<CodeEditor ariaLabel="Log" value="done" language="text" readOnly={true} />);
    expect(getView().state.readOnly).toBe(true);
    expect(screen.getByRole('textbox', { name: 'Log' })).toHaveAttribute('aria-readonly', 'true');
  });

  test('counts syntax errors in the status bar', async () => {
    await renderEditor(<CodeEditor ariaLabel="Policy" value={'{"a": }'} language="json" />);
    const errors = createWrapper().findCodeEditor()!.findErrorsCount();
    await waitFor(() => expect(errors.getText()).toBe('1 error'), { timeout: 5000 });
  });
});
