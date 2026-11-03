// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Link, { LinkProps } from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';

export default function ClientRouting() {
  const [route, setRoute] = useState('/projects/north-annex');

  // A plain left click or Enter comes here. Ctrl-click and middle-click still open a new tab.
  const navigate = (event: CustomEvent<LinkProps.FollowDetail>) => {
    event.preventDefault();
    setRoute(event.detail.href ?? route);
  };

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="l">
        <Link href="/projects/north-annex" onFollow={navigate}>
          Overview
        </Link>
        <Link href="/projects/north-annex/nodes" onFollow={navigate}>
          Nodes
        </Link>
        <Link href="/projects/north-annex/logs" onFollow={navigate}>
          Logs
        </Link>
      </SpaceBetween>
      <Box color="text-body-secondary" fontSize="body-s">
        Router is at <Box variant="code">{route}</Box>
      </Box>
    </SpaceBetween>
  );
}
