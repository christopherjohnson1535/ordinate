// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import KeyValuePairs from '~components/key-value-pairs';
import Measure from '~components/measure';

import styles from './styles.module.scss';

const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 2 });

export default function MeasurePermutations() {
  return (
    <article className={styles.page}>
      <h1>Measure permutations</h1>

      <section className={styles.section}>
        <h2>In a column layout</h2>
        <Container>
          <ColumnLayout columns={4} borders="vertical" variant="text-grid">
            <Measure label="Nodes in service" value={20} max={32} unit="nodes" description="2 starting" />
            <Measure label="Requests per minute" value={4210} description="last 24 h" />
            <Measure
              label="Slowest 5% of requests"
              value={182}
              unit="ms"
              max={250}
              limit={200}
              limitLabel="target 200 ms"
            />
            <Measure label="Uptime" value="99.98%" current={99.98} max={100} description="last 30 days" />
          </ColumnLayout>
        </Container>
      </section>

      <section className={styles.section}>
        <h2>In key-value pairs</h2>
        <Container heading="Storage">
          <KeyValuePairs
            columns={3}
            items={[
              {
                label: 'Disk',
                value: <Measure value={61} unit="GB" max={100} limit={90} limitLabel="alarm at 90 GB" />,
              },
              { label: 'Memory', value: <Measure value={0.37} max={1} format={value => percent.format(value)} /> },
              { label: 'Snapshots', value: <Measure value={12} description="kept for 30 days" /> },
            ]}
          />
        </Container>
      </section>

      <section className={styles.section}>
        <h2>Edges of the scale</h2>
        <div className={styles.grid}>
          <Measure label="Empty" value={0} max={8} unit="workers" />
          <Measure label="Full" value={8} max={8} unit="workers" limit={8} limitLabel="hard limit" />
          <Measure label="Over the scale" value={40} max={32} unit="nodes" />
          <Measure label="Limit near zero" value={3} max={1000} limit={20} />
          <Measure label="Large scale" value={1_250_000} max={2_000_000} unit="requests" />
          <Measure label="Fractions" value={0.62} max={1} unit="load" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={styles.narrow}>
          <Measure
            label="Slowest 5% of requests over the last hour"
            value={182}
            unit="milliseconds"
            max={250}
            limit={200}
            limitLabel="target 200 milliseconds for the slowest requests"
            description="Measured at the load balancer."
          />
        </div>
      </section>
    </article>
  );
}
