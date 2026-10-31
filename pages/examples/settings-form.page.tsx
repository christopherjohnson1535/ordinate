// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '~components/alert';
import Badge from '~components/badge';
import Box from '~components/box';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import Container from '~components/container';
import Form from '~components/form';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Link from '~components/link';
import RadioGroup from '~components/radio-group';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Textarea from '~components/textarea';
import Toggle from '~components/toggle';

const regions: SelectProps.Options = [
  {
    label: 'North America',
    options: [
      { label: 'us-mountain-1', value: 'us-mountain-1', description: 'Denver' },
      { label: 'us-east-2', value: 'us-east-2', description: 'Columbus' },
    ],
  },
  {
    label: 'Europe',
    options: [{ label: 'eu-west-1', value: 'eu-west-1', description: 'Dublin' }],
  },
];

// The phase 1 gate: a complete settings page built only from Ordinate components.
export default function SettingsForm() {
  const [name, setName] = useState('north-annex');
  const [summary, setSummary] = useState('Production environment for the annex.');
  const [region, setRegion] = useState<SelectProps.Option | null>({ label: 'us-mountain-1', value: 'us-mountain-1' });
  const [tier, setTier] = useState('standard');
  const [capacity, setCapacity] = useState('20');
  const [encrypt, setEncrypt] = useState(true);
  const [backups, setBackups] = useState(true);
  const [autoscale, setAutoscale] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameError = submitted && !/^[a-z0-9-]+$/.test(name) ? 'Use lowercase letters, numbers and hyphens.' : undefined;
  const capacityError = submitted && Number(capacity) < 1 ? 'Enter at least 1 node.' : undefined;
  const hasErrors = Boolean(nameError || capacityError);

  const save = () => {
    setSubmitted(true);
    const valid = /^[a-z0-9-]+$/.test(name) && Number(capacity) >= 1;
    setSaved(valid);
  };

  return (
    <form onSubmit={event => event.preventDefault()}>
      <Form
        header={
          <Header
            variant="h1"
            description="Changes apply to new nodes. Running nodes keep their settings until they restart."
            actions={<StatusIndicator type="success">Running</StatusIndicator>}
          >
            Project settings
          </Header>
        }
        errorText={hasErrors ? 'Fix the highlighted fields before saving.' : undefined}
        secondaryActions={
          <Link href="#examples/settings-form" external={false}>
            View change history
          </Link>
        }
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none">Cancel</Button>
            <Button variant="primary" formAction="none" onClick={save}>
              Save changes
            </Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="l">
          {saved && (
            <Alert type="success" header="Settings saved" dismissible={true} onDismiss={() => setSaved(false)}>
              New nodes will use these settings.
            </Alert>
          )}

          <Container header={<Header description="How the project appears in the console.">General</Header>}>
            <SpaceBetween size="l">
              <FormField
                label="Project name"
                constraintText="Lowercase letters, numbers and hyphens."
                errorText={nameError}
              >
                <Input value={name} onChange={event => setName(event.detail.value)} />
              </FormField>
              <FormField label="Summary" description="Shown on the project overview.">
                <Textarea value={summary} rows={3} onChange={event => setSummary(event.detail.value)} />
              </FormField>
            </SpaceBetween>
          </Container>

          <Container
            header={
              <Header counter={<Badge color="blue">Beta</Badge>} description="Where and how the nodes run.">
                Capacity
              </Header>
            }
          >
            <SpaceBetween size="l">
              <FormField label="Region">
                <Select
                  options={regions}
                  selectedOption={region}
                  onChange={event => setRegion(event.detail.selectedOption)}
                />
              </FormField>
              <FormField label="Tier">
                <RadioGroup
                  value={tier}
                  onChange={event => setTier(event.detail.value)}
                  items={[
                    { value: 'standard', label: 'Standard', description: 'Billed per hour.' },
                    { value: 'reserved', label: 'Reserved', description: 'Billed yearly, about 30% less.' },
                  ]}
                />
              </FormField>
              <FormField
                label="Nodes"
                errorText={capacityError}
                warningText={Number(capacity) > 50 ? 'Large clusters take several minutes to start.' : undefined}
              >
                <Input type="number" value={capacity} onChange={event => setCapacity(event.detail.value)} />
              </FormField>
              <Toggle
                checked={autoscale}
                onChange={event => setAutoscale(event.detail.checked)}
                description="Adds nodes when load stays high for 10 minutes."
              >
                Scale automatically
              </Toggle>
            </SpaceBetween>
          </Container>

          <Container header={<Header>Data</Header>}>
            <SpaceBetween size="s">
              <Checkbox
                checked={encrypt}
                onChange={event => setEncrypt(event.detail.checked)}
                description="Uses your organization's key."
              >
                Encrypt at rest
              </Checkbox>
              <Checkbox checked={backups} onChange={event => setBackups(event.detail.checked)}>
                Back up every night
              </Checkbox>
              <Box variant="small" color="text-body-secondary">
                Backups are kept for 30 days.
              </Box>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      </Form>
    </form>
  );
}
