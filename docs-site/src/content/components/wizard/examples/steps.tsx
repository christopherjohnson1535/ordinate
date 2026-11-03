// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Container from '@ordinate/components/container';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import RadioGroup from '@ordinate/components/radio-group';
import Select, { SelectProps } from '@ordinate/components/select';
import SpaceBetween from '@ordinate/components/space-between';
import Wizard from '@ordinate/components/wizard';

const regions: SelectProps.Options = [
  { label: 'us-mountain-1', value: 'us-mountain-1', description: 'Denver' },
  { label: 'us-east-2', value: 'us-east-2', description: 'Columbus' },
  { label: 'eu-west-1', value: 'eu-west-1', description: 'Dublin' },
];

export default function Steps() {
  const [step, setStep] = useState(0);
  const [tried, setTried] = useState(false);
  const [name, setName] = useState('');
  const [region, setRegion] = useState<SelectProps.Option | null>(null);
  const [size, setSize] = useState('small');
  const [result, setResult] = useState('');

  const nameError = !/^[a-z0-9-]+$/.test(name) ? 'Use lowercase letters, numbers and hyphens.' : undefined;
  const regionError = region ? undefined : 'Choose a region.';
  const stepValid = step !== 0 || (!nameError && !regionError);

  const general = (
    <Container heading="Cluster">
      <SpaceBetween size="l">
        <FormField label="Name" errorText={tried ? nameError : undefined}>
          <Input value={name} placeholder="north-annex" onChange={event => setName(event.detail.value)} />
        </FormField>
        <FormField label="Region" errorText={tried ? regionError : undefined}>
          <Select
            options={regions}
            selectedOption={region}
            placeholder="Choose a region"
            onChange={event => setRegion(event.detail.selectedOption)}
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );

  const capacity = (
    <Container heading="Nodes">
      <RadioGroup
        value={size}
        onChange={event => setSize(event.detail.value)}
        items={[
          { value: 'small', label: 'Small', description: '3 nodes, 2 cores each' },
          { value: 'medium', label: 'Medium', description: '6 nodes, 4 cores each' },
          { value: 'large', label: 'Large', description: '12 nodes, 8 cores each' },
        ]}
      />
    </Container>
  );

  const review = (
    <Container heading="Review">
      <KeyValuePairs
        columns={3}
        items={[
          { label: 'Name', value: name },
          { label: 'Region', value: region?.label ?? '' },
          { label: 'Size', value: size },
        ]}
      />
    </Container>
  );

  return (
    <SpaceBetween size="m">
      <Wizard
        variant="steps"
        kind="resource"
        reference="R4"
        activeStepIndex={step}
        submitButtonText="Create cluster"
        steps={[
          {
            title: 'Name and place',
            content: general,
            errorText: tried && !stepValid ? 'Fix the fields above.' : undefined,
          },
          { title: 'Choose capacity', description: 'You can add nodes later.', content: capacity },
          { title: 'Review and create', content: review },
        ]}
        onNavigate={event => {
          const forward = event.detail.requestedStepIndex > step;
          if (forward && !stepValid) {
            setTried(true);
            return;
          }
          setTried(false);
          setStep(event.detail.requestedStepIndex);
        }}
        onCancel={() => setResult('Cancelled. Nothing was created.')}
        onSubmit={() => setResult(`Creating ${name} in ${region?.label}.`)}
      />
      {result && (
        <Box color="text-body-secondary" fontSize="body-s">
          {result}
        </Box>
      )}
    </SpaceBetween>
  );
}
