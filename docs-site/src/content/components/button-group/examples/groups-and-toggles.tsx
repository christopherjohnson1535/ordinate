// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ButtonGroup, { ButtonGroupProps } from '@ordinate/components/button-group';
import SpaceBetween from '@ordinate/components/space-between';

export default function GroupsAndToggles() {
  const [zoom, setZoom] = useState(100);
  const [grid, setGrid] = useState(true);
  const [locked, setLocked] = useState(false);

  const items: ButtonGroupProps.ItemOrGroup[] = [
    {
      type: 'group',
      text: 'Zoom',
      items: [
        { type: 'icon-button', id: 'zoom-out', text: 'Zoom out', iconName: 'zoom-out', disabled: zoom <= 25 },
        { type: 'icon-button', id: 'zoom-fit', text: 'Fit to sheet', iconName: 'zoom-fit' },
        { type: 'icon-button', id: 'zoom-in', text: 'Zoom in', iconName: 'zoom-in', disabled: zoom >= 400 },
      ],
    },
    {
      type: 'group',
      text: 'View',
      items: [
        { type: 'icon-toggle-button', id: 'grid', text: 'Show grid', iconName: 'grid-view', pressed: grid },
        {
          type: 'icon-toggle-button',
          id: 'lock',
          text: 'Lock the drawing',
          iconName: 'unlocked',
          pressedIconName: 'locked',
          pressed: locked,
        },
      ],
    },
  ];

  return (
    <SpaceBetween size="m" alignItems="center">
      <ButtonGroup
        ariaLabel="Drawing tools"
        items={items}
        onItemClick={event => {
          const { id, pressed } = event.detail;
          if (id === 'zoom-in') {
            setZoom(current => current * 2);
          } else if (id === 'zoom-out') {
            setZoom(current => current / 2);
          } else if (id === 'zoom-fit') {
            setZoom(100);
          } else if (id === 'grid') {
            setGrid(Boolean(pressed));
          } else if (id === 'lock') {
            setLocked(Boolean(pressed));
          }
        }}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Plan at {zoom}%, grid {grid ? 'on' : 'off'}, drawing {locked ? 'locked' : 'unlocked'}.
      </Box>
    </SpaceBetween>
  );
}
