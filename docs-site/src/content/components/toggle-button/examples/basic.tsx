// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';
import ToggleButton from '@ordinate/components/toggle-button';

export default function Basic() {
  const [following, setFollowing] = useState(false);

  return (
    <SpaceBetween size="m" alignItems="center">
      <ToggleButton iconName="notification" pressed={following} onChange={event => setFollowing(event.detail.pressed)}>
        Follow north-annex
      </ToggleButton>
      <Box color="text-body-secondary" fontSize="body-s">
        {following ? 'You get a message when a deployment finishes.' : 'You get no messages about this project.'}
      </Box>
    </SpaceBetween>
  );
}
