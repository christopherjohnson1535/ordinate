// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';
import Terminal, { TerminalProps } from '@ordinate/components/terminal';

const steps: { title: string; lines: TerminalProps.Line[] }[] = [
  {
    title: 'Update the image',
    lines: [
      { text: '$ ord deploy set-image web web=registry.example.com/north-annex/web:2026.11.02', type: 'command' },
      { text: 'deployment web: image updated' },
    ],
  },
  {
    title: 'Watch the nodes roll',
    lines: [
      { text: '$ ord deploy status web', type: 'command' },
      { text: 'REPLICA   VERSION      STATE', type: 'header' },
      { text: 'web-1     2026.10.28   running' },
      { text: 'web-2     2026.10.28   stopping' },
      { text: 'web-3     2026.11.02   starting' },
    ],
  },
  {
    title: 'Confirm the rollout',
    lines: [
      { text: '$ ord deploy wait web', type: 'command' },
      { text: 'Rollout finished: 3 of 3 replicas on 2026.11.02.', type: 'success' },
    ],
  },
];

export default function Walkthrough() {
  const [step, setStep] = useState(0);
  const shown = steps.slice(0, step + 1);
  const lines = shown.flatMap((s, i) =>
    s.lines.map(line => ({ ...line, highlighted: i === step && i > 0 && (line.type ?? 'output') === 'output' }))
  );

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <Button disabled={step === 0} onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button variant="primary" disabled={step === steps.length - 1} onClick={() => setStep(step + 1)}>
          Next step
        </Button>
        <Box color="text-body-secondary" fontSize="body-s">
          Step {step + 1} of {steps.length}: {steps[step].title}
        </Box>
      </SpaceBetween>
      <Terminal lines={lines} ariaLabel={`Rollout, step ${step + 1}`} />
    </SpaceBetween>
  );
}
