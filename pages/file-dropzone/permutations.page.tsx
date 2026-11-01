// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import FileDropzone from '~components/file-dropzone';
import Icon from '~components/icon';

import styles from '../file-upload/styles.module.scss';

export default function FileDropzonePermutations() {
  const [dropped, setDropped] = useState<File[]>([]);

  return (
    <div className={styles.page}>
      <Box variant="h1">File dropzone</Box>
      <Box variant="p" color="text-body-secondary">
        Drag files from the desktop: every zone is outlined while files are over the page, and the one under the pointer
        is filled.
      </Box>

      <section className={styles.section}>
        <Box variant="h2">With an icon</Box>
        <FileDropzone onChange={event => setDropped(event.detail.value)}>
          <Icon name="upload" size="medium" />
          <span>Drop files to upload</span>
        </FileDropzone>
        <p className={styles.log}>
          {dropped.length > 0 ? `Dropped: ${dropped.map(file => file.name).join(', ')}` : 'Nothing dropped yet'}
        </p>
      </section>

      <div className={styles.columns}>
        <section className={styles.section}>
          <Box variant="h2">Text only</Box>
          <FileDropzone onChange={event => setDropped(event.detail.value)}>Drop the site plan here</FileDropzone>
        </section>

        <section className={styles.section}>
          <Box variant="h2">Two lines</Box>
          <FileDropzone onChange={event => setDropped(event.detail.value)}>
            <strong>Drop drawings</strong>
            <Box variant="small" color="text-body-secondary">
              PDF or DWG, up to 10 MB each
            </Box>
          </FileDropzone>
        </section>
      </div>
    </div>
  );
}
