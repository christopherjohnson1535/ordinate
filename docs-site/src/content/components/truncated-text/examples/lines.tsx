// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Container from '@ordinate/components/container';
import TruncatedText from '@ordinate/components/truncated-text';

const summary =
  'Nodes in this pool are replaced one zone at a time. Each replacement waits for the health check to pass ' +
  'before the next one starts, so a rollout across three zones takes about forty minutes. Traffic is drained ' +
  'from a node before it stops, and requests in flight get up to five minutes to finish.';

export default function Lines() {
  return (
    <ColumnLayout columns={2}>
      <Container heading="Rollout policy" description="Two lines">
        <TruncatedText lines={2}>{summary}</TruncatedText>
      </Container>
      <Container heading="Rollout policy" description="Three lines">
        <TruncatedText lines={3}>{summary}</TruncatedText>
      </Container>
    </ColumnLayout>
  );
}
