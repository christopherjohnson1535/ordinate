// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AnnotationContext from '~components/annotation-context';
import TutorialPanel, { TutorialPanelProps } from '~components/tutorial-panel';

import styles from './styles.module.scss';

const projectTutorial: TutorialPanelProps.Tutorial = {
  title: 'Set up a project',
  description: 'Name the project, place it in a region and save the settings.',
  learnMoreUrl: 'https://example.com/docs/projects',
  completedScreenDescription: 'The project is set up. New nodes start in the region you chose.',
  tasks: [
    {
      title: 'Describe the project',
      steps: [
        { title: 'Name the project', content: 'Unique within the account.', hotspotId: 'name' },
        { title: 'Choose a region', content: 'Closest to your users.', hotspotId: 'region' },
      ],
    },
    {
      title: 'Save the settings',
      steps: [{ title: 'Save your changes', content: 'Applies to new nodes.', hotspotId: 'save' }],
    },
  ],
};

const tutorials: TutorialPanelProps.Tutorial[] = [
  projectTutorial,
  {
    title: 'Invite a teammate',
    description: 'Give someone else access to the project.',
    completed: true,
    tasks: [{ title: 'Invite', steps: [{ title: 'Send an invite', content: 'By email.', hotspotId: 'invite' }] }],
  },
  {
    title: 'Turn on backups',
    description: 'Keep a nightly copy of the project data.',
    prerequisitesNeeded: true,
    prerequisitesAlert: 'Finish setting up the project first.',
    tasks: [{ title: 'Back up', steps: [{ title: 'Enable', content: 'Tonight.', hotspotId: 'backup' }] }],
  },
];

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <div className={styles.frame}>{children}</div>
    </section>
  );
}

export default function TutorialPanelSimple() {
  return (
    <article className={styles.page}>
      <h1>Tutorial panel</h1>
      <p className={styles.note}>
        Each frame is as wide as the app layout&apos;s help column. The guided help page runs a whole tutorial.
      </p>
      <div className={styles.row}>
        <Frame title="List">
          <AnnotationContext currentTutorial={null}>
            <TutorialPanel tutorials={tutorials} downloadUrl="#tutorial-panel/simple" onFeedbackClick={() => {}} />
          </AnnotationContext>
        </Frame>
        <Frame title="In progress">
          <AnnotationContext currentTutorial={projectTutorial}>
            <TutorialPanel tutorials={tutorials} onFeedbackClick={() => {}} />
          </AnnotationContext>
        </Frame>
        <Frame title="Completed">
          <AnnotationContext currentTutorial={{ ...projectTutorial, completed: true }}>
            <TutorialPanel tutorials={tutorials} />
          </AnnotationContext>
        </Frame>
        <Frame title="Loading">
          <AnnotationContext currentTutorial={null}>
            <TutorialPanel tutorials={[]} loading={true} />
          </AnnotationContext>
        </Frame>
      </div>
    </article>
  );
}
