// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '~components/alert';
import Box from '~components/box';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import FormField from '~components/form-field';
import Input from '~components/input';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import RadioGroup from '~components/radio-group';
import SegmentedControl from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Textarea from '~components/textarea';
import Toggle from '~components/toggle';
import Wizard, { WizardProps } from '~components/wizard';

import styles from './styles.module.scss';

const regions: SelectProps.Options = [
  { label: 'us-mountain-1', value: 'us-mountain-1', description: 'Denver' },
  { label: 'us-east-2', value: 'us-east-2', description: 'Columbus' },
  { label: 'eu-west-1', value: 'eu-west-1', description: 'Dublin' },
];

const tiers = [
  { value: 'standard', label: 'Standard', description: 'Billed per hour. Good for most workloads.' },
  { value: 'reserved', label: 'Reserved', description: 'Billed yearly, about 30% less.' },
  { value: 'burst', label: 'Burst', description: 'Shared cores that scale up for short peaks.' },
];

interface Tag {
  key: string;
  value: string;
}

interface Draft {
  name: string;
  region: SelectProps.Option | null;
  summary: string;
  tier: string;
  nodes: string;
  autoscale: boolean;
  tags: Tag[];
  notify: boolean;
  email: string;
  onFailure: boolean;
}

const initialDraft: Draft = {
  name: '',
  region: null,
  summary: '',
  tier: 'standard',
  nodes: '3',
  autoscale: false,
  tags: [{ key: 'team', value: 'platform' }],
  notify: true,
  email: '',
  onFailure: true,
};

function validate(index: number, draft: Draft): Record<string, string> {
  const errors: Record<string, string> = {};
  if (index === 0) {
    if (!draft.name) {
      errors.name = 'Enter a name for the cluster.';
    } else if (!/^[a-z0-9-]+$/.test(draft.name)) {
      errors.name = 'Use lowercase letters, numbers and hyphens.';
    }
    if (!draft.region) {
      errors.region = 'Choose a region.';
    }
  }
  if (index === 1 && !(Number(draft.nodes) >= 1 && Number(draft.nodes) <= 100)) {
    errors.nodes = 'Enter between 1 and 100 nodes.';
  }
  if (index === 3 && draft.notify && !/^\S+@\S+\.\S+$/.test(draft.email)) {
    errors.email = 'Enter an email address, such as ops@north-annex.example.';
  }
  return errors;
}

function InfoLink() {
  return (
    <Link variant="info" href="#wizard/five-step" onFollow={event => event.preventDefault()}>
      Info
    </Link>
  );
}

