// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Container from '~components/container';
import ErrorBoundary from '~components/error-boundary';
import Header from '~components/header';

import styles from './styles.module.scss';

function UsageChart({ broken }: { broken: boolean }) {
  if (broken) {
    throw new Error('Chart data is malformed');
  }
  return <p className={styles.chart}>4,120 instance hours this month.</p>;
}

export default function ErrorBoundarySimple() {
  const [broken, setBroken] = useState(false);
  const [resets, setResets] = useState(0);
  const [lastError, setLastError] = useState('');

  return (
    <article className={styles.page}>
      <h1>Error boundary</h1>

      <section className={styles.section}>
        <h2>Default fallback</h2>
        <div className={styles.row}>
          <Button formAction="none" onClick={() => setBroken(true)}>
            Break the chart
          </Button>
          <Button
            formAction="none"
            onClick={() => {
              setBroken(false);
              setResets(count => count + 1);
            }}
          >
            Reset
          </Button>
        </div>
        <Container header={<Header>Usage</Header>}>
          <ErrorBoundary
            key={resets}
            errorBoundaryId="usage-chart"
            feedbackHref="#feedback"
            onError={event => setLastError(`${event.detail.errorBoundaryId}: ${event.detail.error.message}`)}
          >
            <UsageChart broken={broken} />
          </ErrorBoundary>
        </Container>
        {lastError && <p className={styles.log}>onError received {lastError}</p>}
      </section>

      <section className={styles.section}>
        <h2>Without feedback link</h2>
        <ErrorBoundary>
          <UsageChart broken={true} />
        </ErrorBoundary>
      </section>

      <section className={styles.section}>
        <h2>Custom fallback</h2>
        <ErrorBoundary
          errorBoundaryId="billing"
          renderFallback={({ error, errorBoundaryId }) => (
            <p className={styles.custom}>
              The {errorBoundaryId} panel failed: {error.message}
            </p>
          )}
        >
          <UsageChart broken={true} />
        </ErrorBoundary>
      </section>
    </article>
  );
}
