// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Icon from '@ordinate/components/icon';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';

export default function Basic() {
  return (
    <SpaceBetween size="s">
      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
        <Icon name="calendar" />
        <Box>Inspection on 20 November 2026</Box>
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
        <Icon name="location-pin" />
        <Box>North annex, us-mountain-1</Box>
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
        <Icon name="person" />
        <Box>Dana Ruiz</Box>
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
        <Icon name="file" />
        <Link href="#/foundations/icons">Every icon, by name</Link>
      </SpaceBetween>
    </SpaceBetween>
  );
}
