// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Header from '@ordinate/components/header';
import Input from '@ordinate/components/input';
import Select, { SelectProps } from '@ordinate/components/select';
import SpaceBetween from '@ordinate/components/space-between';

const regions: SelectProps.Options = [
  { value: 'us-mountain-1', label: 'us-mountain-1', description: 'Denver' },
  { value: 'us-coast-2', label: 'us-coast-2', description: 'Portland' },
  { value: 'eu-north-1', label: 'eu-north-1', description: 'Stockholm' },
];

export default function Complete() {
  const [name, setName] = useState('north-annex');
  const [region, setRegion] = useState<SelectProps.Option | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');

  const nameError = /^[a-z0-9-]+$/.test(name) ? undefined : 'Use lowercase letters, numbers and hyphens.';
  const regionError = submitted && !region ? 'Choose a region.' : undefined;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        setSubmitted(true);
        setResult(!nameError && region ? `Created ${name} in ${region.value}.` : '');
      }}
    >
      <Form
        kind="configuration"
        reference="C4"
        header={
          <Header variant="h2" description="A project holds the services and drawings of one site.">
            Create project
          </Header>
        }
        errorText={
          submitted && (nameError || regionError)
            ? 'The project was not created. Fix the fields marked below.'
            : undefined
        }
        errorIconAriaLabel="Error"
        secondaryActions={<Button formAction="none">Save draft</Button>}
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link" onClick={() => setSubmitted(false)}>
              Cancel
            </Button>
            <Button variant="primary">Create project</Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="l">
          <FormField label="Project name" description="Shown in lists and on invoices." errorText={nameError}>
            <Input value={name} onChange={event => setName(event.detail.value)} />
          </FormField>
          <FormField label="Region" description="Where the services run." errorText={regionError}>
            <Select
              options={regions}
              selectedOption={region}
              placeholder="Choose a region"
              onChange={event => setRegion(event.detail.selectedOption)}
            />
          </FormField>
        </SpaceBetween>
      </Form>
      {result && (
        <Box color="text-status-success" fontSize="body-s" margin={{ top: 's' }}>
          {result}
        </Box>
      )}
    </form>
  );
}
