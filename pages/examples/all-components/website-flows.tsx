// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import HowItWorks from '~components/how-it-works';
import Input from '~components/input';
import Journey, { JourneyProps } from '~components/journey';
import OpeningHours, { OpeningHoursProps } from '~components/opening-hours';
import Tiles from '~components/tiles';

import { Cell, Group, Readout } from './specimen';

import styles from './specimen.module.scss';

const shopDays: OpeningHoursProps.Day[] = [
  { day: 'monday', closed: true, note: 'Workshop day' },
  { day: 'tuesday', opens: '08:00', closes: '18:00' },
  { day: 'wednesday', opens: '08:00', closes: '18:00' },
  { day: 'thursday', opens: '08:00', closes: '20:00', note: 'Late repairs until 8' },
  { day: 'friday', opens: '08:00', closes: '18:00' },
  { day: 'saturday', opens: '09:00', closes: '16:30' },
  { day: 'sunday', opens: '10:00', closes: '14:00' },
];

function JourneySpecimen() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [dropOff, setDropOff] = useState<string | null>('book');
  const [fault, setFault] = useState('');
  const [time, setTime] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const steps: JourneyProps.Step[] = [
    {
      id: 'how',
      question: 'How would you like to drop off your bike?',
      content: (
        <Tiles
          value={dropOff}
          onChange={event => setDropOff(event.detail.value)}
          ariaLabel="Drop-off"
          items={[
            { value: 'walk-in', label: 'Walk in', description: 'Any time we are open.' },
            { value: 'book', label: 'Book a slot', description: 'Pick a time online.' },
          ]}
        />
      ),
    },
    {
      id: 'what',
      question: 'What needs fixing?',
      isOptional: true,
      content: (
        <FormField label="In a few words">
          <Input value={fault} onChange={event => setFault(event.detail.value)} />
        </FormField>
      ),
    },
    {
      id: 'when',
      question: 'When suits you?',
      content: (
        <Tiles
          value={time}
          onChange={event => setTime(event.detail.value)}
          ariaLabel="Time"
          items={[
            { value: 'morning', label: 'Morning', description: 'Ready the same day.' },
            { value: 'afternoon', label: 'Afternoon', description: 'Ready the next day.' },
          ]}
        />
      ),
    },
  ];
  return (
    <>
      <Journey
        steps={steps}
        headingLevel={4}
        activeStepIndex={activeStepIndex}
        onNavigate={event => setActiveStepIndex(event.detail.requestedStepIndex)}
        onFinish={() => setFinished(true)}
        finishButtonText="Book the repair"
      />
      {finished && <Readout>Booked. We will text you the day before.</Readout>}
    </>
  );
}

export default function WebsiteFlowsGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Website flows">
      <Cell name="HowItWorks" wide={true}>
        <div className={`${styles.site} ${styles.padded}`}>
          <HowItWorks
            headingLevel={4}
            ariaLabel="How a repair works"
            steps={[
              { title: 'Book a slot', description: 'Pick a time online or call the shop.' },
              { title: 'Get a quote', description: 'We check the bike with you and price the work before we start.' },
              { title: 'Ride home', description: 'Most repairs are done the same day. We text you when it is ready.' },
            ]}
          />
        </div>
      </Cell>
      <Cell name="Journey" wide={true}>
        <div className={`${styles.site} ${styles.padded}`}>
          <JourneySpecimen />
        </div>
      </Cell>
      <Cell name="OpeningHours">
        <OpeningHours caption="Opening hours" days={shopDays} highlightToday={true} />
      </Cell>
    </Group>
  );
}
