// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import SpaceBetween from '@ordinate/components/space-between';
import Textarea from '@ordinate/components/textarea';
import Wizard from '@ordinate/components/wizard';

export default function Checklist() {
  const [step, setStep] = useState(0);
  const [site, setSite] = useState('Hut No. 3, Tweed valley');
  const [builder, setBuilder] = useState('');
  const [engineer, setEngineer] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');
  // The builder is marked missing once the user has left that item empty, or tried to issue without it.
  const [leftBuilder, setLeftBuilder] = useState(false);
  const builderError = leftBuilder && !builder.trim() ? 'Name the firm the sheet is issued to.' : undefined;

  return (
    <SpaceBetween size="m">
      <Wizard
        activeStepIndex={step}
        onNavigate={event => {
          setLeftBuilder(leftBuilder || step === 1);
          setStep(event.detail.requestedStepIndex);
        }}
        submitButtonText="Issue for tender"
        secondaryActions={<Button onClick={() => setResult('Draft saved.')}>Save draft</Button>}
        onCancel={() => setResult('Cancelled. The sheet was not issued.')}
        onSubmit={() => {
          if (builder.trim()) {
            setResult(`Issued for tender to ${builder}.`);
          } else {
            setLeftBuilder(true);
            setStep(1);
          }
        }}
        aside={
          <KeyValuePairs
            columns={1}
            items={[
              { label: 'Project', value: 'Harbour & Pine, Hut No. 3' },
              { label: 'Drawn by', value: 'Dana Ruiz' },
            ]}
          />
        }
        steps={[
          {
            title: 'Name the site',
            description: 'Where the hut will stand.',
            summary: site,
            errorText: site.trim() ? undefined : 'Enter the site, so the builder can price the access.',
            content: (
              <FormField label="Site">
                <Input value={site} onChange={event => setSite(event.detail.value)} />
              </FormField>
            ),
          },
          {
            title: 'Choose a builder',
            description: 'The firm the sheet is issued to.',
            summary: builder || 'No builder named',
            errorText: builderError,
            content: (
              <FormField label="Builder">
                <Input
                  value={builder}
                  placeholder="Name of the firm"
                  onChange={event => setBuilder(event.detail.value)}
                />
              </FormField>
            ),
          },
          {
            title: 'Add a structural engineer',
            description: 'Only needed for a roof span over 4.8 m.',
            isOptional: true,
            summary: engineer || 'None',
            content: (
              <FormField label="Engineer">
                <Input value={engineer} onChange={event => setEngineer(event.detail.value)} />
              </FormField>
            ),
          },
          {
            title: 'Notes for the builder',
            summary: notes || 'No notes',
            content: (
              <FormField label="Notes">
                <Textarea value={notes} rows={3} onChange={event => setNotes(event.detail.value)} />
              </FormField>
            ),
          },
        ]}
      />
      {result && (
        <Box color="text-body-secondary" fontSize="body-s">
          {result}
        </Box>
      )}
    </SpaceBetween>
  );
}
