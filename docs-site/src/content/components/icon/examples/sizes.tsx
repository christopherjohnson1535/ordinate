// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Icon, { IconProps } from '@ordinate/components/icon';
import SpaceBetween from '@ordinate/components/space-between';

const sizes: IconProps.Size[] = ['small', 'normal', 'medium', 'big', 'large'];

export default function Sizes() {
  return (
    <SpaceBetween size="l">
      <SpaceBetween direction="horizontal" size="l" alignItems="end">
        {sizes.map(size => (
          <SpaceBetween key={size} size="xs" alignItems="center">
            <Icon name="map" size={size} />
            <Box variant="small" color="text-body-secondary">
              {size}
            </Box>
          </SpaceBetween>
        ))}
      </SpaceBetween>
      <Box variant="h2">
        <Icon name="map" size="inherit" /> Site plans
      </Box>
    </SpaceBetween>
  );
}
