// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext from '@ordinate/components/annotation-context';
import Box from '@ordinate/components/box';
import Grid from '@ordinate/components/grid';
import SpaceBetween from '@ordinate/components/space-between';
import TutorialPanel, { TutorialPanelProps } from '@ordinate/components/tutorial-panel';

const tutorials: TutorialPanelProps.Tutorial[] = [
  {
    title: 'Set up a project',
    description: 'Name the project, place it in a region and save the settings.',
    learnMoreUrl: 'https://example.com/docs/projects',
    tasks: [
      {
        title: 'Describe the project',
        steps: [
          { title: 'Name the project', content: 'Lowercase letters and hyphens.', hotspotId: 'list-name' },
          { title: 'Choose a region', content: 'Closest to your users.', hotspotId: 'list-region' },
        ],
      },
    ],
  },
  {
    title: 'Invite a teammate',
    description: 'Give someone else access to the project.',
    completed: true,
    tasks: [{ title: 'Invite', steps: [{ title: 'Send an invite', content: 'By email.', hotspotId: 'list-invite' }] }],
  },
  {
    title: 'Turn on backups',
    description: 'Keep a nightly copy of the project data.',
    prerequisitesNeeded: true,
    prerequisitesAlert: 'Set up a project first.',
    tasks: [{ title: 'Back up', steps: [{ title: 'Turn on backups', content: 'Nightly.', hotspotId: 'list-backup' }] }],
  },
];

export default function List() {
  const [log, setLog] = useState('Nothing chosen yet.');

  return (
    <AnnotationContext
      currentTutorial={null}
      onStartTutorial={event => setLog(`Asked to start "${event.detail.tutorial.title}".`)}
    >
      <Grid gridDefinition={[{ colspan: { default: 12, xs: 6 } }]}>
        <SpaceBetween size="m">
          <TutorialPanel
            tutorials={tutorials}
            downloadUrl="https://example.com/tutorials.pdf"
            onFeedbackClick={() => setLog('Asked for the feedback form.')}
          />
          <Box color="text-body-secondary" fontSize="body-s">
            {log}
          </Box>
        </SpaceBetween>
      </Grid>
    </AnnotationContext>
  );
}
