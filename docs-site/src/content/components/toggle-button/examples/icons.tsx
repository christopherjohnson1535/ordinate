// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import SpaceBetween from '@ordinate/components/space-between';
import ToggleButton from '@ordinate/components/toggle-button';

export default function Icons() {
  const [favorite, setFavorite] = useState(true);
  const [muted, setMuted] = useState(false);
  const [wrap, setWrap] = useState(false);

  return (
    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
      <ToggleButton
        variant="icon"
        iconName="star"
        pressedIconName="star-solid"
        ariaLabel="Favorite"
        pressed={favorite}
        onChange={event => setFavorite(event.detail.pressed)}
      />
      <ToggleButton
        variant="icon"
        iconName="microphone"
        pressedIconName="microphone-off"
        ariaLabel="Mute"
        pressed={muted}
        onChange={event => setMuted(event.detail.pressed)}
      />
      <ToggleButton
        variant="icon"
        iconName="transcript"
        ariaLabel="Wrap long lines"
        pressed={wrap}
        onChange={event => setWrap(event.detail.pressed)}
      />
    </SpaceBetween>
  );
}
