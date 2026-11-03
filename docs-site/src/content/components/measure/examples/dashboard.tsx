// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Container from '@ordinate/components/container';
import Measure from '@ordinate/components/measure';

export default function Dashboard() {
  return (
    <Container heading="north-annex at a glance" kind="resource">
      <ColumnLayout columns={4} borders="vertical" variant="text-grid">
        <Measure label="Nodes in service" value={20} max={32} unit="nodes" description="2 starting" />
        <Measure label="Requests per minute" value={4210} description="last 24 hours" />
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
  );
}
