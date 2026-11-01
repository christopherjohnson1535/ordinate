// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { createEvent, fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FileDropzone from '../../../lib/components/file-dropzone';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const plan = new File(['plan'], 'site-plan.pdf', { type: 'application/pdf' });
const section = new File(['section'], 'section-a.png', { type: 'image/png' });

const dropzone = () => createWrapper().findFileDropzone()!;

function transfer(files: File[], types = ['Files']) {
  return { dataTransfer: { files, types, dropEffect: 'none' } };
}

// jsdom has no DragEvent, so the related target is set by hand.
function dragLeave(element: Element, relatedTarget: Element) {
  const event = createEvent.dragLeave(element, transfer([plan]));
  Object.defineProperty(event, 'relatedTarget', { value: relatedTarget });
  fireEvent(element, event);
}

describe('FileDropzone', () => {
  test('renders its children', () => {
    render(<FileDropzone>Drop drawings here</FileDropzone>);
    expect(dropzone().findContent().getText()).toBe('Drop drawings here');
  });

  test('fires onChange with the dropped files', () => {
    const onChange = vi.fn();
    render(<FileDropzone onChange={event => onChange(event.detail)}>Drop</FileDropzone>);
    const zone = dropzone().getElement();
    fireEvent.dragEnter(zone, transfer([plan, section]));
    fireEvent.dragOver(zone, transfer([plan, section]));
    fireEvent.drop(zone, transfer([plan, section]));
    expect(onChange).toHaveBeenCalledWith({ value: [plan, section] });
  });

  test('accepts a drag of files as a copy and prevents the browser from opening them', () => {
    render(<FileDropzone>Drop</FileDropzone>);
    const zone = dropzone().getElement();
    const init = transfer([plan]);
    expect(fireEvent.dragOver(zone, init)).toBe(false);
    expect(init.dataTransfer.dropEffect).toBe('copy');
    expect(fireEvent.drop(zone, transfer([plan]))).toBe(false);
  });

  test('ignores drags that carry no files', () => {
    render(<FileDropzone>Drop</FileDropzone>);
    const zone = dropzone().getElement();
    expect(fireEvent.dragOver(zone, transfer([], ['text/plain']))).toBe(true);
    expect(dropzone().isPageDragging()).toBe(false);
    expect(dropzone().isActive()).toBe(false);
  });

  test('outlines the zone while files are dragged anywhere over the page', () => {
    render(<FileDropzone>Drop</FileDropzone>);
    fireEvent.dragEnter(document.body, transfer([plan]));
    expect(dropzone().isPageDragging()).toBe(true);
    expect(dropzone().isActive()).toBe(false);
    // Leaving with nowhere to go means the pointer left the window.
    fireEvent.dragLeave(document.body, transfer([plan]));
    expect(dropzone().isPageDragging()).toBe(false);
  });

  test('stays outlined while the pointer moves between elements of the page', () => {
    const { container } = render(
      <>
        <p>Before</p>
        <FileDropzone>Drop</FileDropzone>
      </>
    );
    const paragraph = container.querySelector('p')!;
    fireEvent.dragEnter(paragraph, transfer([plan]));
    dragLeave(paragraph, dropzone().getElement());
    expect(dropzone().isPageDragging()).toBe(true);
  });

  test('highlights the zone while files are over it, including over its children', () => {
    render(
      <FileDropzone>
        <strong>Drop</strong>
      </FileDropzone>
    );
    const zone = dropzone().getElement();
    const child = zone.querySelector('strong')!;
    dropzone().dragFilesOver([plan]);
    expect(dropzone().isActive()).toBe(true);
    dragLeave(zone, child);
    expect(dropzone().isActive()).toBe(true);
    dragLeave(zone, document.body);
    expect(dropzone().isActive()).toBe(false);
    expect(dropzone().isPageDragging()).toBe(true);
  });

  test('clears the highlight after a drop', () => {
    render(<FileDropzone>Drop</FileDropzone>);
    dropzone().dropFiles([plan]);
    expect(dropzone().isActive()).toBe(false);
    expect(dropzone().isPageDragging()).toBe(false);
  });

  test('clears the highlight when the drag ends elsewhere', () => {
    render(<FileDropzone>Drop</FileDropzone>);
    dropzone().dragFilesOver([plan]);
    fireEvent.drop(document.body, transfer([plan]));
    expect(dropzone().isActive()).toBe(false);
    expect(dropzone().isPageDragging()).toBe(false);
  });

  test('keeps a file dropped outside the zone from replacing the page', () => {
    render(<FileDropzone>Drop</FileDropzone>);
    fireEvent.dragEnter(document.body, transfer([plan]));
    const init = transfer([plan]);
    expect(fireEvent.dragOver(document.body, init)).toBe(false);
    expect(init.dataTransfer.dropEffect).toBe('none');
    expect(fireEvent.drop(document.body, transfer([plan]))).toBe(false);
  });

  test('passes id and data attributes to the root', () => {
    render(
      <FileDropzone id="drop" data-testid="drop">
        Drop
      </FileDropzone>
    );
    expect(dropzone().getElement()).toHaveAttribute('id', 'drop');
    expect(dropzone().getElement()).toHaveAttribute('data-testid', 'drop');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<FileDropzone>Drop files to upload</FileDropzone>);
    dropzone().dragFilesOver([plan]);
    await expectNoAxeViolations(container);
  });
});
