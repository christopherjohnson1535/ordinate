// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'FileUpload',
  folder: 'file-upload',
  group: 'dates-and-files',
  summary: 'Lets the user choose or drop files and see the list of files they chose, with a problem for each.',
  description: (
    <>
      <p>
        FileUpload puts the parts of this group together: a <a href="#/components/file-input">FileInput</a> button, the
        constraint text and messages under it, and the chosen files as a{' '}
        <a href="#/components/file-token-group">FileTokenGroup</a> stacked one per line. While files are dragged over
        the page, the button gives way to a <a href="#/components/file-dropzone">FileDropzone</a>, a dashed construction
        line inside crop marks, and dropped files are added the same way as chosen ones.
      </p>
      <p>
        FileUpload only collects files: sending them is up to you. The value is controlled, and the <code>accept</code>{' '}
        hint does not apply to dropped files, so check each file and report problems with <code>fileErrors</code> and{' '}
        <code>fileWarnings</code>, in the same order as <code>value</code>.
      </p>
    </>
  ),
  marks: ['M5'],
  examples: [
    {
      id: 'basic',
      title: 'One file',
      description: (
        <p>
          Without <code>multiple</code>, a new file replaces the one already chosen. Say which types and sizes you take
          in <code>constraintText</code>.
        </p>
      ),
    },
    {
      id: 'multiple',
      title: 'Several files',
      description: (
        <p>
          With <code>multiple</code>, chosen and dropped files are added after the ones already there. Each token has a
          remove button, and <code>tokenLimit</code> folds a long list behind a “+3 more” button.
        </p>
      ),
    },
    {
      id: 'validation',
      title: 'Problems with single files',
      description: (
        <p>
          Check each file as it arrives. An error marks the token as invalid and a warning only notes something; put a
          summary of the errors in the form field so it is read with the label.
        </p>
      ),
    },
    {
      id: 'thumbnails',
      title: 'Thumbnails',
      description: (
        <p>
          <code>showFileThumbnail</code> previews each image so the user can tell photos apart, and shows a file icon
          for everything else.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For attaching files to a form, such as drawings to a tender or photos to a defect report.',
      'When the user needs to see, and remove, the files they chose before they submit.',
    ],
    avoid: [
      <>
        For a single button in a toolbar that starts an upload straight away. Use a{' '}
        <a href="#/components/file-input">FileInput</a>.
      </>,
      <>
        For a large drop area as the main thing on a page. Use a <a href="#/components/file-dropzone">FileDropzone</a>{' '}
        with a FileInput inside it.
      </>,
      'Relying on accept to keep out the wrong files. It is only a hint to the browser’s file chooser.',
    ],
    writing: [
      'Say what you take in the constraint text, with the units: "PDF or DWG, up to 10 MB each."',
      'Write file errors as what is wrong and what to do: "Larger than 10 MB. Compress it or split it."',
      'Keep the default button text, "Choose file" or "Choose files", unless the files have a name, such as "Choose drawings".',
    ],
  },
  accessibility: [
    'The button is a native file input underneath, so it is reached with Tab, opens the file chooser with Enter or Space, and is named by the button text and the field label.',
    'The constraint text and the overall error or warning are tied to the input as its description.',
    'Removing a file moves focus to the next remove button, and removing the last file moves focus back to the button.',
    <>Dropping files needs a pointer. The button stays the way to add files from the keyboard, so do not hide it.</>,
    'Error and warning icons are named “Error” and “Warning”; replace them with i18nStrings when you translate the control.',
  ],
  related: ['file-input', 'file-token-group', 'file-dropzone', 'form-field'],
};

export default doc;
