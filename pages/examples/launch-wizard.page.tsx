// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext, { AnnotationContextProps } from '~components/annotation-context';
import AppLayout from '~components/app-layout';
import Checkbox from '~components/checkbox';
import Container from '~components/container';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import FormField from '~components/form-field';
import Header from '~components/header';
import Hotspot from '~components/hotspot';
import Input from '~components/input';
import KeyValuePairs from '~components/key-value-pairs';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import Textarea from '~components/textarea';
import Tiles from '~components/tiles';
import TutorialPanel from '~components/tutorial-panel';
import Wizard, { WizardProps } from '~components/wizard';

import styles from './launch-wizard.module.scss';

const regions: SelectProps.Option[] = [
  { label: 'us-mountain-1', value: 'us-mountain-1', description: 'Denver' },
  { label: 'us-east-2', value: 'us-east-2', description: 'Columbus' },
  { label: 'eu-west-1', value: 'eu-west-1', description: 'Dublin' },
];

const teams: MultiselectProps.Option[] = [
  { label: 'Platform', value: 'platform' },
  { label: 'Archives', value: 'archives' },
  { label: 'Visitor services', value: 'visitor-services' },
];

interface Draft {
  name: string;
  summary: string;
  region: SelectProps.Option | null;
  tier: string;
  publicEndpoint: boolean;
  allowedRange: string;
  owners: ReadonlyArray<MultiselectProps.Option>;
}

const emptyDraft: Draft = {
  name: '',
  summary: '',
  region: null,
  tier: 'standard',
  publicEndpoint: false,
  allowedRange: '',
  owners: [],
};

function buildTutorial(draft: Draft, completed: boolean): AnnotationContextProps.Tutorial {
  return {
    title: 'Launch your first project',
    description: 'Walk through the launch wizard with notes pinned to the fields that matter.',
    completedScreenDescription: 'The project is ready to launch. Review it once more, then choose Launch project.',
    completed,
    tasks: [
      {
        title: 'Describe the project',
        steps: [
          {
            title: 'Name the project',
            content: 'The name appears in the console and in every address the project serves.',
            hotspotId: 'launch-name',
            warningAlert: draft.name.trim() ? undefined : 'Enter a name before you go on.',
          },
        ],
      },
      {
        title: 'Place it',
        steps: [
          {
            title: 'Choose a region',
            content: 'Go to step 2 and pick the region closest to the people who use the project.',
            hotspotId: 'launch-region',
            warningAlert: draft.region ? undefined : 'No region is selected yet.',
          },
        ],
      },
      {
        title: 'Review and launch',
        steps: [
          {
            title: 'Check the summary',
            content: 'The last step lists everything you chose. Use Edit on a section to go back to it.',
            hotspotId: 'launch-review',
          },
        ],
      },
    ],
  };
}

