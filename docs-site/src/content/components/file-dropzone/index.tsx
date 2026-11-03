// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'FileDropzone',
  folder: 'file-dropzone',
  group: 'dates-and-files',
  summary: 'Marks an area of the page where the user can drop files dragged from their desktop.',
  description: (
    <>
      <p>
        A dropzone is an area left open on the drawing for something to be placed: a faint dashed construction line
        inside crop marks at its four corners. While files are dragged anywhere over the page, the line is inked in to
        show where they can go. Over the zone itself the line closes and the area takes a raised tint.
      </p>
      <p>
        The zone holds whatever you put in it, usually an icon and a short instruction. It passes on every dropped file,
        whatever its type, so check the files you receive. Dropping needs a pointer, so put a{' '}
        <a href="#/components/file-input">FileInput</a> in or beside the zone as well.
      </p>
    </>
  ),
  marks: ['M5', 'M1'],
  examples: [
    {
      id: 'basic',
      title: 'Drop area with a button',
      description: (
        <p>
          The zone with an instruction and a FileInput, so the same files can be chosen from the keyboard. Drag a file
          from your desktop over the page to see the line ink in.
        </p>
      ),
    },
    {
      id: 'checking-files',
      title: 'Checking dropped files',
      description: (
        <p>The zone passes on every file, so filter them yourself and say which ones you left out and why.</p>
      ),
    },
  ],
  guidelines: {
    use: [
      'When dropping files is a main task of the page, such as importing a drawing set or a batch of photos.',
      'With a FileInput inside or beside it, so the zone is never the only way to add files.',
    ],
    avoid: [
      <>
        For attaching files to a form. Use a <a href="#/components/file-upload">FileUpload</a>, which shows a drop area
        on its own while files are dragged over the page.
      </>,
      'Several dropzones on one page that take the same files.',
    ],
    writing: [
      'Say what to drop and what happens: "Drop drawings here to import them."',
      'Put the allowed types and sizes on a second line in secondary text.',
    ],
  },
  accessibility: [
    'The zone is not focusable and cannot be used from the keyboard or by most assistive technology. Always offer a FileInput for the same files.',
    'The crop marks and the dashed line are drawn for sighted users only; the instruction you put inside is the part that is read.',
    'Tell the user what happened after a drop, in text on the page, since the zone itself does not change once the files land.',
  ],
  related: ['file-upload', 'file-input', 'file-token-group'],
};

export default doc;
