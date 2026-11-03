// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import Grid from '@ordinate/components/grid';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope, { StyleScopeProps } from '@ordinate/components/style-scope';

const revisions: StyleScopeProps.Revision[] = ['2026.1', '2026.2'];

export default function Revision() {
  return (
    <Grid gridDefinition={revisions.map(() => ({ colspan: { default: 12, xxs: 6 } }))}>
      {revisions.map(revision => (
        <StyleScope key={revision} revision={revision}>
          <Container heading={`Revision ${revision}`} kind="configuration" reference="C1">
            <SpaceBetween size="s">
              <Box variant="p">The same container and buttons, pinned to one revision.</Box>
              <SpaceBetween direction="horizontal" size="xs">
                <Button>Cancel</Button>
                <Button variant="primary">Save</Button>
              </SpaceBetween>
            </SpaceBetween>
          </Container>
        </StyleScope>
      ))}
    </Grid>
  );
}
