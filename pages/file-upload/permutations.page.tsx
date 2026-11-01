// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import FileUpload, { FileUploadProps } from '~components/file-upload';
import FormField from '~components/form-field';

import { calculations, elevation, section, sitePlan, survey } from './sample-files';

import styles from './styles.module.scss';

const maxSize = 10_000_000;

function Controlled(props: Omit<FileUploadProps, 'value' | 'onChange'> & { initial?: ReadonlyArray<File> }) {
  const { initial = [], ...rest } = props;
  const [value, setValue] = useState(initial);
  return <FileUpload {...rest} value={value} onChange={event => setValue(event.detail.value)} />;
}

function Validated() {
  const [value, setValue] = useState<ReadonlyArray<File>>([sitePlan, survey, elevation]);
  const fileErrors = value.map(file => (file.size > maxSize ? 'Larger than 10 MB. Compress it or split it.' : null));
  const fileWarnings = value.map(file =>
    file.type === 'image/svg+xml' ? 'Vector images are converted to PDF on upload.' : null
  );
  const tooLarge = fileErrors.filter(Boolean).length;
  return (
    <FormField
      label="Drawing set"
      description="The signed set for the north annex."
      errorText={tooLarge > 0 ? `${tooLarge} of ${value.length} files cannot be uploaded.` : undefined}
    >
      <FileUpload
        value={value}
        onChange={event => setValue(event.detail.value)}
        multiple={true}
        accept=".pdf,.dwg,.svg,.png"
        showFileSize={true}
        showFileLastModified={true}
        showFileThumbnail={true}
        fileErrors={fileErrors}
        fileWarnings={fileWarnings}
        constraintText="PDF, DWG, SVG or PNG, up to 10 MB each."
      />
    </FormField>
  );
}

export default function FileUploadPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">File upload</Box>
      <Box variant="p" color="text-body-secondary">
        Drag files from the desktop over the page to see the drop zone.
      </Box>

      <div className={styles.columns}>
        <section className={styles.section}>
          <Box variant="h2">Single file</Box>
          <FormField label="Site plan">
            <Controlled accept=".pdf" constraintText="PDF only." showFileSize={true} />
          </FormField>
        </section>

        <section className={styles.section}>
          <Box variant="h2">Single file, chosen</Box>
          <FormField label="Site plan">
            <Controlled initial={[sitePlan]} showFileSize={true} showFileLastModified={true} />
          </FormField>
        </section>
      </div>

      <section className={styles.section}>
        <Box variant="h2">Multiple, with thumbnails and a limit of three</Box>
        <FormField label="Drawings">
          <Controlled
            initial={[sitePlan, elevation, section, survey, calculations]}
            multiple={true}
            showFileSize={true}
            showFileLastModified={true}
            showFileThumbnail={true}
            tokenLimit={3}
          />
        </FormField>
      </section>

      <section className={styles.section}>
        <Box variant="h2">Errors and warnings per file</Box>
        <Validated />
      </section>

      <div className={styles.columns}>
        <section className={styles.section}>
          <Box variant="h2">Own error and constraint</Box>
          <Controlled
            ariaLabel="Survey"
            multiple={true}
            errorText="Add at least one survey."
            constraintText="DWG or DXF."
          />
        </section>

        <section className={styles.section}>
          <Box variant="h2">Own warning</Box>
          <Controlled
            ariaLabel="Calculations"
            initial={[calculations]}
            warningText="This revision is older than the drawings."
            showFileSize={true}
          />
        </section>
      </div>
    </div>
  );
}
