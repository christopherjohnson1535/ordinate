// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Icon from '@ordinate/components/icon';
import SpaceBetween from '@ordinate/components/space-between';

// A crane in open strokes on the 16 by 16 grid, with no colors or stroke widths of its own.
const crane = (
  <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
    <path d="M4 14.5V2.5h1.5v12M2 14.5h6M4 2.5h10M5.5 2.5 4 5M12 2.5v5M11 7.5h2v1.5h-2z" />
  </svg>
);

// A hard hat whose brim is solid: the "filled" class fills a part instead of stroking it.
const hardHat = (
  <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
    <path d="M3 10.5a5 5 0 0 1 10 0M8 5.5v-2" />
    <rect className="filled" x="1.5" y="10.5" width="13" height="2" rx="0.5" />
  </svg>
);

export default function CustomSvg() {
  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="l" alignItems="center">
        <Icon svg={crane} size="small" ariaLabel="Crane" />
        <Icon svg={crane} ariaLabel="Crane" />
        <Icon svg={crane} size="big" ariaLabel="Crane" />
        <Icon svg={hardHat} ariaLabel="Hard hat required" />
        <Icon svg={hardHat} size="big" variant="warning" ariaLabel="Hard hat required" />
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
        <Icon svg={hardHat} />
        <Box>Hard hats past this point</Box>
      </SpaceBetween>
    </SpaceBetween>
  );
}
