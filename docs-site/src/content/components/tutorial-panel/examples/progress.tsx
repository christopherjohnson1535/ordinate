// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext from '@ordinate/components/annotation-context';
import Button from '@ordinate/components/button';
import Grid from '@ordinate/components/grid';
import Hotspot from '@ordinate/components/hotspot';
import SpaceBetween from '@ordinate/components/space-between';
import TutorialPanel, { TutorialPanelProps } from '@ordinate/components/tutorial-panel';

const tutorial: TutorialPanelProps.Tutorial = {
  title: 'Publish a drawing set',
  description: 'Check the sheets, stamp them and send them to the builder.',
  completedScreenDescription: 'The set is issued. The builder gets a link by email.',
  tasks: [
    {
      title: 'Check the set',
      steps: [
        { title: 'Open the sheet list', content: 'Every sheet of the set is listed here.', hotspotId: 'progress-list' },
        { title: 'Check the revisions', content: 'Each sheet shows its latest revision.', hotspotId: 'progress-rev' },
      ],
    },
    {
      title: 'Issue it',
      steps: [
        { title: 'Issue the set', content: 'Issuing stamps every sheet with today.', hotspotId: 'progress-issue' },
      ],
    },
  ],
};

export default function Progress() {
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const current = { ...tutorial, completed };

  return (
    <AnnotationContext
      currentTutorial={running ? current : null}
      onStartTutorial={() => {
        setRunning(true);
        setCompleted(false);
      }}
      onExitTutorial={() => setRunning(false)}
      onFinish={() => setCompleted(true)}
    >
      <Grid gridDefinition={[{ colspan: { default: 12, xs: 6 } }, { colspan: { default: 12, xs: 6 } }]}>
        <SpaceBetween direction="horizontal" size="m">
          <Hotspot hotspotId="progress-list" direction="bottom">
            <Button>Sheet list</Button>
          </Hotspot>
          <Hotspot hotspotId="progress-rev" direction="bottom">
            <Button>Revisions</Button>
          </Hotspot>
          <Hotspot hotspotId="progress-issue" direction="bottom">
            <Button variant="primary">Issue the set</Button>
          </Hotspot>
        </SpaceBetween>
        <TutorialPanel tutorials={[current]} />
      </Grid>
    </AnnotationContext>
  );
}