// The phase 5 gate's wizard: five steps with forms, optional steps, a review built from key-value
// pairs, loading on next and validation errors, as a checklist sheet or step by step.
export default function WizardFiveStep() {
  const [variant, setVariant] = useState<WizardProps.Variant>('checklist');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [allowSkipTo, setAllowSkipTo] = useState(true);
  const [submitted, setSubmitted] = useState<'created' | 'cancelled' | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const update = (changes: Partial<Draft>) => setDraft(current => ({ ...current, ...changes }));
  const fieldError = (name: string) => errors[name];
  const stepHasErrors = Object.keys(errors).length > 0;

  const onNavigate: WizardProps['onNavigate'] = ({ detail }) => {
    setLog(current => [...current.slice(-3), `${detail.reason} to step ${detail.requestedStepIndex + 1}`]);
    const forward = detail.requestedStepIndex > activeStepIndex;
    const found = forward ? validate(activeStepIndex, draft) : {};
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }
    // Checking capacity pretends to ask a server, to show the loading state.
    if (activeStepIndex === 1 && forward) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setActiveStepIndex(detail.requestedStepIndex);
      }, 1200);
      return;
    }
    setActiveStepIndex(detail.requestedStepIndex);
  };

  const errorText = stepHasErrors ? 'Fix the highlighted fields to continue.' : undefined;

  const steps: WizardProps.Step[] = [
    {
      title: 'Name the cluster',
      summary: [draft.name || 'No name', draft.region?.label].filter(Boolean).join(' · '),
      info: <InfoLink />,
      description: 'Choose where the cluster runs. You cannot move it to another region later.',
      errorText: activeStepIndex === 0 ? errorText : undefined,
      content: (
        <Container heading="Cluster details">
          <SpaceBetween size="l">
            <FormField
              label="Cluster name"
              constraintText="Lowercase letters, numbers and hyphens."
              errorText={fieldError('name')}
            >
              <Input
                value={draft.name}
                placeholder="north-annex"
                onChange={event => update({ name: event.detail.value })}
              />
            </FormField>
            <FormField label="Region" errorText={fieldError('region')}>
              <Select
                options={regions}
                selectedOption={draft.region}
                placeholder="Choose a region"
                onChange={event => update({ region: event.detail.selectedOption })}
              />
            </FormField>
            <FormField label="Summary" description="Shown on the cluster overview.">
              <Textarea value={draft.summary} rows={3} onChange={event => update({ summary: event.detail.value })} />
            </FormField>
          </SpaceBetween>
        </Container>
      ),
    },
    {
      title: 'Choose capacity',
      summary: `${tiers.find(tier => tier.value === draft.tier)?.label} · ${draft.nodes} nodes`,
      info: <InfoLink />,
      description: 'Capacity is checked against your quota before you continue.',
      errorText: activeStepIndex === 1 ? errorText : undefined,
      content: (
        <SpaceBetween size="l">
          <Container heading="Tier">
            <FormField label="Pricing tier">
              <RadioGroup value={draft.tier} items={tiers} onChange={event => update({ tier: event.detail.value })} />
            </FormField>
          </Container>
          <Container heading="Nodes">
            <SpaceBetween size="l">
              <FormField
                label="Number of nodes"
                errorText={fieldError('nodes')}
                warningText={Number(draft.nodes) > 50 ? 'Large clusters take several minutes to start.' : undefined}
              >
                <Input type="number" value={draft.nodes} onChange={event => update({ nodes: event.detail.value })} />
              </FormField>
              <Toggle
                checked={draft.autoscale}
                description="Adds nodes when load stays high for 10 minutes."
                onChange={event => update({ autoscale: event.detail.checked })}
              >
                Scale automatically
              </Toggle>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      ),
    },
    {
      title: 'Add tags',
      summary: draft.tags.map(tag => `${tag.key}=${tag.value}`).join(', ') || 'No tags',
      info: <InfoLink />,
      description: 'Tags help you find the cluster and split its cost. You can add them later.',
      isOptional: true,
      content: (
        <Container heading="Tags" measure={`(${draft.tags.length})`}>
          <SpaceBetween size="m">
            {draft.tags.map((tag, index) => (
              <ColumnLayout key={index} columns={3}>
                <FormField label="Key">
                  <Input
                    value={tag.key}
                    onChange={event =>
                      update({ tags: draft.tags.map((t, i) => (i === index ? { ...t, key: event.detail.value } : t)) })
                    }
                  />
                </FormField>
                <FormField label="Value">
                  <Input
                    value={tag.value}
                    onChange={event =>
                      update({
                        tags: draft.tags.map((t, i) => (i === index ? { ...t, value: event.detail.value } : t)),
                      })
                    }
                  />
                </FormField>
                <div className={styles['tag-remove']}>
                  <Button formAction="none" onClick={() => update({ tags: draft.tags.filter((_, i) => i !== index) })}>
                    Remove
                  </Button>
                </div>
              </ColumnLayout>
            ))}
            <Button
              formAction="none"
              iconName="add"
              onClick={() => update({ tags: [...draft.tags, { key: '', value: '' }] })}
            >
              Add tag
            </Button>
          </SpaceBetween>
        </Container>
      ),
    },
    {
      title: 'Set up notifications',
      summary: draft.notify ? draft.email || 'No address' : 'Off',
      info: <InfoLink />,
      description: 'Choose who hears about changes to the cluster.',
      isOptional: true,
      errorText: activeStepIndex === 3 ? errorText : undefined,
      content: (
        <Container heading="Email">
          <SpaceBetween size="l">
            <Checkbox checked={draft.notify} onChange={event => update({ notify: event.detail.checked })}>
              Send email notifications
            </Checkbox>
            <FormField label="Address" errorText={fieldError('email')}>
              <Input
                type="email"
                value={draft.email}
                disabled={!draft.notify}
                placeholder="ops@north-annex.example"
                onChange={event => update({ email: event.detail.value })}
              />
            </FormField>
            <Checkbox
              checked={draft.onFailure}
              disabled={!draft.notify}
              description="Sent when a node fails its health check."
              onChange={event => update({ onFailure: event.detail.checked })}
            >
              Failures only
            </Checkbox>
          </SpaceBetween>
        </Container>
      ),
    },
    {
      title: 'Review and create',
      description: 'Check the settings. You can change capacity, tags and notifications after creating the cluster.',
      content: (
        <SpaceBetween size="l">
          {[
            {
              title: 'Step 1: Cluster details',
              index: 0,
              items: [
                { label: 'Name', value: draft.name || '-' },
                { label: 'Region', value: draft.region?.label ?? '-' },
                { label: 'Summary', value: draft.summary || '-' },
              ],
            },
            {
              title: 'Step 2: Capacity',
              index: 1,
              items: [
                { label: 'Tier', value: tiers.find(tier => tier.value === draft.tier)?.label },
                { label: 'Nodes', value: draft.nodes },
                {
                  label: 'Autoscaling',
                  value: (
                    <StatusIndicator type={draft.autoscale ? 'success' : 'stopped'}>
                      {draft.autoscale ? 'On' : 'Off'}
                    </StatusIndicator>
                  ),
                },
              ],
            },
            {
              title: 'Step 3: Tags',
              index: 2,
              items: draft.tags.length
                ? draft.tags.map(tag => ({ label: tag.key || '(no key)', value: tag.value || '-' }))
                : [{ label: 'Tags', value: 'None' }],
            },
            {
              title: 'Step 4: Notifications',
              index: 3,
              items: [
                { label: 'Email', value: draft.notify ? draft.email || '-' : 'Off' },
                { label: 'Failures only', value: draft.notify && draft.onFailure ? 'Yes' : 'No' },
              ],
            },
          ].map(section => (
            <Container
              key={section.title}
              heading={section.title}
              actions={
                <Button formAction="none" onClick={() => setActiveStepIndex(section.index)}>
                  Edit
                </Button>
              }
            >
              <KeyValuePairs columns={3} items={section.items} />
            </Container>
          ))}
        </SpaceBetween>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.controls}>
        <SegmentedControl
          label="Layout"
          selectedId={variant}
          options={[
            { id: 'checklist', text: 'Checklist' },
            { id: 'steps', text: 'Steps' },
          ]}
          onChange={event => setVariant(event.detail.selectedId as WizardProps.Variant)}
        />
        <Toggle checked={allowSkipTo} onChange={event => setAllowSkipTo(event.detail.checked)}>
          Allow skipping optional steps (steps layout)
        </Toggle>
        <Box variant="small" color="text-body-secondary">
          Events: {log.join(', ') || 'none'}
        </Box>
      </div>
      {submitted && (
        <Alert
          type={submitted === 'created' ? 'success' : 'info'}
          header={submitted === 'created' ? `Cluster ${draft.name} is being created` : 'Cancelled'}
          dismissible={true}
          onDismiss={() => setSubmitted(null)}
        >
          {submitted === 'created' ? 'It takes about four minutes.' : 'The draft was discarded.'}
        </Alert>
      )}
      <Wizard
        variant={variant}
        steps={steps}
        activeStepIndex={activeStepIndex}
        allowSkipTo={allowSkipTo}
        isLoadingNextStep={loading}
        submitButtonText="Create cluster"
        secondaryActions={
          <Button variant="link" formAction="none">
            Save draft
          </Button>
        }
        onNavigate={onNavigate}
        onCancel={() => {
          setSubmitted('cancelled');
          setDraft(initialDraft);
          setErrors({});
          setActiveStepIndex(0);
        }}
        onSubmit={() => setSubmitted('created')}
        aside={
          <Container heading="Summary">
            <KeyValuePairs
              columns={1}
              items={[
                { label: 'Name', value: draft.name || '-' },
                { label: 'Region', value: draft.region?.label ?? '-' },
                { label: 'Nodes', value: draft.nodes },
              ]}
            />
          </Container>
        }
      />
    </div>
  );
}
