// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BreadcrumbGroup from '@ordinate/components/breadcrumb-group';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import ContentLayout from '@ordinate/components/content-layout';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function Page() {
  const [running, setRunning] = useState(true);

  return (
    <ContentLayout
      defaultPadding={true}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'North Annex', href: 'https://example.com/north-annex' },
            { text: 'Nodes', href: 'https://example.com/north-annex/nodes' },
            { text: 'na-14', href: 'https://example.com/north-annex/nodes/na-14' },
          ]}
          onFollow={event => event.preventDefault()}
        />
      }
      header={
        <Header
          variant="h1"
          description="A general purpose node in zone us-mountain-1a."
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setRunning(!running)}>{running ? 'Stop' : 'Start'}</Button>
              <Button variant="primary">Connect</Button>
            </SpaceBetween>
          }
        >
          na-14
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Container heading="Details" kind="resource" reference="R1">
          {running ? (
            <StatusIndicator state="complete">Running since 31 October 2026</StatusIndicator>
          ) : (
            <StatusIndicator state="halted">Stopped</StatusIndicator>
          )}
        </Container>
        <Container heading="Storage" kind="resource" reference="R2">
          One 50 GB root volume and one 200 GB data volume.
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
}
