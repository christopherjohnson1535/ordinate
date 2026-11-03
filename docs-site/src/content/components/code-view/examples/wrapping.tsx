// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import CodeView from '@ordinate/components/code-view';
import SpaceBetween from '@ordinate/components/space-between';
import Toggle from '@ordinate/components/toggle';

const script = `#!/bin/sh
# Copies last night's telemetry for every node in the north annex to the archive bucket.
ord storage copy --recursive --source ord:storage:us-mountain-1:4021:bucket/telemetry/2026/11/01/ --destination ord:storage:us-mountain-1:4021:bucket/archive/telemetry/2026/11/01/
`;

export default function Wrapping() {
  const [wrap, setWrap] = useState(true);
  const [numbers, setNumbers] = useState(true);

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="l">
        <Toggle checked={wrap} onChange={event => setWrap(event.detail.checked)}>
          Wrap lines
        </Toggle>
        <Toggle checked={numbers} onChange={event => setNumbers(event.detail.checked)}>
          Line numbers
        </Toggle>
      </SpaceBetween>
      <CodeView content={script} wrapLines={wrap} lineNumbers={numbers} ariaLabel="archive-telemetry.sh" />
    </SpaceBetween>
  );
}
