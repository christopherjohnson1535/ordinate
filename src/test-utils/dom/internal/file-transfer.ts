// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '../core';

// jsdom has no DataTransfer, so drag events get a stand-in with the parts the components read.
function dragEvent(type: string, files: ReadonlyArray<File>): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', {
    value: { files, types: ['Files'], items: [], dropEffect: 'none', effectAllowed: 'all' },
  });
  return event;
}

/**
 * Starts dragging files over an element, without dropping them.
 */
export function dragFilesOver(target: ElementWrapper, files: ReadonlyArray<File>): void {
  target.fireEvent(dragEvent('dragenter', files));
  target.fireEvent(dragEvent('dragover', files));
}

/**
 * Drags files onto an element and drops them, as a user dragging files from their desktop would.
 */
export function dropFiles(target: ElementWrapper, files: ReadonlyArray<File>): void {
  dragFilesOver(target, files);
  target.fireEvent(dragEvent('drop', files));
}

/**
 * Chooses files in a native file input, as if the user had picked them in the file chooser.
 */
export function chooseFiles(input: ElementWrapper<HTMLInputElement>, files: ReadonlyArray<File>): void {
  Object.defineProperty(input.getElement(), 'files', { configurable: true, value: files });
  input.fireEvent(new Event('change', { bubbles: true }));
}
