// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Container from '~components/container';
import FormField from '~components/form-field';
import Input from '~components/input';
import Wizard, { WizardProps } from '~components/wizard';

import styles from './styles.module.scss';

function makeSteps(count: number, optional: number[] = []): WizardProps.Step[] {
  return Array.from({ length: count }, (_, index) => ({
    title: ['Source', 'Destination', 'Schedule', 'Filters', 'Review'][index] ?? `Step ${index + 1}`,
    description: index === 0 ? 'Where the files are copied from.' : undefined,
    isOptional: optional.includes(index),
    content: (
      <Container>
        <FormField label="Location" description={`Fields for step ${index + 1}.`}>
          <Input value="" placeholder="s3://survey-plates" onChange={() => undefined} />
        </FormField>
      </Container>
    ),
  }));
}

function Uncontrolled({ steps, ...props }: Partial<WizardProps> & { steps: WizardProps.Step[] }) {
  const [events, setEvents] = useState<string[]>([]);
  return (
    <>
      <Wizard
        steps={steps}
        {...props}
        onNavigate={({ detail }) =>
          setEvents(current => [...current.slice(-2), `${detail.reason} to ${detail.requestedStepIndex + 1}`])
        }
        onSubmit={() => setEvents(current => [...current.slice(-2), 'submit'])}
        onCancel={() => setEvents(current => [...current.slice(-2), 'cancel'])}
      />
      <Box variant="small" color="text-body-secondary">
        Events: {events.join(', ') || 'none'}
      </Box>
    </>
  );
}

export default function WizardPermutations() {
  return (
    <div className={styles.page}>
      <h1>Wizard permutations</h1>

      <section className={styles.section}>
        <h2>Narrow: the navigation collapses into a disclosure</h2>
        <div className={styles.narrow}>
          <Uncontrolled steps={makeSteps(4, [2])} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Skipping: every step after the first is optional</h2>
        <div className={styles.wide}>
          <Uncontrolled steps={makeSteps(5, [1, 2, 3])} allowSkipTo={true} submitButtonText="Start copying" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>A step error, while loading the next step</h2>
        <div className={styles.wide}>
          <Uncontrolled
            steps={makeSteps(3).map((step, index) =>
              index === 1 ? { ...step, errorText: 'The destination bucket does not exist. Check the name.' } : step
            )}
            activeStepIndex={1}
            isLoadingNextStep={true}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Replaced labels, a single step</h2>
        <div className={styles.wide}>
          <Uncontrolled
            steps={makeSteps(1)}
            i18nStrings={{
              cancelButton: 'Discard',
              submitButton: 'Finish',
              navigationAriaLabel: 'Progress',
              stepNumberLabel: stepNumber => `Part ${stepNumber}`,
            }}
          />
        </div>
      </section>
    </div>
  );
}
