// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';
import Toggle from '@ordinate/components/toggle';
import Wizard from '@ordinate/components/wizard';

export default function SkipAndLoad() {
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState<number | null>(null);
  const [backups, setBackups] = useState(false);
  const [alerts, setAlerts] = useState(false);
  const [result, setResult] = useState('');

  // Stands in for a request that checks the quota before the next step opens.
  useEffect(() => {
    if (pending === null) {
      return;
    }
    const timer = window.setTimeout(() => {
      setStep(pending);
      setPending(null);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [pending]);

  return (
    <SpaceBetween size="m">
      <Wizard
        variant="steps"
        kind="configuration"
        reference="C2"
        allowSkipTo={true}
        activeStepIndex={step}
        isLoadingNextStep={pending !== null}
        submitButtonText="Apply settings"
        onNavigate={({ detail }) =>
          detail.reason === 'next' ? setPending(detail.requestedStepIndex) : setStep(detail.requestedStepIndex)
        }
        onCancel={() => setResult('Cancelled.')}
        onSubmit={() => setResult(`Applied: backups ${backups ? 'on' : 'off'}, alerts ${alerts ? 'on' : 'off'}.`)}
        steps={[
          { title: 'Check the quota', content: <Box>atrium-api has room for 4 more nodes in us-mountain-1.</Box> },
          {
            title: 'Backups',
            isOptional: true,
            content: (
              <Toggle checked={backups} onChange={event => setBackups(event.detail.checked)}>
                Nightly backups
              </Toggle>
            ),
          },
          {
            title: 'Alerts',
            isOptional: true,
            content: (
              <Toggle checked={alerts} onChange={event => setAlerts(event.detail.checked)}>
                Page the on-call engineer
              </Toggle>
            ),
          },
          {
            title: 'Apply',
            content: <Box>Changes apply to new nodes. Running nodes keep theirs until they restart.</Box>,
          },
        ]}
      />
      {result && (
        <Box color="text-body-secondary" fontSize="body-s">
          {result}
        </Box>
      )}
    </SpaceBetween>
  );
}
