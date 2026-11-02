// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Container from '~components/container';
import FormField from '~components/form-field';
import Input from '~components/input';
import KeyValuePairs from '~components/key-value-pairs';
import Wizard, { WizardProps } from '~components/wizard';

import styles from './styles.module.scss';

function makeSteps(count: number, optional: number[] = []): WizardProps.Step[] {
  return Array.from({ length: count }, (_, index) => ({
    title: ['Source', 'Destination', 'Schedule', 'Filters', 'Review'][index] ?? `Step ${index + 1}`,
    description: index === 0 ? 'Where the files are copied from.' : undefined,
    summary: index === 0 ? 's3://survey-plates/2026' : undefined,
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

      <h2 className={styles['variant-heading']}>Checklist sheet (the default)</h2>

      <section className={styles.section}>
        <h3>Open the first item, optional items in dashed boxes, with an aside</h3>
        <div className={styles.wide}>
          <Uncontrolled
            steps={makeSteps(5, [2, 3])}
            submitButtonText="Start copying"
            aside={
              <Container heading="Title block" headingLevel={3}>
                <KeyValuePairs
                  columns={1}
                  items={[
                    { label: 'Job', value: 'Copy survey plates' },
                    { label: 'Sheet', value: '1 of 1' },
                  ]}
                />
              </Container>
            }
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3>Errors on a checked item and on the open item</h3>
        <div className={styles.wide}>
          <Uncontrolled
            steps={makeSteps(4, [3]).map((step, index) =>
              index === 0
                ? { ...step, errorText: 'The source bucket is empty.' }
                : index === 2
                  ? { ...step, errorText: 'Choose a time at least 10 minutes from now.' }
                  : step
            )}
            activeStepIndex={2}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3>Narrow, while loading the next item</h3>
        <div className={styles.narrow}>
          <Uncontrolled steps={makeSteps(3, [2])} isLoadingNextStep={true} aside={<Box>Aside below the sheet</Box>} />
        </div>
      </section>

      <section className={styles.section}>
        <h3>Replaced labels, a single item</h3>
        <div className={styles.wide}>
          <Uncontrolled
            steps={makeSteps(1)}
            i18nStrings={{
              cancelButton: 'Discard',
              submitButton: 'Finish',
              checkedStatusText: (checked, required) => `${checked}/${required} done`,
              stepNumberLabel: stepNumber => `Part ${stepNumber}`,
            }}
          />
        </div>
      </section>

      <h2 className={styles['variant-heading']}>Steps</h2>

      <section className={styles.section}>
        <h3>Narrow: the scale keeps only the references</h3>
        <div className={styles.narrow}>
          <Uncontrolled variant="steps" steps={makeSteps(4, [2])} />
        </div>
      </section>

      <section className={styles.section}>
        <h3>Skipping: every step after the first is optional, in a configuration kind with a reference</h3>
        <div className={styles.wide}>
          <Uncontrolled
            variant="steps"
            kind="configuration"
            reference="C4"
            steps={makeSteps(5, [1, 2, 3])}
            allowSkipTo={true}
            submitButtonText="Start copying"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3>A step error, while loading the next step</h3>
        <div className={styles.wide}>
          <Uncontrolled
            variant="steps"
            steps={makeSteps(3).map((step, index) =>
              index === 1 ? { ...step, errorText: 'The destination bucket does not exist. Check the name.' } : step
            )}
            activeStepIndex={1}
            isLoadingNextStep={true}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3>Replaced labels, a single step</h3>
        <div className={styles.wide}>
          <Uncontrolled
            variant="steps"
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
