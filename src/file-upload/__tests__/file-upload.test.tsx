// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FileUpload, { FileUploadProps } from '../../../lib/components/file-upload';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const plan = new File(['plan'], 'site-plan.pdf', { type: 'application/pdf' });
const section = new File(['section'], 'section-a.png', { type: 'image/png' });
const elevation = new File(['elevation'], 'elevation.png', { type: 'image/png' });

const upload = () => createWrapper().findFileUpload()!;

function transfer(files: File[]) {
  return { dataTransfer: { files, types: ['Files'], dropEffect: 'none' } };
}

function Controlled(props: Partial<FileUploadProps>) {
  const [value, setValue] = useState<ReadonlyArray<File>>(props.value ?? []);
  return <FileUpload {...props} value={value} onChange={event => setValue(event.detail.value)} />;
}

describe('FileUpload', () => {
  test('renders the file input with the default text and no tokens', () => {
    render(<FileUpload value={[]} />);
    expect(upload().findFileInput()!.findTrigger().getText()).toBe('Choose file');
    expect(upload().findFileTokens()).toHaveLength(0);
    expect(screen.queryByRole('list')).toBeNull();
  });

  test('takes the button text from i18nStrings', () => {
    render(<FileUpload value={[]} multiple={true} i18nStrings={{ uploadButtonText: 'Attach drawings' }} />);
    expect(upload().findFileInput()!.findTrigger().getText()).toBe('Attach drawings');
  });

  test('fires onChange with the chosen file, replacing the current one', () => {
    const onChange = vi.fn();
    render(<FileUpload value={[plan]} onChange={event => onChange(event.detail)} />);
    upload().selectFiles([section]);
    expect(onChange).toHaveBeenCalledWith({ value: [section] });
  });

  test('adds chosen files when multiple', () => {
    render(<Controlled value={[plan]} multiple={true} />);
    upload().selectFiles([section, elevation]);
    expect(
      upload()
        .findFileTokens()
        .map(token => token.findFileName().getText())
    ).toEqual(['site-plan.pdf', 'section-a.png', 'elevation.png']);
  });

  test('swaps the button for the drop zone while files are dragged over the page', () => {
    render(<FileUpload value={[]} multiple={true} />);
    expect(upload().findFileDropzone()).toBeNull();
    fireEvent.dragEnter(document.body, transfer([plan]));
    expect(upload().findFileInput()).toBeNull();
    expect(upload().findFileDropzone()!.getText()).toBe('Drop files to upload');
    fireEvent.dragLeave(document.body, transfer([plan]));
    expect(upload().findFileDropzone()).toBeNull();
    expect(upload().findFileInput()).not.toBeNull();
  });

  test('takes the drop zone text from i18nStrings', () => {
    render(<FileUpload value={[]} i18nStrings={{ dropzoneText: 'Drop the drawing here' }} />);
    fireEvent.dragEnter(document.body, transfer([plan]));
    expect(upload().findFileDropzone()!.getText()).toBe('Drop the drawing here');
  });

  test('adds dropped files when multiple', () => {
    render(<Controlled value={[plan]} multiple={true} />);
    upload().dropFiles([section, elevation]);
    expect(upload().findFileTokens()).toHaveLength(3);
    expect(upload().findFileInput()).not.toBeNull();
  });

  test('keeps only the first dropped file when not multiple', () => {
    const onChange = vi.fn();
    render(<FileUpload value={[plan]} onChange={event => onChange(event.detail)} />);
    upload().dropFiles([section, elevation]);
    expect(onChange).toHaveBeenCalledWith({ value: [section] });
  });

  test('removes a file from the value', () => {
    render(<Controlled value={[plan, section, elevation]} multiple={true} />);
    upload().findFileToken(2)!.findRemoveButton()!.click();
    expect(
      upload()
        .findFileTokens()
        .map(token => token.findFileName().getText())
    ).toEqual(['site-plan.pdf', 'elevation.png']);
  });

  test('moves focus to the file input after the last file is removed', () => {
    render(<Controlled value={[plan]} />);
    const remove = screen.getByRole('button', { name: 'Remove file 1, site-plan.pdf' });
    act(() => remove.focus());
    fireEvent.click(remove);
    expect(upload().findFileInput()!.findNativeInput().getElement()).toHaveFocus();
  });

  test('shows file size, date and per-file errors and warnings', () => {
    render(
      <FileUpload
        value={[plan, section]}
        showFileSize={true}
        showFileLastModified={true}
        fileErrors={['Too large']}
        fileWarnings={[null, 'Low resolution']}
      />
    );
    const [first, second] = upload().findFileTokens();
    expect(first.findFileSize()!.getText()).toBe('4 B');
    expect(first.findFileLastModified()).not.toBeNull();
    expect(first.findFileError()!.getText()).toBe('Too large');
    expect(second.findFileError()).toBeNull();
    expect(second.findFileWarning()!.getText()).toBe('Low resolution');
  });

  test('limits the tokens', () => {
    render(<FileUpload value={[plan, section, elevation]} multiple={true} tokenLimit={2} />);
    expect(upload().findFileTokens()).toHaveLength(2);
    expect(upload().findTokenToggle()!.getText()).toBe('+1 more');
  });

  test('passes the remove label and toggle texts to the tokens', () => {
    render(
      <FileUpload
        value={[plan, section]}
        multiple={true}
        tokenLimit={1}
        i18nStrings={{ removeFileAriaLabel: (_, name) => `Discard ${name}`, limitShowMore: 'More files' }}
      />
    );
    expect(screen.getByRole('button', { name: 'Discard site-plan.pdf' })).toBeInTheDocument();
    expect(upload().findTokenToggle()!.getText()).toBe('More files');
  });

  test('describes the input with the constraint, error and warning', () => {
    const { rerender } = render(
      <FileUpload value={[]} constraintText="PDF, up to 10 MB" errorText="Choose a drawing" />
    );
    const input = () => upload().findFileInput()!.findNativeInput().getElement();
    expect(upload().findConstraint()!.getText()).toBe('PDF, up to 10 MB');
    expect(upload().findError()!.getText()).toBe('Choose a drawing');
    expect(input()).toHaveAttribute('aria-invalid', 'true');
    expect(input()).toHaveAccessibleDescription('Choose a drawing PDF, up to 10 MB');

    rerender(<FileUpload value={[]} warningText="Older revision" />);
    expect(upload().findWarning()!.getText()).toBe('Older revision');
    expect(input()).not.toHaveAttribute('aria-invalid');
    expect(input()).toHaveAccessibleDescription('Older revision');
  });

  test('takes the error and warning icon labels from i18nStrings', () => {
    render(<FileUpload value={[]} errorText="Choose a drawing" i18nStrings={{ errorIconAriaLabel: 'Problem' }} />);
    expect(screen.getByRole('img', { name: 'Problem' })).toBeInTheDocument();
  });

  test('passes accept and ariaRequired to the native input', () => {
    render(<FileUpload value={[]} accept=".pdf" ariaRequired={true} />);
    const input = upload().findFileInput()!.findNativeInput().getElement();
    expect(input).toHaveAttribute('accept', '.pdf');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  test('focuses the native input from the ref', () => {
    function WithRef() {
      const ref = useRef<FileUploadProps.Ref>(null);
      return (
        <>
          <FileUpload ref={ref} value={[]} />
          <button onClick={() => ref.current?.focus()}>Focus</button>
        </>
      );
    }
    render(<WithRef />);
    fireEvent.click(screen.getByRole('button', { name: 'Focus' }));
    expect(upload().findFileInput()!.findNativeInput().getElement()).toHaveFocus();
  });

  test('passes id and data attributes to the root', () => {
    render(<FileUpload id="drawings" data-testid="drawings" value={[]} />);
    expect(upload().getElement()).toHaveAttribute('id', 'drawings');
    expect(upload().getElement()).toHaveAttribute('data-testid', 'drawings');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <FormField label="Drawings">
        <FileUpload
          value={[plan, section]}
          multiple={true}
          showFileSize={true}
          constraintText="PDF or PNG"
          errorText="One file is too large"
          fileErrors={['Too large']}
        />
      </FormField>
    );
    await expectNoAxeViolations(container);
  });
});

describe('FileUpload in a FormField', () => {
  test('takes its label, description and error from the field', () => {
    render(
      <FormField label="Drawings" description="The signed set" errorText="Choose a drawing">
        <FileUpload value={[]} constraintText="PDF only" />
      </FormField>
    );
    const input = upload().findFileInput()!.findNativeInput().getElement();
    expect(input).toHaveAccessibleName('Drawings Choose file');
    expect(input).toHaveAccessibleDescription('Choose a drawing The signed set PDF only');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
