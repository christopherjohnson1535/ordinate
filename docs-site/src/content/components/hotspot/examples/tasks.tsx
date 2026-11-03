// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext, { AnnotationContextProps } from '@ordinate/components/annotation-context';
import Box from '@ordinate/components/box';
import FormField from '@ordinate/components/form-field';
import Hotspot from '@ordinate/components/hotspot';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';
import Toggle from '@ordinate/components/toggle';

const tutorial: AnnotationContextProps.Tutorial = {
  title: 'Book a repair',
  tasks: [
    {
      title: 'Describe the bike',
      steps: [
        { title: 'Name the bike', content: 'Make and model help us bring the right parts.', hotspotId: 'task-bike' },
        { title: 'Say what is wrong', content: 'A sentence is enough.', hotspotId: 'task-fault' },
      ],
    },
    {
      title: 'Contact',
      steps: [{ title: 'Leave a number', content: 'We text you when the bike is ready.', hotspotId: 'task-phone' }],
    },
  ],
};

export default function Tasks() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [bike, setBike] = useState('Pashley Roadster');
  const [fault, setFault] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <AnnotationContext
      currentTutorial={running ? tutorial : null}
      onStepChange={event => setStep(event.detail.step)}
      onFinish={() => setRunning(false)}
    >
      <SpaceBetween size="l">
        <Toggle
          checked={running}
          onChange={event => {
            setRunning(event.detail.checked);
            setStep(0);
          }}
        >
          Run the tutorial
        </Toggle>
        <Hotspot hotspotId="task-bike">
          <FormField label="Your bike">
            <Input value={bike} onChange={event => setBike(event.detail.value)} />
          </FormField>
        </Hotspot>
        <Hotspot hotspotId="task-fault">
          <FormField label="What is wrong">
            <Input value={fault} onChange={event => setFault(event.detail.value)} />
          </FormField>
        </Hotspot>
        <Hotspot hotspotId="task-phone">
          <FormField label="Phone">
            <Input type="tel" value={phone} onChange={event => setPhone(event.detail.value)} />
          </FormField>
        </Hotspot>
        <Box color="text-body-secondary" fontSize="body-s">
          {running ? `On step ${step + 1} of 3.` : 'No tutorial running: the hotspots show nothing.'}
        </Box>
      </SpaceBetween>
    </AnnotationContext>
  );
}
