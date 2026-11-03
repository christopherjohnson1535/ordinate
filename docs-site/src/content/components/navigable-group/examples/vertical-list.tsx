// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Link from '@ordinate/components/link';
import NavigableGroup from '@ordinate/components/navigable-group';
import SpaceBetween from '@ordinate/components/space-between';

const plates = ['Plate I: Elevation', 'Plate II: Section', 'Plate III: Details', 'Plate IV: Site plan'];

export default function VerticalList() {
  const [opened, setOpened] = useState('No plate opened yet.');

  return (
    <SpaceBetween size="m">
      <NavigableGroup
        navigationDirection="vertical"
        ariaLabel="Plates of the reading room set"
        getItemKey={element => element.textContent ?? ''}
      >
        <SpaceBetween size="xxs">
          {plates.map(plate => (
            <Link
              key={plate}
              href="#/components/navigable-group"
              onFollow={event => {
                event.preventDefault();
                setOpened(`Opened ${plate}.`);
              }}
            >
              {plate}
            </Link>
          ))}
        </SpaceBetween>
      </NavigableGroup>
      <Box color="text-body-secondary" fontSize="body-s">
        {opened} Up and Down stop at the first and last plate.
      </Box>
    </SpaceBetween>
  );
}
