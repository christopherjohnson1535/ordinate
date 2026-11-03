// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Terminal, { TerminalProps } from '@ordinate/components/terminal';

const lines: TerminalProps.Line[] = [
  { text: '$ ord nodes list --project north-annex', type: 'command' },
  { text: 'NAME      ZONE             STATE      UPTIME', type: 'header' },
  { text: 'node-01   us-mountain-1a   running    41d' },
  { text: 'node-02   us-mountain-1a   running    41d' },
  { text: 'node-03   us-mountain-1b   running    12d' },
  { text: 'node-04   us-mountain-1b   draining   12d' },
  { text: '' },
  { text: '4 nodes, 1 draining.', type: 'muted' },
];

export default function Transcript() {
  return <Terminal lines={lines} ariaLabel="Output of ord nodes list" />;
}
