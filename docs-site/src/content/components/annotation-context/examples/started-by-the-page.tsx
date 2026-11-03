// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext, { AnnotationContextProps } from '@ordinate/components/annotation-context';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Hotspot from '@ordinate/components/hotspot';
import SpaceBetween from '@ordinate/components/space-between';

const tour: AnnotationContextProps.Tutorial = {
  title: 'What is new in the console',
  tasks: [
    {
      title: 'New controls',
      steps: [
        {
          title: 'Restart in place',
          content: 'Restart drains one node at a time, so the service stays up.',
          hotspotId: 'tour-restart',
        },
        {
          title: 'Download the log',
          content: 'The log downloads as plain text, with times in UTC.',
          hotspotId: 'tour-download',
        },
      ],
    },
  ],
};

export default function StartedByThePage() {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const record = (entry: string) => setLog(entries => [...entries.slice(-2), entry]);

  return (
    <AnnotationContext
      currentTutorial={running ? tour : null}
      onStepChange={event => record(`Step ${event.detail.step + 1} (${event.detail.reason})`)}
      onFinish={() => {
        setRunning(false);
        record('Finished');
      }}
      i18nStrings={{ finishButtonText: 'Got it', stepCounterText: (step, total) => `${step} / ${total}` }}
    >
      <SpaceBetween size="m">
        <SpaceBetween direction="horizontal" size="xs">
          <Hotspot hotspotId="tour-restart">
            <Button iconName="refresh">Restart</Button>
          </Hotspot>
          <Hotspot hotspotId="tour-download">
            <Button iconName="download">Download log</Button>
          </Hotspot>
        </SpaceBetween>
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          <Button
            variant="link"
            onClick={() => {
              setRunning(!running);
              record(running ? 'Ended' : 'Started');
            }}
          >
            {running ? 'End the tour' : 'Show what is new'}
          </Button>
          <Box color="text-body-secondary" fontSize="body-s">
            {log.join(' · ') || 'No tour yet.'}
          </Box>
        </SpaceBetween>
      </SpaceBetween>
    </AnnotationContext>
  );
}
