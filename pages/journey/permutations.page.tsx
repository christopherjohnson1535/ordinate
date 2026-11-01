// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import Input from '~components/input';
import Journey, { JourneyProps } from '~components/journey';
import Tiles from '~components/tiles';

import styles from './styles.module.scss';

function ChoiceTiles({ initial = null }: { initial?: string | null }) {
  const [value, setValue] = useState<string | null>(initial);
  return (
    <Tiles
      value={value}
      onChange={event => setValue(event.detail.value)}
      items={[
        { value: 'walk-in', label: 'Walk in', description: 'Any time we are open.' },
        { value: 'book', label: 'Book a slot', description: 'Pick a time online.' },
        { value: 'collect', label: 'We collect', description: 'From your door, for a fee.', disabled: true },
      ]}
    />
  );
}

const baseSteps: JourneyProps.Step[] = [
  {
    id: 'how',
    question: 'How would you like to drop off your bike?',
    description: 'Collection is paused over the holidays.',
    content: <ChoiceTiles initial="book" />,
  },
  {
    id: 'what',
    question: 'What needs fixing?',
    isOptional: true,
    content: (
      <FormField label="In a few words">
        <Input value="" onChange={() => {}} />
      </FormField>
    ),
  },
  { id: 'when', question: 'When suits you?', content: <ChoiceTiles /> },
];

function Example({ title, children, phone }: { title: string; children: React.ReactNode; phone?: boolean }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <div className={phone ? `${styles.frame} ${styles.phone}` : styles.frame}>{children}</div>
    </section>
  );
}

// The states of a journey: a chosen answer, an optional question, an error, loading, the last
// question and a phone-width frame.
export default function JourneyPermutations() {
  return (
    <div className={styles.page}>
      <Example title="First question, an answer chosen, uncontrolled">
        <Journey steps={baseSteps} />
      </Example>
      <Example title="Optional question">
        <Journey steps={baseSteps} activeStepIndex={1} />
      </Example>
      <Example title="Error">
        <Journey
          steps={baseSteps.map((step, index) =>
            index === 2 ? { ...step, errorText: 'Choose a time to continue.' } : step
          )}
          activeStepIndex={2}
          finishButtonText="Book the repair"
        />
      </Example>
      <Example title="Loading on the last question, heading level 3">
        <Journey steps={baseSteps} activeStepIndex={2} isLoading={true} headingLevel={3} />
      </Example>
      <Example title="Phone width" phone={true}>
        <Journey steps={baseSteps} activeStepIndex={0} />
      </Example>
    </div>
  );
}
