// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '@ordinate/components/container';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import Measure from '@ordinate/components/measure';

const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 0 });

export default function KeyValue() {
  return (
    <Container heading="Storage" kind="resource">
      <KeyValuePairs
        columns={3}
        items={[
          { label: 'Disk', value: <Measure value={61} unit="GB" max={100} limit={90} limitLabel="alarm at 90 GB" /> },
          { label: 'Memory', value: <Measure value={0.37} max={1} format={value => percent.format(value)} /> },
          { label: 'Snapshots', value: <Measure value={12} description="kept for 30 days" /> },
        ]}
      />
    </Container>
  );
}
