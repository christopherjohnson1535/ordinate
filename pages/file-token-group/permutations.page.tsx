// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import FileTokenGroup, { FileTokenGroupProps } from '~components/file-token-group';

import { allFiles, archive, calculations, elevation, section, sitePlan, survey } from '../file-upload/sample-files';

import styles from '../file-upload/styles.module.scss';

function Dismissible(
  props: Omit<FileTokenGroupProps, 'items' | 'onDismiss'> & { initial: FileTokenGroupProps.Item[] }
) {
  const { initial, ...rest } = props;
  const [items, setItems] = useState(initial);
  return (
    <FileTokenGroup
      {...rest}
      items={items}
      onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.fileIndex))}
    />
  );
}

const files = allFiles.map(file => ({ file }));

export default function FileTokenGroupPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">File token group</Box>

      <section className={styles.section}>
        <Box variant="h2">Horizontal, with sizes</Box>
        <Dismissible initial={files} showFileSize={true} ariaLabel="Drawings" />
      </section>

      <section className={styles.section}>
        <Box variant="h2">Vertical, with thumbnails, sizes and dates</Box>
        <Dismissible
          initial={files}
          alignment="vertical"
          showFileSize={true}
          showFileLastModified={true}
          showFileThumbnail={true}
          ariaLabel="Drawings"
        />
      </section>

      <section className={styles.section}>
        <Box variant="h2">Loading, errors and warnings</Box>
        <Dismissible
          initial={[
            { file: sitePlan, loading: true },
            { file: survey, errorText: 'Larger than 10 MB. Compress it or split it.' },
            { file: elevation, warningText: 'Vector images are converted to PDF on upload.' },
            { file: section, loading: true },
          ]}
          alignment="vertical"
          showFileSize={true}
          showFileThumbnail={true}
          ariaLabel="Uploads"
        />
      </section>

      <section className={styles.section}>
        <Box variant="h2">Horizontal errors</Box>
        <Dismissible
          initial={[
            { file: archive, errorText: 'Archives are not accepted.' },
            { file: calculations, warningText: 'Older revision.' },
            { file: sitePlan },
          ]}
          showFileSize={true}
          ariaLabel="Attachments"
        />
      </section>

      <section className={styles.section}>
        <Box variant="h2">Limit of two</Box>
        <Dismissible initial={files} limit={2} alignment="vertical" showFileSize={true} ariaLabel="Drawings" />
      </section>

      <section className={styles.section}>
        <Box variant="h2">Read-only</Box>
        <FileTokenGroup
          items={files.slice(0, 3)}
          readOnly={true}
          onDismiss={() => {}}
          showFileSize={true}
          showFileThumbnail={true}
          ariaLabel="Submitted drawings"
        />
      </section>
    </div>
  );
}
