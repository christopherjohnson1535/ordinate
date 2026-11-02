// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext, { AnnotationContextProps } from '~components/annotation-context';
import Button from '~components/button';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Hotspot from '~components/hotspot';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import TutorialPanel from '~components/tutorial-panel';

import styles from './styles.module.scss';

const regions: SelectProps.Options = [
  { label: 'us-mountain-1', value: 'us-mountain-1', description: 'Denver' },
  { label: 'us-east-2', value: 'us-east-2', description: 'Columbus' },
  { label: 'eu-west-1', value: 'eu-west-1', description: 'Dublin' },
];

interface FormState {
  name: string;
  region: SelectProps.Option | null;
}

// The steps read the form, so a warning appears in the annotation while a field is left empty.
function buildTutorials({ name, region }: FormState): AnnotationContextProps.Tutorial[] {
  return [
    {
      title: 'Set up a project',
      description: 'Name the project, place it in a region and save the settings.',
      completedScreenDescription: 'The project is set up. New nodes start in the region you chose.',
      learnMoreUrl: 'https://example.com/docs/projects',
      tasks: [
        {
          title: 'Describe the project',
          steps: [
            {
              title: 'Name the project',
              content: 'The name appears in the console and in every address the project serves.',
              hotspotId: 'project-name',
              warningAlert: name.trim() ? undefined : 'Enter a name before you go on.',
            },
            {
              title: 'Choose a region',
              content: 'Pick the region closest to the people who use the project. It cannot be changed later.',
              hotspotId: 'region',
              warningAlert: region ? undefined : 'No region is selected yet.',
            },
          ],
        },
        {
          title: 'Save the settings',
          steps: [
            {
              title: 'Save your changes',
              content: 'Saving applies the settings to new nodes. Running nodes keep theirs until they restart.',
              hotspotId: 'save',
            },
          ],
        },
      ],
    },
    {
      title: 'Turn on backups',
      description: 'Keep a nightly copy of the project data.',
      tasks: [
        {
          title: 'Back up',
          steps: [{ title: 'Save with backups', content: 'Backups start tonight.', hotspotId: 'save' }],
        },
      ],
      prerequisitesNeeded: true,
      prerequisitesAlert: 'Finish setting up the project first.',
    },
  ];
}

// The phase 5 guided help: a settings form with three hotspots and the tutorial panel beside it.
export default function GuidedHelp() {
  const [name, setName] = useState('');
  const [region, setRegion] = useState<SelectProps.Option | null>(null);
  const [backups, setBackups] = useState(false);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [completedTitles, setCompletedTitles] = useState<ReadonlyArray<string>>([]);
  const [currentCompleted, setCurrentCompleted] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const record = (entry: string) => setLog(entries => [entry, ...entries].slice(0, 6));

  const tutorials = buildTutorials({ name, region }).map(tutorial => ({
    ...tutorial,
    completed: completedTitles.includes(tutorial.title),
    prerequisitesNeeded: tutorial.prerequisitesNeeded && !completedTitles.includes('Set up a project'),
  }));
  const found = tutorials.find(tutorial => tutorial.title === currentTitle);
  const currentTutorial = found ? { ...found, completed: currentCompleted } : null;

  return (
    <AnnotationContext
      currentTutorial={currentTutorial}
      onStartTutorial={event => {
        setCurrentTitle(event.detail.tutorial.title);
        setCurrentCompleted(false);
        record(`start: ${event.detail.tutorial.title}`);
      }}
      onExitTutorial={event => {
        setCurrentTitle(null);
        record(`exit: ${event.detail.tutorial.title}`);
      }}
      onStepChange={event => record(`step ${event.detail.step} (${event.detail.reason})`)}
      onFinish={() => {
        setCurrentCompleted(true);
        if (currentTitle) {
          setCompletedTitles(titles => [...titles, currentTitle]);
        }
        record('finish');
      }}
    >
      <div className={styles.layout}>
        <form className={styles.main} onSubmit={event => event.preventDefault()}>
          <SpaceBetween size="l">
            <Header variant="h1" description="Open the tutorial in the help column to be walked through this page.">
              Project settings
            </Header>
            <Container heading="General" description="Where and how the project runs.">
              <div className={styles.fields}>
                <Hotspot hotspotId="project-name">
                  <FormField label="Project name" constraintText="Lowercase letters, numbers and hyphens.">
                    <Input value={name} placeholder="north-annex" onChange={event => setName(event.detail.value)} />
                  </FormField>
                </Hotspot>
                <Hotspot hotspotId="region" direction="bottom">
                  <FormField label="Region">
                    <Select
                      options={regions}
                      selectedOption={region}
                      placeholder="Choose a region"
                      onChange={event => setRegion(event.detail.selectedOption)}
                    />
                  </FormField>
                </Hotspot>
                <Toggle checked={backups} onChange={event => setBackups(event.detail.checked)}>
                  Nightly backups
                </Toggle>
              </div>
            </Container>
            <div className={styles.actions}>
              <Button formAction="none">Cancel</Button>
              <Hotspot hotspotId="save" side="left" direction="left">
                <Button variant="primary" formAction="none">
                  Save changes
                </Button>
              </Hotspot>
            </div>
            <section className={styles.log} aria-label="Event log">
              <h2>Events</h2>
              {log.length === 0 ? <p>No events yet.</p> : log.map((entry, index) => <code key={index}>{entry}</code>)}
            </section>
          </SpaceBetween>
        </form>
        <aside className={styles.help} aria-label="Help">
          <TutorialPanel
            tutorials={tutorials}
            downloadUrl="#annotation-context/guided-help"
            onFeedbackClick={() => record('feedback')}
          />
        </aside>
      </div>
    </AnnotationContext>
  );
}
