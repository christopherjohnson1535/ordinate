// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext, { AnnotationContextProps } from '~components/annotation-context';
import Button from '~components/button';
import FormField from '~components/form-field';
import Hotspot from '~components/hotspot';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import Steps from '~components/steps';
import TutorialPanel from '~components/tutorial-panel';
import Wizard, { WizardProps } from '~components/wizard';

import { Cell, Group, Readout } from './specimen';

import styles from './specimen.module.scss';

const tour: AnnotationContextProps.Tutorial = {
  title: 'Book a repair',
  description: 'Tell the workshop which bike it is, pick a slot and send the booking.',
  completedScreenDescription: 'The booking is sent. We text you the day before.',
  tasks: [
    {
      title: 'Describe the bike',
      steps: [
        {
          title: 'Name the bike',
          content: 'Make and model help us bring the right parts to the stand.',
          hotspotId: 'repair-bike',
        },
        { title: 'Pick a slot', content: 'Morning slots are ready the same day.', hotspotId: 'repair-slot' },
      ],
    },
    {
      title: 'Send it',
      steps: [{ title: 'Send the booking', content: 'We confirm by text within the hour.', hotspotId: 'repair-send' }],
    },
  ],
};

const slots: SelectProps.Options = [
  { label: 'Tuesday, 9:00', value: 'tue-9' },
  { label: 'Tuesday, 14:00', value: 'tue-14' },
  { label: 'Wednesday, 9:00', value: 'wed-9' },
];

function HotspotSpecimen() {
  const [bike, setBike] = useState('Pashley Roadster');
  const [slot, setSlot] = useState<SelectProps.Option | null>(null);
  return (
    <SpaceBetween size="s">
      <Hotspot hotspotId="repair-bike">
        <FormField label="Your bike">
          <Input value={bike} onChange={event => setBike(event.detail.value)} />
        </FormField>
      </Hotspot>
      <Hotspot hotspotId="repair-slot">
        <FormField label="Repair slot">
          <Select
            selectedOption={slot}
            onChange={event => setSlot(event.detail.selectedOption)}
            options={slots}
            placeholder="Choose a slot"
          />
        </FormField>
      </Hotspot>
      <Hotspot hotspotId="repair-send" direction="right">
        <Button variant="primary">Send the booking</Button>
      </Hotspot>
    </SpaceBetween>
  );
}

const wizardSteps = (crew: string, setCrew: (value: string) => void): WizardProps.Step[] => [
  {
    title: 'Name the site',
    description: 'Where the hut will stand.',
    summary: 'Hut No. 3, Tweed valley',
    content: (
      <FormField label="Site name">
        <Input value="Hut No. 3, Tweed valley" readOnly={true} />
      </FormField>
    ),
  },
  {
    title: 'Choose a builder',
    content: (
      <FormField label="Builder">
        <Input value={crew} onChange={event => setCrew(event.detail.value)} placeholder="Name of the firm" />
      </FormField>
    ),
  },
  {
    title: 'Add a structural engineer',
    isOptional: true,
    content: 'Only needed if the span of the roof is over 4.8 m.',
  },
  { title: 'Review and issue', content: 'Every sheet is checked and stamped before it goes out.' },
];

function WizardSpecimen() {
  const [activeStepIndex, setActiveStepIndex] = useState(1);
  const [crew, setCrew] = useState('');
  const [issued, setIssued] = useState(false);
  return (
    <>
      <Wizard
        steps={wizardSteps(crew, setCrew)}
        activeStepIndex={activeStepIndex}
        onNavigate={event => setActiveStepIndex(event.detail.requestedStepIndex)}
        onSubmit={() => setIssued(true)}
        onCancel={() => setActiveStepIndex(0)}
        submitButtonText="Issue for tender"
      />
      {issued && <Readout>Issued for tender.</Readout>}
    </>
  );
}

export default function GuidedFlowsGroup({ number }: { number: number }) {
  const [current, setCurrent] = useState<AnnotationContextProps.Tutorial | null>(null);
  const [completed, setCompleted] = useState(false);
  return (
    <AnnotationContext
      currentTutorial={current ? { ...current, completed } : null}
      onStartTutorial={event => {
        setCurrent(event.detail.tutorial);
        setCompleted(false);
      }}
      onExitTutorial={() => setCurrent(null)}
      onFinish={() => setCompleted(true)}
    >
      <Group number={number} title="Guided flows">
        <Cell name="AnnotationContext" note="Holds the tour that the hotspots and the tutorial panel share.">
          <SpaceBetween size="xs">
            <Button
              onClick={() => {
                setCompleted(false);
                setCurrent(current ? null : tour);
              }}
            >
              {current ? 'End the tour' : 'Start the tour'}
            </Button>
            <Readout>{current ? `Running: ${current.title}` : 'No tour running'}</Readout>
          </SpaceBetween>
        </Cell>
        <Cell name="Hotspot" note="Markers show next to each field while the tour runs.">
          <HotspotSpecimen />
        </Cell>
        <Cell name="Steps">
          <Steps
            ariaLabel="Rollout of web:v2"
            steps={[
              { header: 'Build image web:v2', status: 'complete', details: '4 min 12 s' },
              { header: 'Roll out to gallery-east', status: 'underway', details: '3 of 5 replicas ready' },
              { header: 'Roll out to north-annex-web', status: 'waiting' },
            ]}
          />
        </Cell>
        <Cell name="TutorialPanel">
          <div className={styles.column}>
            <TutorialPanel tutorials={[tour]} />
          </div>
        </Cell>
        <Cell name="Wizard" wide={true} note="A checklist sheet: fill the items in any order, then issue.">
          <WizardSpecimen />
        </Cell>
      </Group>
    </AnnotationContext>
  );
}
