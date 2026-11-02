// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Divider from '~components/divider';
import ExpandableSection from '~components/expandable-section';
import Header from '~components/header';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import TextContent from '~components/text-content';
import TruncatedText from '~components/truncated-text';

import { stayOnPage } from './samples';
import { Cell, Group } from './specimen';

function ExpandableSectionSpecimen() {
  const [expanded, setExpanded] = useState(true);
  return (
    <ExpandableSection
      variant="container"
      headingTagOverride="h4"
      headerText="What a full service covers"
      headerCounter="(6)"
      expanded={expanded}
      onChange={event => setExpanded(event.detail.expanded)}
    >
      Gears indexed, brakes bled, wheels trued, bearings checked, chain measured and the whole bike cleaned.
    </ExpandableSection>
  );
}

export default function ContentGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Content">
      <Cell name="Box">
        <SpaceBetween size="xxs">
          <Box variant="key-label">Ticket</Box>
          <Box variant="value-large">2041</Box>
          <Box color="text-body-secondary">
            Town bike, rear brake. Image <Box variant="code">web:v2</Box> is unrelated.
          </Box>
        </SpaceBetween>
      </Cell>
      <Cell name="Divider">
        <SpaceBetween size="s">
          <Box>Drawings issued for tender</Box>
          <Divider />
          <Box>Drawings for construction</Box>
          <Divider>Revision △2</Divider>
          <Box>As built</Box>
        </SpaceBetween>
      </Cell>
      <Cell name="ExpandableSection">
        <ExpandableSectionSpecimen />
      </Cell>
      <Cell name="Header">
        <Header
          variant="h2"
          headingTagOverride="h4"
          counter="(7)"
          description="North Annex, production"
          actions={<Button>Restart</Button>}
        >
          Services
        </Header>
      </Cell>
      <Cell name="KeyValuePairs">
        <KeyValuePairs
          columns={2}
          items={[
            { label: 'Service', value: 'atrium-api' },
            { label: 'Status', value: <StatusIndicator state="complete">Running</StatusIndicator> },
            { label: 'Image', value: <Box variant="code">api:v7</Box> },
            { label: 'Nodes', value: '6 of 8' },
          ]}
        />
      </Cell>
      <Cell name="TextContent">
        <TextContent>
          <h4>Bringing your bike in</h4>
          <p>
            Drop it off before ten and most repairs are ready the same day.{' '}
            <Link href="#prices" onFollow={stayOnPage}>
              See the prices
            </Link>
            .
          </p>
          <ul>
            <li>Punctures from £12</li>
            <li>Full service £75</li>
          </ul>
        </TextContent>
      </Cell>
      <Cell name="TruncatedText">
        <Box>
          <TruncatedText lines={2}>
            Hut No. 3 sits on a north-facing slope above the river, with a single room under a steep larch roof, a stove
            at one end and a long window that looks down the valley toward the old mill and the bridge.
          </TruncatedText>
        </Box>
      </Cell>
    </Group>
  );
}
