// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import ProgressBar from '~components/progress-bar';

import styles from './styles.module.scss';

export default function ProgressBarSimple() {
  const [value, setValue] = useState(35);

  return (
    <article className={styles.page}>
      <h1>Progress bar</h1>

      <section className={styles.section}>
        <h2>In progress</h2>
        <div className={styles.row}>
          <Button formAction="none" onClick={() => setValue(current => Math.min(100, current + 15))}>
            Advance
          </Button>
          <Button formAction="none" onClick={() => setValue(0)}>
            Reset
          </Button>
        </div>
        <ProgressBar
          value={value}
          label="Uploading north-annex.tar"
          description="Backup of 12 nodes, 4.2 GB"
          additionalInfo="About 2 minutes left"
        />
        <ProgressBar value={0} label="Waiting to start" />
        <ProgressBar value={100} label="Finishing up" />
        <ProgressBar value={62} ariaLabel="Copying files" />
      </section>

      <section className={styles.section}>
        <h2>Results</h2>
        <ProgressBar status="success" label="Upload" resultText="Uploaded 4.2 GB in 3 minutes" />
        <ProgressBar
          status="error"
          label="Upload"
          description="north-annex.tar"
          resultText="The connection was lost at 64%"
          resultButtonText="Retry"
          additionalInfo="Your file is kept for 24 hours."
        />
      </section>

      <section className={styles.section}>
        <h2>Key-value variant</h2>
        <div className={styles.grid}>
          <ProgressBar variant="key-value" value={72} label="Disk used" additionalInfo="144 of 200 GB" />
          <ProgressBar variant="key-value" status="success" label="Health check" resultText="Passed" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Flash variant</h2>
        <ProgressBar variant="flash" value={48} label="Creating snapshot" description="vol-0a4e" />
      </section>

      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={styles.narrow}>
          <ProgressBar
            value={88}
            label="Rebuilding the search index for every project in the north-annex organisation"
            additionalInfo="Indexing documents written since the last full rebuild"
          />
        </div>
      </section>
    </article>
  );
}
