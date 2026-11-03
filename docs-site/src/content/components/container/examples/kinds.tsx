// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Container from '@ordinate/components/container';
import SpaceBetween from '@ordinate/components/space-between';

export default function Kinds() {
  return (
    <SpaceBetween size="l">
      <Container
        kind="configuration"
        reference="C1"
        heading="Environment"
        description="Settings the services read at start."
        measure="4 settings"
      >
        <Box variant="p">LOG_LEVEL is info, REGION is us-mountain-1, and two feature flags are on.</Box>
      </Container>
      <Container
        kind="resource"
        reference="R2"
        heading="Volumes"
        description="Disks attached to the nodes."
        measure="4 volumes"
      >
        <Box variant="p">Two data volumes of 200 GB and two root volumes of 50 GB, all in zone 1a.</Box>
      </Container>
      <Container
        kind="policy"
        reference="P1"
        heading="Rollout policy"
        description="Rules for every deploy."
        measure="3 rules"
      >
        <Box variant="p">
          Deploy one zone at a time, wait ten minutes between zones, and stop on the first failed check.
        </Box>
      </Container>
      <Container kind="neutral" reference="N1" heading="Notes" measure="2 notes">
        <Box variant="p">
          The annex moves to the new load balancer in December. Ask Dana Ruiz before changing the DNS.
        </Box>
      </Container>
    </SpaceBetween>
  );
}
