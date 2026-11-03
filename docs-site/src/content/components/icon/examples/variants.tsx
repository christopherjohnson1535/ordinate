// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Icon, { IconProps } from '@ordinate/components/icon';
import SpaceBetween from '@ordinate/components/space-between';

const variants: Array<{ variant: IconProps.Variant; name: IconProps.Name }> = [
  { variant: 'normal', name: 'note' },
  { variant: 'subtle', name: 'note' },
  { variant: 'disabled', name: 'note' },
  { variant: 'success', name: 'complete' },
  { variant: 'info', name: 'note' },
  { variant: 'warning', name: 'caution' },
  { variant: 'error', name: 'fault' },
  { variant: 'link', name: 'open-outside' },
];

export default function Variants() {
  return (
    <SpaceBetween direction="horizontal" size="l">
      {variants.map(({ variant, name }) => (
        <SpaceBetween key={variant} size="xs" alignItems="center">
          <Icon name={name} variant={variant} size="medium" />
          <Box variant="small" color="text-body-secondary">
            {variant}
          </Box>
        </SpaceBetween>
      ))}
    </SpaceBetween>
  );
}
