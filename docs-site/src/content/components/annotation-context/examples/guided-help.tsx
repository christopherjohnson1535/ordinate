// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext, { AnnotationContextProps } from '@ordinate/components/annotation-context';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import FormField from '@ordinate/components/form-field';
import Grid from '@ordinate/components/grid';
import Hotspot from '@ordinate/components/hotspot';
import Input from '@ordinate/components/input';
import Select, { SelectProps } from '@ordinate/components/select';
import SpaceBetween from '@ordinate/components/space-between';
import TutorialPanel from '@ordinate/components/tutorial-panel';

const regions: SelectProps.Options = [
  { label: 'us-mountain-1', value: 'us-mountain-1', description: 'Denver' },
  { label: 'eu-west-1', value: 'eu-west-1', description: 'Dublin' },
];

// The steps read the form, so a warning shows in the annotation while a field is empty.
const tutorialFor = (name: string, region: SelectProps.Option | null): AnnotationContextProps.Tutorial => ({
  title: 'Set up a project',
  description: 'Name the project, place it in a region and save the settings.',
  completedScreenDescription: 'The project is set up. New nodes start in the region you chose.',
  tasks: [
    {
      title: 'Describe the project',
      steps: [
        {
          title: 'Name the project',
          content: 'The name appears in the console and in every address the project serves.',
          hotspotId: 'guided-name',
          warningAlert: name.trim() ? undefined : 'Enter a name before you go on.',
        },
        {
          title: 'Choose a region',
          content: 'Pick the region closest to the people who use the project.',
          hotspotId: 'guided-region',
          warningAlert: region ? undefined : 'No region is chosen yet.',
        },
      ],
    },
    {
      title: 'Save the settings',
      steps: [
        { title: 'Save your changes', content: 'Saving applies the settings to new nodes.', hotspotId: 'guided-save' },
      ],
    },
  ],
});

export default function GuidedHelp() {
  const [name, setName] = useState('');
  const [region, setRegion] = useState<SelectProps.Option | null>(null);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const tutorial = { ...tutorialFor(name, region), completed };

  return (
    <AnnotationContext
      currentTutorial={running ? tutorial : null}
      onStartTutorial={() => {
        setRunning(true);
        setCompleted(false);
      }}
      onExitTutorial={() => setRunning(false)}
      onFinish={() => setCompleted(true)}
    >
      <Grid gridDefinition={[{ colspan: { default: 12, s: 8 } }, { colspan: { default: 12, s: 4 } }]}>
        <Container heading="Project settings">
          <SpaceBetween size="l">
            <Hotspot hotspotId="guided-name">
              <FormField label="Project name">
                <Input value={name} placeholder="north-annex" onChange={event => setName(event.detail.value)} />
              </FormField>
            </Hotspot>
            <Hotspot hotspotId="guided-region" direction="bottom">
              <FormField label="Region">
                <Select
                  options={regions}
                  selectedOption={region}
                  placeholder="Choose a region"
                  onChange={event => setRegion(event.detail.selectedOption)}
                />
              </FormField>
            </Hotspot>
            <Hotspot hotspotId="guided-save" direction="right">
              <Button variant="primary">Save changes</Button>
            </Hotspot>
          </SpaceBetween>
        </Container>
        <TutorialPanel tutorials={[tutorial]} />
      </Grid>
    </AnnotationContext>
  );
}
