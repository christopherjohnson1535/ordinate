// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FileInput, { FileInputProps } from '../../../lib/components/file-input';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const plan = new File(['plan'], 'site-plan.pdf', { type: 'application/pdf' });
const section = new File(['section'], 'section-a.png', { type: 'image/png' });
const elevation = new File(['elevation'], 'elevation.png', { type: 'image/png' });

const fileInput = () => createWrapper().findFileInput()!;

function choose(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', { configurable: true, value: files });
  fireEvent.change(input);
}

describe('FileInput', () => {
  test('renders a button with the default text, named on the native input', () => {
    render(<FileInput value={[]} />);
    expect(fileInput().findTrigger().getText()).toBe('Choose file');
    const input = fileInput().findNativeInput().getElement();
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAccessibleName('Choose file');
  });

  test('says files in the default text when multiple', () => {
    render(<FileInput value={[]} multiple={true} />);
    expect(fileInput().findTrigger().getText()).toBe('Choose files');
    expect(fileInput().findNativeInput().getElement()).toHaveAttribute('multiple');
  });

  test('uses children as the text', () => {
    render(<FileInput value={[]}>Attach drawings</FileInput>);
    expect(fileInput().findTrigger().getText()).toBe('Attach drawings');
    expect(fileInput().findNativeInput().getElement()).toHaveAccessibleName('Attach drawings');
  });

  test('keeps the button out of the tab order and the accessibility tree', () => {
    render(<FileInput value={[]} />);
    const button = fileInput().findTrigger().getElement();
    expect(button).toHaveAttribute('tabindex', '-1');
    expect(button).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('fires onChange with the chosen file', () => {
    const onChange = vi.fn();
    render(<FileInput value={[plan]} onChange={event => onChange(event.detail)} />);
    choose(fileInput().findNativeInput().getElement(), [section]);
    expect(onChange).toHaveBeenCalledWith({ value: [section] });
  });

  test('keeps only the first file when not multiple', () => {
    const onChange = vi.fn();
    render(<FileInput value={[]} onChange={event => onChange(event.detail)} />);
    choose(fileInput().findNativeInput().getElement(), [section, elevation]);
    expect(onChange).toHaveBeenCalledWith({ value: [section] });
  });

  test('adds chosen files after the current ones when multiple', () => {
    const onChange = vi.fn();
    render(<FileInput value={[plan]} multiple={true} onChange={event => onChange(event.detail)} />);
    fileInput().selectFiles([section, elevation]);
    expect(onChange).toHaveBeenCalledWith({ value: [plan, section, elevation] });
  });

  test('does not fire onChange when the chooser is cancelled', () => {
    const onChange = vi.fn();
    render(<FileInput value={[plan]} onChange={onChange} />);
    fileInput().selectFiles([]);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('opens the file chooser from the button', () => {
    render(<FileInput value={[]} />);
    const input = fileInput().findNativeInput().getElement();
    const click = vi.spyOn(input, 'click');
    fileInput().findTrigger().click();
    expect(click).toHaveBeenCalled();
  });

  test('passes accept to the native input', () => {
    render(<FileInput value={[]} accept=".pdf,image/*" />);
    expect(fileInput().findNativeInput().getElement()).toHaveAttribute('accept', '.pdf,image/*');
  });

  test('shows only the icon in the icon variant, named by ariaLabel', () => {
    render(<FileInput value={[]} variant="icon" ariaLabel="Attach a drawing" />);
    expect(fileInput().findTrigger().findTextRegion()).toBeNull();
    expect(fileInput().findTrigger().findIcon()).not.toBeNull();
    expect(fileInput().findNativeInput().getElement()).toHaveAccessibleName('Attach a drawing');
  });

  test('disables the input and the button', () => {
    render(<FileInput value={[]} disabled={true} />);
    expect(fileInput().findNativeInput().getElement()).toBeDisabled();
    expect(fileInput().findTrigger().isDisabled()).toBe(true);
  });

  test('focuses the native input from the ref and with the keyboard', () => {
    function WithRef() {
      const ref = useRef<FileInputProps.Ref>(null);
      return (
        <>
          <FileInput ref={ref} value={[]} />
          <button onClick={() => ref.current?.focus()}>Focus</button>
        </>
      );
    }
    render(<WithRef />);
    fireEvent.click(screen.getByRole('button', { name: 'Focus' }));
    expect(fileInput().findNativeInput().getElement()).toHaveFocus();
  });

  test('marks the input invalid and described', () => {
    render(
      <>
        <FileInput value={[]} invalid={true} ariaDescribedby="hint" ariaRequired={true} />
        <span id="hint">PDF only</span>
      </>
    );
    const input = fileInput().findNativeInput().getElement();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAccessibleDescription('PDF only');
  });

  test('passes id and data attributes to the root', () => {
    render(<FileInput id="drawings" data-testid="drawings" value={[]} />);
    expect(fileInput().getElement()).toHaveAttribute('id', 'drawings');
    expect(fileInput().getElement()).toHaveAttribute('data-testid', 'drawings');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <FileInput value={[]} />
        <FileInput value={[]} variant="icon" ariaLabel="Attach" />
        <FileInput value={[]} disabled={true} />
      </>
    );
    await expectNoAxeViolations(container);
  });
});

describe('FileInput in a FormField', () => {
  test('takes its label, description and error from the field', () => {
    render(
      <FormField label="Drawings" description="Scans of the signed set" errorText="Choose a file">
        <FileInput value={[]} />
      </FormField>
    );
    const input = fileInput().findNativeInput().getElement();
    expect(input).toHaveAccessibleName('Drawings Choose file');
    expect(input).toHaveAccessibleDescription('Choose a file Scans of the signed set');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('opens the file chooser from the field label', () => {
    render(
      <FormField label="Drawings">
        <FileInput value={[]} />
      </FormField>
    );
    const onClick = vi.fn();
    fileInput().findNativeInput().getElement().addEventListener('click', onClick);
    act(() => screen.getByText('Drawings').click());
    expect(onClick).toHaveBeenCalled();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <FormField label="Drawings" errorText="Choose a file">
        <FileInput value={[]} multiple={true} />
      </FormField>
    );
    await expectNoAxeViolations(container);
  });
});
