// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import FileInput, { FileInputProps } from '~components/file-input';
import FormField from '~components/form-field';

import styles from '../file-upload/styles.module.scss';

function Controlled(props: Omit<FileInputProps, 'value' | 'onChange'>) {
  const [value, setValue] = useState<ReadonlyArray<File>>([]);
  return (
    <div className={styles.section}>
      <FileInput {...props} value={value} onChange={event => setValue(event.detail.value)} />
      <p className={styles.log}>{value.length > 0 ? value.map(file => file.name).join(', ') : 'No files chosen'}</p>
    </div>
  );
}

export default function FileInputPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">File input</Box>

      <div className={styles.columns}>
        <section className={styles.section}>
          <Box variant="h2">Single file</Box>
          <Controlled />
        </section>

        <section className={styles.section}>
          <Box variant="h2">Multiple files</Box>
          <Controlled multiple={true} />
        </section>

        <section className={styles.section}>
          <Box variant="h2">Custom text, images only</Box>
          <Controlled accept="image/*">Attach a photo</Controlled>
        </section>

        <section className={styles.section}>
          <Box variant="h2">Icon</Box>
          <Controlled variant="icon" ariaLabel="Attach drawings" multiple={true} />
        </section>

        <section className={styles.section}>
          <Box variant="h2">Disabled</Box>
          <Controlled disabled={true} />
        </section>

        <section className={styles.section}>
          <Box variant="h2">Disabled icon</Box>
          <Controlled variant="icon" ariaLabel="Attach drawings" disabled={true} />
        </section>

        <section className={styles.section}>
          <Box variant="h2">Invalid</Box>
          <FormField label="Site plan" errorText="Choose the signed site plan.">
            <Controlled />
          </FormField>
        </section>

        <section className={styles.section}>
          <Box variant="h2">Warning</Box>
          <FormField label="Survey" warningText="The survey is more than a year old.">
            <Controlled />
          </FormField>
        </section>
      </div>
    </div>
  );
}
