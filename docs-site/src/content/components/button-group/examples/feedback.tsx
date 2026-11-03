// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ButtonGroup, { ButtonGroupProps } from '@ordinate/components/button-group';
import SpaceBetween from '@ordinate/components/space-between';

type Rating = 'up' | 'down' | null;

export default function Feedback() {
  const [rating, setRating] = useState<Rating>(null);
  const [showSources, setShowSources] = useState(false);

  const items: ButtonGroupProps.ItemOrGroup[] = [
    {
      type: 'group',
      text: 'Rate this answer',
      items: [
        {
          type: 'icon-toggle-button',
          id: 'up',
          text: 'Helpful',
          iconName: 'thumbs-up',
          pressedIconName: 'thumbs-up-solid',
          pressed: rating === 'up',
          popoverFeedback: rating === 'up' ? undefined : 'Thanks for the rating',
        },
        {
          type: 'icon-toggle-button',
          id: 'down',
          text: 'Not helpful',
          iconName: 'thumbs-down',
          pressedIconName: 'thumbs-down-solid',
          pressed: rating === 'down',
        },
      ],
    },
    { type: 'icon-button', id: 'copy', text: 'Copy answer', iconName: 'copy', popoverFeedback: 'Answer copied' },
    {
      type: 'menu-dropdown',
      id: 'more',
      text: 'More actions',
      items: [
        { id: 'sources', text: 'Show sources', itemType: 'checkbox', checked: showSources },
        { id: 'report', text: 'Report a problem' },
      ],
    },
  ];

  return (
    <SpaceBetween size="m">
      <Box>Restart the nodes one zone at a time, so at least three zones keep serving traffic.</Box>
      <ButtonGroup
        ariaLabel="Response actions"
        items={items}
        onItemClick={event => {
          const { id, pressed, checked } = event.detail;
          if (id === 'up' || id === 'down') {
            setRating(pressed ? id : null);
          } else if (id === 'sources') {
            setShowSources(Boolean(checked));
          }
        }}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Rating: {rating ?? 'none'}. Sources {showSources ? 'shown' : 'hidden'}.
      </Box>
    </SpaceBetween>
  );
}
