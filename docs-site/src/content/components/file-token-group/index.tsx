// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'FileTokenGroup',
  folder: 'file-token-group',
  group: 'dates-and-files',
  summary: 'Lists files as tokens with their size and date, a problem for each, and a button to remove them.',
  description: (
    <>
      <p>
        Each file is a token in a hairline box: its name, cut short with an ellipsis when it does not fit, and below it
        the size and the last-changed date in mono. A file can carry a spinner while it uploads, a small preview for
        images, and an error or a warning under the token. An error also gives the token the error edge.
      </p>
      <p>
        The group shows files but does not keep them. Pass the list in <code>items</code> and remove a file in{' '}
        <code>onDismiss</code>; without that handler the tokens have no remove button.
      </p>
    </>
  ),
  examples: [
    {
      id: 'basic',
      title: 'Files with details',
      description: (
        <p>
          <code>showFileSize</code> and <code>showFileLastModified</code> add the size, in steps of 1000, and the date
          in the page’s locale.
        </p>
      ),
    },
    {
      id: 'upload-status',
      title: 'Uploading, errors and warnings',
      description: (
        <p>
          Set <code>loading</code> while a file uploads, <code>errorText</code> when it failed and{' '}
          <code>warningText</code> for something the user should know. A warning is not shown while the file has an
          error.
        </p>
      ),
    },
    {
      id: 'limit',
      title: 'Long lists',
      description: (
        <p>
          <code>limit</code> shows the first few files and a button that shows the rest. <code>alignment</code> wraps
          the tokens in rows, or stacks them one per line.
        </p>
      ),
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: (
        <p>
          A read-only group lists files that are part of a value the user cannot change here, such as the attachments of
          a submitted request.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'Beside a FileInput or FileDropzone, to show the files the user chose.',
      'To show the progress and result of each upload once the user submits.',
    ],
    avoid: [
      <>
        For tags, filters or other values that are not files. Use a <a href="#/components/token-group">TokenGroup</a>.
      </>,
      <>
        Building your own upload field from a FileInput and this group when FileUpload does the job. Use a{' '}
        <a href="#/components/file-upload">FileUpload</a>.
      </>,
    ],
    writing: [
      'Write an error as what went wrong and what to do: "Upload failed. Check the connection and try again."',
      'Keep warnings for things the user may want to act on, such as a file being converted.',
    ],
  },
  accessibility: [
    <>
      The files are a list, named with <code>ariaLabel</code>. While a file uploads, its item is marked{' '}
      <code>aria-busy</code>.
    </>,
    'Each remove button is named “Remove file 2, site-plan.pdf”, with the position and the file name.',
    'Removing a file moves focus to the next remove button, or the previous one when the last file went, so focus is not lost with the token.',
    <>
      The show-more button has <code>aria-expanded</code> and points at the list with <code>aria-controls</code>.
    </>,
    'File names and sizes keep their own reading direction, so a Latin file name is not reordered in a right-to-left page.',
  ],
  related: ['file-upload', 'file-input', 'token-group', 'token'],
};

export default doc;
