// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'FileInput',
  folder: 'file-input',
  group: 'dates-and-files',
  summary: 'Opens the file chooser from a button and hands you the files the user picked.',
  description: (
    <>
      <p>
        A file input is a button with an upload icon, standing on its offset like any other button, over a native file
        input that keeps focus and the accessible name. It shows nothing of the files it holds: show them yourself,
        usually with a <a href="#/components/file-token-group">FileTokenGroup</a>, or use{' '}
        <a href="#/components/file-upload">FileUpload</a>, which does both.
      </p>
      <p>
        The value is controlled. With <code>multiple</code> the files the user picks are added after the ones in{' '}
        <code>value</code>; without it the picked file replaces them.
      </p>
    </>
  ),
  marks: ['M13'],
  examples: [
    {
      id: 'basic',
      title: 'Choose a file',
      description: (
        <p>
          The button text defaults to “Choose file”, or “Choose files” with <code>multiple</code>. Name the file
          instead when that is clearer.
        </p>
      ),
    },
    {
      id: 'with-tokens',
      title: 'With the chosen files',
      description: (
        <p>
          Pair the input with a FileTokenGroup so the user sees what they chose and can remove a file. This is what
          FileUpload does for you.
        </p>
      ),
    },
    {
      id: 'icon',
      title: 'Icon only',
      description: (
        <p>
          <code>variant="icon"</code> draws only the upload icon, for a toolbar or the end of a message box. Give it an{' '}
          <code>ariaLabel</code>.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'When you show the chosen files in your own way, or upload them as soon as they are chosen.',
      'Inside a FileDropzone, so keyboard users can add files too.',
    ],
    avoid: [
      <>
        In a form where the user reviews files before submitting. Use a{' '}
        <a href="#/components/file-upload">FileUpload</a>, which lists them with errors and remove buttons.
      </>,
      'Trusting accept to filter the files. Browsers treat it as a hint, so check the files you receive.',
    ],
    writing: [
      'Name the files when that is clearer than the default: "Choose a photo", "Attach drawings".',
      'Put the allowed types and sizes in the form field’s constraint text, not in the button.',
    ],
  },
  accessibility: [
    'The native file input underneath takes focus and opens the file chooser with Enter or Space. The visible button is hidden from assistive technology and left out of the tab order.',
    'The input is named by the button text and, inside a FormField, by the field label, and described by its description and constraint text.',
    'The native input is kept holding the same files as value, so screen readers announce the chosen files and a surrounding form submits them.',
    <>
      Give an icon-only input an <code>ariaLabel</code>.
    </>,
  ],
  related: ['file-upload', 'file-token-group', 'file-dropzone', 'button'],
};

export default doc;
