// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import Textarea, { TextareaProps } from '../../../lib/components/textarea';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import textareaStyles from '../../../lib/components/textarea/styles.css.js';

describe('Textarea', () => {
  test('renders a native textarea with three rows by default', () => {
    render(<Textarea ariaLabel="Notes" value="" />);
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  test('fires onChange with the new value', () => {
    const onChange = vi.fn();
    render(<Textarea ariaLabel="Notes" value="" onChange={event => onChange(event.detail)} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Rotate keys monthly.' } });
    expect(onChange).toHaveBeenCalledWith({ value: 'Rotate keys monthly.' });
  });

  test('works as a controlled textarea', () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return <Textarea ariaLabel="Notes" value={value} onChange={event => setValue(event.detail.value)} />;
    }
    render(<Controlled />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'line one\nline two' } });
    expect(screen.getByRole('textbox')).toHaveValue('line one\nline two');
  });

  test('passes the native attributes', () => {
    render(
      <Textarea
        ariaLabel="Notes"
        value=""
        rows={6}
        name="notes"
        placeholder="Add a note"
        spellcheck={false}
        disableBrowserAutocorrect={true}
        autoComplete={false}
        ariaRequired={true}
      />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '6');
    expect(textarea).toHaveAttribute('name', 'notes');
    expect(textarea).toHaveAttribute('placeholder', 'Add a note');
    expect(textarea).toHaveAttribute('spellcheck', 'false');
    expect(textarea).toHaveAttribute('autocorrect', 'off');
    expect(textarea).toHaveAttribute('autocapitalize', 'off');
    expect(textarea).toHaveAttribute('autocomplete', 'off');
    expect(textarea).toHaveAttribute('aria-required', 'true');
  });

  test('leaves spellcheck and autocorrect to the browser by default', () => {
    render(<Textarea ariaLabel="Notes" value="" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).not.toHaveAttribute('spellcheck');
    expect(textarea).not.toHaveAttribute('autocorrect');
  });

  test('disabled and read-only map to the native attributes', () => {
    render(
      <>
        <Textarea ariaLabel="Disabled" value="" disabled={true} />
        <Textarea ariaLabel="Read-only" value="" readOnly={true} />
      </>
    );
    expect(screen.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Read-only' })).toHaveAttribute('readonly');
  });

  test('fires onKeyDown with the key detail, and preventDefault stops the key', () => {
    const onKeyDown = vi.fn((event: CustomEvent<TextareaProps.KeyDetail>) => event.preventDefault());
    render(<Textarea ariaLabel="Notes" value="" onKeyDown={onKeyDown} />);
    const keydown = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true, cancelable: true });
    screen.getByRole('textbox').dispatchEvent(keydown);
    expect(onKeyDown.mock.calls[0][0].detail).toEqual({
      key: 'Enter',
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      isComposing: false,
    });
    expect(keydown.defaultPrevented).toBe(true);
  });

  test('fires onFocus and onBlur', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<Textarea ariaLabel="Notes" value="" onFocus={onFocus} onBlur={onBlur} />);
    fireEvent.focus(screen.getByRole('textbox'));
    fireEvent.blur(screen.getByRole('textbox'));
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  test('focuses itself with autoFocus', () => {
    render(<Textarea ariaLabel="Notes" value="" autoFocus={true} />);
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  test('takes its label, description and error from a form field', () => {
    render(
      <FormField label="Notes" description="Shown to your team." errorText="Keep notes under 500 characters.">
        <Textarea value="" />
      </FormField>
    );
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription('Keep notes under 500 characters. Shown to your team.');
  });

  test('takes its warning from a form field', () => {
    render(
      <FormField label="Notes" warningText="Notes over 200 characters are cut in the summary.">
        <Textarea value="" />
      </FormField>
    );
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).toHaveClass(textareaStyles.warning);
    expect(textarea).not.toHaveAttribute('aria-invalid');
    expect(textarea).toHaveAccessibleDescription('Notes over 200 characters are cut in the summary.');
  });

  test('a warning on the control wins over the field', () => {
    render(
      <FormField label="Notes" warningText="Notes over 200 characters are cut in the summary.">
        <Textarea value="" warning={false} />
      </FormField>
    );
    expect(screen.getByRole('textbox')).not.toHaveClass(textareaStyles.warning);
  });

  test('props on the control win over the field', () => {
    render(
      <FormField label="Notes" errorText="Too long.">
        <Textarea value="" invalid={false} />
      </FormField>
    );
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  test('exposes focus() and select() through its ref', () => {
    const ref = React.createRef<TextareaProps.Ref>();
    render(<Textarea ref={ref} ariaLabel="Notes" value="Rotate keys" />);
    ref.current?.focus();
    expect(screen.getByRole('textbox')).toHaveFocus();
    ref.current?.select();
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.selectionEnd - textarea.selectionStart).toBe('Rotate keys'.length);
  });
});

describe('Textarea test utilities and accessibility', () => {
  test('the wrapper types into the textarea', () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return <Textarea ariaLabel="Notes" value={value} onChange={event => setValue(event.detail.value)} />;
    }
    render(<Controlled />);
    const textarea = createWrapper().findTextarea()!;
    textarea.setTextareaValue('Rotate keys monthly.');
    expect(textarea.getTextareaValue()).toBe('Rotate keys monthly.');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <form>
        <FormField label="Notes" description="Shown to your team.">
          <Textarea value="Rotate keys monthly." />
        </FormField>
        <FormField label="Summary" errorText="Enter a summary.">
          <Textarea value="" />
        </FormField>
        <FormField label="Audit log">
          <Textarea value="Created by ops." readOnly={true} />
        </FormField>
        <Textarea ariaLabel="Disabled notes" value="" disabled={true} warning={true} />
      </form>
    );
    await expectNoAxeViolations(container);
  });
});
