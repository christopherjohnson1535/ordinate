// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Popover from '@ordinate/components/popover';
import SpaceBetween from '@ordinate/components/space-between';

export default function Positions() {
  return (
    <SpaceBetween direction="horizontal" size="xl">
      <Popover position="top" dismissButton={false} content="Opens above its trigger.">
        Top
      </Popover>
      <Popover position="right" dismissButton={false} content="Opens at the end of the line.">
        Right
      </Popover>
      <Popover position="bottom" dismissButton={false} content="Opens below its trigger.">
        Bottom
      </Popover>
      <Popover position="left" dismissButton={false} content="Opens at the start of the line.">
        Left
      </Popover>
    </SpaceBetween>
  );
}
