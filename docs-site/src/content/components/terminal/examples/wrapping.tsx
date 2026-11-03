// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Terminal, { TerminalProps } from '@ordinate/components/terminal';

const lines: TerminalProps.Line[] = [
  { text: '$ ord storage copy --recursive telemetry/2026/11/01/ archive/telemetry/2026/11/01/', type: 'command' },
  { text: 'OBJECT              SIZE      STATE', type: 'header' },
  { text: 'node-01.parquet     4.2 GiB   copied' },
  { text: 'node-02.parquet     3.9 GiB   copied' },
  { text: 'Copied 2 objects to archive/telemetry/2026/11/01/ in 38 seconds.' },
];

export default function Wrapping() {
  return (
    <ColumnLayout columns={2}>
      <Terminal lines={lines} ariaLabel="Copy output, wrapping" />
      <Terminal lines={lines} wrapLines={false} ariaLabel="Copy output, scrolling" />
    </ColumnLayout>
  );
}
