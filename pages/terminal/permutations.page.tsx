// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Terminal, { TerminalProps } from '~components/terminal';

import styles from '../drawings.module.scss';

const rollout: TerminalProps.Line[] = [
  { text: '$ kubectl set image deployment/web web=ghcr.io/stefanprodan/podinfo:6.7.0', type: 'command' },
  { text: 'deployment.apps/web image updated' },
  { text: '$ kubectl get pods', type: 'command' },
  { text: 'NAME                   READY   STATUS              RESTARTS   AGE', type: 'header' },
  { text: 'web-6b7c9d-2xk4p       1/1     Running             0          4m' },
  { text: 'web-6b7c9d-7fqzn       1/1     Terminating         0          4m', highlighted: true },
  { text: 'web-84f5c7-9wq2l       0/1     ContainerCreating   0          2s', highlighted: true },
  { text: '' },
  { text: 'Rollouts replace one Pod at a time, so the service keeps answering.', type: 'muted' },
];

const check: TerminalProps.Line[] = [
  { text: '$ ./check.sh', type: 'command' },
  { text: 'PASS  the deployment has five ready replicas', type: 'success' },
  { text: 'PASS  every Pod runs podinfo 6.7.0', type: 'success' },
  { text: 'FAIL  the service sends traffic to port 9999, but the container listens on 9898', type: 'error' },
  { text: '2 of 3 checks passed.', type: 'muted' },
];

export default function TerminalPermutations() {
  return (
    <article className={styles.page}>
      <h1>Terminal</h1>
      <section className={styles.section}>
        <h2>Commands, a table, highlighted new output and a note</h2>
        <Terminal lines={rollout} ariaLabel="Rollout output" />
      </section>
      <section className={styles.section}>
        <h2>Results</h2>
        <Terminal lines={check} ariaLabel="Check output" />
      </section>
      <div className={styles.row}>
        <section className={`${styles.section} ${styles.narrow}`}>
          <h2>Narrow, wrapping (tables never wrap)</h2>
          <Terminal lines={rollout} ariaLabel="Narrow, wrapping" />
        </section>
        <section className={`${styles.section} ${styles.narrow}`}>
          <h2>Narrow, scrolling</h2>
          <Terminal lines={rollout} wrapLines={false} ariaLabel="Narrow, scrolling" />
        </section>
      </div>
    </article>
  );
}
