// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import CodeView, { CodeViewProps } from '~components/code-view';
import SegmentedControl from '~components/segmented-control';

import styles from '../drawings.module.scss';

type Language = Exclude<CodeViewProps.Language, 'text'>;

const samples: Record<Language, string> = {
  yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 5 # one per zone, plus two
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
        - name: web
          image: ghcr.io/stefanprodan/podinfo:6.7.0
          ports:
            - containerPort: 9898
`,
  typescript: `interface Instance {
  id: string;
  zone: 'eu-west-1a' | 'eu-west-1b';
  running: boolean;
}

export function countRunning(instances: ReadonlyArray<Instance>): number {
  return instances.filter(instance => instance.running).length;
}
`,
  javascript: `export async function withRetry(request, attempts = 3) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await request();
    } catch {
      await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 100));
    }
  }
  throw new Error('Request failed after ' + attempts + ' attempts');
}
`,
  json: `{
  "name": "web",
  "replicas": 5,
  "public": true,
  "zones": ["eu-west-1a", "eu-west-1b"]
}
`,
  python: `def percentile(values, p):
    """The p-th percentile, by nearest rank."""
    ordered = sorted(values)
    rank = max(0, round(p / 100 * len(ordered)) - 1)
    return ordered[rank]
`,
  css: `.sheet {
  border: 2px solid var(--ink);
  padding: 24px;
}
`,
  html: `<figure class="plate">
  <img src="quay.jpg" alt="The east quay">
  <figcaption>Fig. 1</figcaption>
</figure>
`,
  markdown: `# Runbook

1. Drain the node with **kubectl drain**.
2. Check the [dashboard](https://example.com).
`,
};

export default function CodeViewPermutations() {
  const [language, setLanguage] = useState<Language>('yaml');
  return (
    <article className={styles.page}>
      <h1>Code view</h1>
      <section className={styles.section}>
        <h2>Languages</h2>
        <SegmentedControl
          label="Language"
          selectedId={language}
          onChange={event => setLanguage(event.detail.selectedId as Language)}
          options={Object.keys(samples).map(id => ({ id, text: id }))}
        />
        <div className={styles.frame}>
          <CodeView content={samples[language]} language={language} ariaLabel={`Sample in ${language}`} />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Highlighted lines and a note on a changed value</h2>
        <div className={styles.frame}>
          <CodeView
            content={samples.yaml}
            language="yaml"
            ariaLabel="deployment.yaml"
            highlightedLines={[5, 6]}
            lineNotes={[{ line: 6, text: 'was 3' }]}
          />
        </div>
      </section>
      <div className={styles.row}>
        <section className={styles.section}>
          <h2>Without line numbers</h2>
          <div className={styles.frame}>
            <CodeView content={samples.json} language="json" lineNumbers={false} ariaLabel="Without line numbers" />
          </div>
        </section>
        <section className={styles.section}>
          <h2>Plain text</h2>
          <div className={styles.frame}>
            <CodeView content={'NAME   READY\nweb    5/5\n'} ariaLabel="Plain text" highlightedLines={[2]} />
          </div>
        </section>
      </div>
      <div className={styles.row}>
        <section className={`${styles.section} ${styles.narrow}`}>
          <h2>Narrow, scrolling</h2>
          <div className={styles.frame}>
            <CodeView content={samples.yaml} language="yaml" ariaLabel="Narrow, scrolling" />
          </div>
        </section>
        <section className={`${styles.section} ${styles.narrow}`}>
          <h2>Narrow, wrapping</h2>
          <div className={styles.frame}>
            <CodeView content={samples.yaml} language="yaml" wrapLines={true} ariaLabel="Narrow, wrapping" />
          </div>
        </section>
      </div>
    </article>
  );
}
