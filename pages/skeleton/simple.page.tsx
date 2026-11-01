// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import Skeleton, { SkeletonProps } from '~components/skeleton';

import styles from './styles.module.scss';

const widths: SkeletonProps.Width[] = ['full', 'large', 'medium', 'small'];
const heights: SkeletonProps.Height[] = ['small', 'medium', 'large'];

export default function SkeletonSimple() {
  const [loading, setLoading] = useState(true);

  return (
    <article className={styles.page}>
      <h1>Skeleton</h1>

      <section className={styles.section}>
        <h2>Text and heading</h2>
        <Skeleton variant="heading" width="medium" loadingText="" />
        <Skeleton lines={4} />
      </section>

      <section className={styles.section}>
        <h2>Widths</h2>
        {widths.map(width => (
          <Skeleton key={width} width={width} loadingText="" />
        ))}
      </section>

      <section className={styles.section}>
        <h2>Blocks</h2>
        <div className={styles.grid}>
          {heights.map(height => (
            <Skeleton key={height} variant="block" height={height} loadingText="" />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Loading a container</h2>
        <div className={styles.row}>
          <Button formAction="none" onClick={() => setLoading(current => !current)}>
            {loading ? 'Finish loading' : 'Load again'}
          </Button>
        </div>
        <Container header={<Header>Usage this month</Header>}>
          <Skeleton loading={loading} variant="block" height="medium" loadingText="Loading usage">
            <p className={styles.loaded}>
              north-annex used 4,120 instance hours and 2.4 TB of transfer, 12% more than last month.
            </p>
          </Skeleton>
        </Container>
      </section>
    </article>
  );
}
