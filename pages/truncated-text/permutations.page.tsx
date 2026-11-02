// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Container from '~components/container';
import TruncatedText from '~components/truncated-text';

import styles from './styles.module.scss';

const path = 'arn:ord:storage:us-east-1:4021:bucket/archive/telemetry/2026/10/31/node-01.parquet';
const paragraph =
  'Nodes in this pool are replaced one zone at a time. Each replacement waits for the health check to pass ' +
  'before the next one starts, so a rollout across three zones takes about forty minutes. Traffic is drained ' +
  'from a node before it stops, and requests in flight are given up to five minutes to finish.';

export default function TruncatedTextPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">Truncated text</Box>

      <section className={styles.section}>
        <Box variant="h2">One line</Box>
        <div className={styles.narrow}>
          <TruncatedText>{path}</TruncatedText>
        </div>
        <div className={styles.narrow}>
          <TruncatedText>Fits on one line.</TruncatedText>
        </div>
      </section>

      <section className={styles.section}>
        <Box variant="h2">Two and three lines</Box>
        <div className={styles.narrow}>
          <TruncatedText lines={2}>{paragraph}</TruncatedText>
        </div>
        <div className={styles.narrow}>
          <TruncatedText lines={3}>{paragraph}</TruncatedText>
        </div>
      </section>

      <section className={styles.section}>
        <Box variant="h2">In a row with other content</Box>
        <div className={styles.row}>
          <strong>Source</strong>
          <TruncatedText>{path}</TruncatedText>
          <span>4.2 GiB</span>
        </div>
      </section>

      <section className={styles.section}>
        <Box variant="h2">Resizable</Box>
        <div className={styles.resizable}>
          <Container heading="Drag the corner to resize">
            <TruncatedText lines={2}>{paragraph}</TruncatedText>
          </Container>
        </div>
      </section>
    </div>
  );
}
