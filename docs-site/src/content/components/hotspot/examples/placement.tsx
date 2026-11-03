// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext, { AnnotationContextProps } from '@ordinate/components/annotation-context';
import Button from '@ordinate/components/button';
import Hotspot from '@ordinate/components/hotspot';
import SpaceBetween from '@ordinate/components/space-between';
import Toggle from '@ordinate/components/toggle';

const tutorial: AnnotationContextProps.Tutorial = {
  title: 'Node controls',
  tasks: [
    {
      title: 'Look after a node',
      steps: [
        {
          title: 'Drain before maintenance',
          content: 'Draining moves running work to other nodes first.',
          hotspotId: 'place-drain',
        },
        { title: 'Restart', content: 'The node rejoins the pool once its checks pass.', hotspotId: 'place-restart' },
        { title: 'Keep it out of the pool', content: 'Cordoned nodes take no new work.', hotspotId: 'place-cordon' },
      ],
    },
  ],
};

export default function Placement() {
  const [running, setRunning] = useState(false);
  const [cordoned, setCordoned] = useState(false);

  return (
    <AnnotationContext currentTutorial={running ? tutorial : null} onFinish={() => setRunning(false)}>
      <SpaceBetween size="xl">
        <Toggle checked={running} onChange={event => setRunning(event.detail.checked)}>
          Run the tutorial
        </Toggle>
        <SpaceBetween direction="horizontal" size="xl" alignItems="center">
          <Hotspot hotspotId="place-drain" direction="bottom">
            <Button>Drain na-04</Button>
          </Hotspot>
          <Hotspot hotspotId="place-restart" side="left" direction="bottom">
            <Button>Restart na-04</Button>
          </Hotspot>
          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            <Toggle checked={cordoned} onChange={event => setCordoned(event.detail.checked)}>
              Cordoned
            </Toggle>
            <Hotspot hotspotId="place-cordon" direction="right" />
          </SpaceBetween>
        </SpaceBetween>
      </SpaceBetween>
    </AnnotationContext>
  );
}
