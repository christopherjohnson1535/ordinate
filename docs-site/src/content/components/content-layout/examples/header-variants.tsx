// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Container from '@ordinate/components/container';
import ContentLayout, { ContentLayoutProps } from '@ordinate/components/content-layout';
import Flashbar from '@ordinate/components/flashbar';
import Header from '@ordinate/components/header';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

export default function HeaderVariants() {
  const [variant, setVariant] = useState<ContentLayoutProps.HeaderVariant>('high-contrast');

  return (
    <SpaceBetween size="l">
      <Box padding={{ horizontal: 'l', top: 'l' }}>
        <SegmentedControl
          label="Header variant"
          selectedId={variant}
          onChange={event => setVariant(event.detail.selectedId as ContentLayoutProps.HeaderVariant)}
          options={[
            { id: 'default', text: 'Default' },
            { id: 'high-contrast', text: 'High contrast' },
            { id: 'divider', text: 'Divider' },
          ]}
        />
      </Box>
      <ContentLayout
        defaultPadding={true}
        headerVariant={variant}
        notifications={
          <Flashbar items={[{ type: 'note', content: 'Hut No. 3 is out to tender until 14 November.' }]} />
        }
        header={
          <Header variant="h1" description="Small homes and huts in the Borders">
            Harbour &amp; Pine
          </Header>
        }
      >
        <Container heading="Current projects">Four huts, one boathouse and a studio extension in Peebles.</Container>
      </ContentLayout>
    </SpaceBetween>
  );
}
