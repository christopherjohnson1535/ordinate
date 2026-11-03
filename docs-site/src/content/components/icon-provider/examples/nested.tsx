// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Icon from '@ordinate/components/icon';
import IconProvider from '@ordinate/components/icon-provider';
import SpaceBetween from '@ordinate/components/space-between';

// A plumb bob for "location-pin", used across the surveying tool.
const plumbBob = (
  <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
    <path d="M8 1v4M5 5h6l-3 9.5z" />
  </svg>
);

// A theodolite on its tripod for "find", used only in the survey panel.
const theodolite = (
  <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
    <path d="M5 3.5h6v4H5zM11 5.5h2.5M8 7.5v2M8 9.5 4 15M8 9.5l4 5.5M8 9.5V15" />
  </svg>
);

function Row({ label }: { label: string }) {
  return (
    <SpaceBetween direction="horizontal" size="s" alignItems="center">
      <Icon name="location-pin" ariaLabel="Location" />
      <Icon name="find" ariaLabel="Find" />
      <Box color="text-body-secondary" fontSize="body-s">
        {label}
      </Box>
    </SpaceBetween>
  );
}

export default function Nested() {
  return (
    <IconProvider icons={{ 'location-pin': plumbBob }}>
      <SpaceBetween size="s">
        <Row label="Outer provider: the plumb bob replaces location-pin." />
        <IconProvider icons={{ find: theodolite }}>
          <Row label="Inner provider: keeps the plumb bob and adds the theodolite for find." />
        </IconProvider>
        <IconProvider icons={null}>
          <Row label="icons={null}: the built-in icons again." />
        </IconProvider>
      </SpaceBetween>
    </IconProvider>
  );
}
