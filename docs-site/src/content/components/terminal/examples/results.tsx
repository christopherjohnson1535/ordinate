// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Terminal, { TerminalProps } from '@ordinate/components/terminal';

const lines: TerminalProps.Line[] = [
  { text: '$ ./check.sh north-annex', type: 'command' },
  { text: 'PASS  the deployment has three ready replicas', type: 'success' },
  { text: 'PASS  every node runs image base-2026.11', type: 'success' },
  { text: 'FAIL  the gateway sends traffic to port 9090, but the service listens on 8080', type: 'error' },
  { text: '2 of 3 checks passed.', type: 'muted' },
];

export default function Results() {
  return <Terminal lines={lines} ariaLabel="Output of the checks" />;
}