function useSteps(draft: Draft, update: (patch: Partial<Draft>) => void, showErrors: boolean) {
  const nameError =
    showErrors && !/^[a-z0-9-]+$/.test(draft.name) ? 'Use lowercase letters, numbers and hyphens.' : undefined;
  const regionError = showErrors && !draft.region ? 'Choose a region.' : undefined;

  const steps: WizardProps.Step[] = [
    {
      title: 'Describe the project',
      description: 'Names cannot be changed after launch.',
      content: (
        <Container>
          <SpaceBetween size="l">
            <Hotspot hotspotId="launch-name">
              <FormField
                label="Project name"
                constraintText="Lowercase letters, numbers and hyphens."
                errorText={nameError}
              >
                <Input
                  value={draft.name}
                  placeholder="north-annex"
                  onChange={event => update({ name: event.detail.value })}
                />
              </FormField>
            </Hotspot>
            <FormField label="Summary" description="Shown on the project overview.">
              <Textarea value={draft.summary} rows={3} onChange={event => update({ summary: event.detail.value })} />
            </FormField>
          </SpaceBetween>
        </Container>
      ),
    },
    {
      title: 'Choose where it runs',
      content: (
        <Container>
          <SpaceBetween size="l">
            <Hotspot hotspotId="launch-region" direction="bottom">
              <FormField label="Region" errorText={regionError}>
                <Select
                  options={regions}
                  selectedOption={draft.region}
                  placeholder="Choose a region"
                  onChange={event => update({ region: event.detail.selectedOption })}
                />
              </FormField>
            </Hotspot>
            <FormField label="Tier">
              <Tiles
                value={draft.tier}
                onChange={event => update({ tier: event.detail.value })}
                items={[
                  { value: 'standard', label: 'Standard', description: 'Billed per hour.' },
                  { value: 'reserved', label: 'Reserved', description: 'Billed yearly, about 30% less.' },
                ]}
              />
            </FormField>
          </SpaceBetween>
        </Container>
      ),
    },
    {
      title: 'Configure networking',
      isOptional: true,
      content: (
        <Container>
          <SpaceBetween size="l">
            <Checkbox
              checked={draft.publicEndpoint}
              onChange={event => update({ publicEndpoint: event.detail.checked })}
              description="Reachable from the internet over HTTPS."
            >
              Public endpoint
            </Checkbox>
            <FormField label="Allowed address range" constraintText="CIDR notation, such as 10.0.0.0/16.">
              <Input value={draft.allowedRange} onChange={event => update({ allowedRange: event.detail.value })} />
            </FormField>
          </SpaceBetween>
        </Container>
      ),
    },
    {
      title: 'Set owners',
      isOptional: true,
      content: (
        <Container>
          <FormField label="Owning teams" description="Owners are paged when the project is unhealthy.">
            <Multiselect
              options={teams}
              selectedOptions={draft.owners}
              placeholder="Choose teams"
              onChange={event => update({ owners: event.detail.selectedOptions })}
            />
          </FormField>
        </Container>
      ),
    },
    {
      title: 'Review and launch',
      content: (
        <Hotspot hotspotId="launch-review">
          <SpaceBetween size="l">
            <Container header={<Header>Project</Header>}>
              <KeyValuePairs
                columns={3}
                items={[
                  { label: 'Name', value: draft.name || '-' },
                  { label: 'Region', value: draft.region?.label ?? '-' },
                  { label: 'Tier', value: draft.tier === 'reserved' ? 'Reserved' : 'Standard' },
                ]}
              />
            </Container>
            <Container header={<Header>Networking and owners</Header>}>
              <KeyValuePairs
                columns={3}
                items={[
                  { label: 'Public endpoint', value: draft.publicEndpoint ? 'On' : 'Off' },
                  { label: 'Allowed range', value: draft.allowedRange || 'Any' },
                  { label: 'Owners', value: draft.owners.map(owner => owner.label).join(', ') || 'None' },
                ]}
              />
            </Container>
          </SpaceBetween>
        </Hotspot>
      ),
    },
  ];
  const stepIsValid = (index: number) =>
    (index !== 0 || /^[a-z0-9-]+$/.test(draft.name)) && (index !== 1 || Boolean(draft.region));
  return { steps, stepIsValid };
}

// The phase 5 gate: a five-step wizard with guided help, built only from Ordinate.
export default function LaunchWizard() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [flashes, setFlashes] = useState<FlashbarProps.MessageDefinition[]>([]);

  const update = (patch: Partial<Draft>) => setDraft(current => ({ ...current, ...patch }));
  const { steps, stepIsValid } = useSteps(draft, update, showErrors);
  const tutorial = buildTutorial(draft, tutorialCompleted);

  const navigate: WizardProps['onNavigate'] = event => {
    const { requestedStepIndex } = event.detail;
    if (requestedStepIndex > activeStepIndex && !stepIsValid(activeStepIndex)) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setActiveStepIndex(requestedStepIndex);
  };

  return (
    <AnnotationContext
      currentTutorial={tutorialActive ? tutorial : null}
      onStartTutorial={() => {
        setTutorialActive(true);
        setTutorialCompleted(false);
      }}
      onExitTutorial={() => setTutorialActive(false)}
      onFinish={() => setTutorialCompleted(true)}
    >
      <div className={styles.region}>
        <AppLayout
          disableBodyScroll={true}
          contentType="wizard"
          navigationHide={true}
          notifications={<Flashbar items={flashes} />}
          tools={<TutorialPanel tutorials={[tutorial]} />}
          toolsOpen={toolsOpen}
          onToolsChange={event => setToolsOpen(event.detail.open)}
          content={
            <Wizard
              steps={steps}
              activeStepIndex={activeStepIndex}
              onNavigate={navigate}
              allowSkipTo={true}
              submitButtonText="Launch project"
              onCancel={() => {
                setDraft(emptyDraft);
                setActiveStepIndex(0);
              }}
              onSubmit={() =>
                setFlashes([
                  {
                    id: 'launched',
                    type: 'success',
                    header: `${draft.name} is launching`,
                    content: 'Nodes start in the order you chose. This takes about two minutes.',
                    dismissible: true,
                    onDismiss: () => setFlashes([]),
                  },
                ])
              }
            />
          }
        />
      </div>
    </AnnotationContext>
  );
}
