// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnchorNavigation, { AnchorNavigationProps } from '@ordinate/components/anchor-navigation';
import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';

const anchors: AnchorNavigationProps.Anchor[] = [
  { text: 'Overview', href: '#an-levels-overview', level: 1 },
  { text: 'Survey method', href: '#an-levels-method', level: 1 },
  { text: 'Baseline', href: '#an-levels-baseline', level: 2 },
  { text: 'Triangulation', href: '#an-levels-triangulation', level: 2, info: 'Updated' },
  { text: 'Angles and stations', href: '#an-levels-angles', level: 3 },
  { text: 'Levelling', href: '#an-levels-levelling', level: 2 },
  { text: 'Results', href: '#an-levels-results', level: 1, info: 'New' },
  { text: 'Errata', href: '#an-levels-errata', level: 1 },
];

export default function Levels() {
  const [activeHref, setActiveHref] = useState('#an-levels-triangulation');
  const active = anchors.find(anchor => anchor.href === activeHref);

  return (
    <SpaceBetween size="s">
      <Box variant="h4" id="an-levels-title">
        Survey report
      </Box>
      <AnchorNavigation
        anchors={anchors}
        activeHref={activeHref}
        ariaLabelledby="an-levels-title"
        onFollow={event => {
          event.preventDefault();
          setActiveHref(event.detail.href);
        }}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Followed: {active?.text}, level {active?.level}
      </Box>
    </SpaceBetween>
  );
}
