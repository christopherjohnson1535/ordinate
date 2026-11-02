// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import AnnotationContext from '../../../lib/components/annotation-context';
import Hotspot from '../../../lib/components/hotspot';
import I18nProvider from '../../../lib/components/i18n';
import createWrapper from '../../../lib/components/test-utils/dom';
import TutorialPanel, { TutorialPanelProps } from '../../../lib/components/tutorial-panel';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const projectTutorial: TutorialPanelProps.Tutorial = {
  title: 'Create a project',
  description: 'Name a project and save it.',
  learnMoreUrl: 'https://example.com/projects',
  completedScreenDescription: 'Your project is ready.',
  tasks: [
    {
      title: 'Name it',
      steps: [
        { title: 'Enter a name', content: 'Names are unique.', hotspotId: 'name' },
        { title: 'Pick a region', content: 'The closest one.', hotspotId: 'region' },
      ],
    },
    { title: 'Save', steps: [{ title: 'Save it', content: 'Choose save.', hotspotId: 'save' }] },
  ],
};

const billingTutorial: TutorialPanelProps.Tutorial = {
  title: 'Set up billing',
  tasks: [{ title: 'Billing', steps: [{ title: 'Add a card', content: 'Any card.', hotspotId: 'save' }] }],
  prerequisitesNeeded: true,
  prerequisitesAlert: 'Create a project first.',
};

interface AppProps extends Partial<TutorialPanelProps> {
  onStart?: () => void;
  onExit?: () => void;
}

// Holds the tutorials the way an application would: it starts, completes and exits them.
function App({ onStart, onExit, ...panelProps }: AppProps) {
  const [tutorials, setTutorials] = useState([projectTutorial, billingTutorial]);
  const [current, setCurrent] = useState<TutorialPanelProps.Tutorial | null>(null);
  return (
    <AnnotationContext
      currentTutorial={current}
      onStartTutorial={event => {
        onStart?.();
        setCurrent({ ...event.detail.tutorial, completed: false });
      }}
      onExitTutorial={() => {
        onExit?.();
        setCurrent(null);
      }}
      onFinish={() => {
        setCurrent(value => value && { ...value, completed: true });
        setTutorials(list =>
          list.map(entry => (entry.title === current?.title ? { ...entry, completed: true } : entry))
        );
      }}
    >
      <Hotspot hotspotId="name" />
      <Hotspot hotspotId="region" />
      <Hotspot hotspotId="save" />
      <TutorialPanel tutorials={tutorials} {...panelProps} />
    </AnnotationContext>
  );
}

const root = () => createWrapper();
const panel = () => root().findTutorialPanel()!;
const annotation = () => root().findAnnotationContext();

describe('TutorialPanel', () => {
  test('lists the tutorials', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 2, name: 'Tutorials' })).toBeInTheDocument();
    const [project, billing] = panel().findTutorials();
    expect(project.findTitle().getText()).toBe('Create a project');
    expect(project.findDescription()!.getText()).toBe('Name a project and save it.');
    expect(project.findStartButton().getElement()).toHaveTextContent('Start tutorial');
    expect(project.findLearnMoreLink()!.getElement()).toHaveAttribute('href', 'https://example.com/projects');
    expect(project.findPrerequisitesAlert()).toBeNull();
    expect(billing.findPrerequisitesAlert()!.getText()).toContain('Create a project first.');
    expect(billing.findStartButton().isDisabled()).toBe(true);
    expect(panel().findTasks()).toEqual([]);
  });

  test('links the printable version and the feedback form', () => {
    const onFeedbackClick = vi.fn();
    render(<App downloadUrl="/tutorials.pdf" onFeedbackClick={onFeedbackClick} />);
    expect(panel().findDownloadLink()!.getElement()).toHaveAttribute('href', '/tutorials.pdf');
    panel().findFeedbackLink()!.click();
    expect(onFeedbackClick).toHaveBeenCalledTimes(1);
  });

  test('leaves out the download and feedback links when not set', () => {
    render(<App />);
    expect(panel().findDownloadLink()).toBeNull();
    expect(panel().findFeedbackLink()).toBeNull();
  });

  test('shows a loading status', () => {
    render(<App loading={true} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading tutorials');
    expect(panel().findLoadingStatus()).not.toBeNull();
    expect(panel().findTutorials()).toEqual([]);
  });

  test('runs a tutorial from start to finish', () => {
    const onStart = vi.fn();
    const onExit = vi.fn();
    render(<App onStart={onStart} onExit={onExit} />);

    panel().findTutorials()[0].findStartButton().click();
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(panel().findHeader()!.getText()).toBe('Create a project');
    expect(annotation()!.getElement()).toHaveFocus();

    const [first, second] = panel().findTasks();
    expect(first.findTitle().getText()).toBe('Task 1: Name it');
    expect(first.findStatus().getText()).toBe('In progress');
    expect(first.findTotalSteps().getText()).toBe('2 steps');
    expect(first.findCurrentStep()!.getText()).toContain('Enter a name');
    expect(first.findCurrentStep()!.getElement()).toHaveAttribute('aria-current', 'step');
    expect(second.findStatus().getText()).toBe('Not started');
    expect(second.findTotalSteps().getText()).toBe('1 step');
    expect(first.findStepReferences().map(reference => reference.getText())).toEqual(['S1', 'S2']);
    expect(panel().findProgress()!.getText()).toBe('0 / 3');

    annotation()!.findNextButton()!.click();
    expect(panel().findTasks()[0].findCurrentStep()!.getText()).toContain('Pick a region');
    expect(panel().findProgress()!.getText()).toBe('1 / 3');
    annotation()!.findNextButton()!.click();
    expect(panel().findTasks()[0].findStatus().getText()).toBe('Done');
    expect(panel().findTasks()[1].findStatus().getText()).toBe('In progress');

    annotation()!.findFinishButton()!.click();
    const completion = panel().findCompletionScreen()!;
    expect(completion.getText()).toContain('Tutorial completed');
    expect(completion.getText()).toContain('Your project is ready.');
    expect(screen.getByRole('heading', { level: 3, name: 'Tutorial completed' })).toHaveFocus();
    expect(
      panel()
        .findTasks()
        .map(task => task.findStatus().getText())
    ).toEqual(['Done', 'Done']);
    expect(panel().findProgress()!.getText()).toBe('3 / 3');

    panel().findExitButton()!.click();
    expect(onExit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('heading', { level: 2, name: 'Tutorials' })).toHaveFocus();
    const project = panel().findTutorials()[0];
    expect(project.findCompletedBadge()!.getText()).toBe('Completed');
    expect(project.findStartButton().getElement()).toHaveTextContent('Restart tutorial');
  });

  test('restarts a completed tutorial from its first step', () => {
    render(<App />);
    panel().findTutorials()[0].findStartButton().click();
    annotation()!.findNextButton()!.click();
    annotation()!.findNextButton()!.click();
    annotation()!.findFinishButton()!.click();
    panel().findExitButton()!.click();
    panel().findTutorials()[0].findStartButton().click();
    expect(annotation()!.findStepTitle().getText()).toBe('Enter a name');
    expect(panel().findCompletionScreen()).toBeNull();
  });

  test('takes its text from i18nStrings, then from an I18nProvider', () => {
    const { rerender } = render(
      <App
        i18nStrings={{
          tutorialListTitle: 'Guides',
          startTutorialButtonText: 'Begin',
          totalStepsText: count => `${count} parts`,
          labelsTaskStatus: { inProgress: 'Underway' },
        }}
      />
    );
    expect(panel().findHeader()!.getText()).toBe('Guides');
    panel().findTutorials()[0].findStartButton().click();
    expect(panel().findTasks()[0].findTotalSteps().getText()).toBe('2 parts');
    expect(panel().findTasks()[0].findStatus().getText()).toBe('Underway');
    rerender(
      <I18nProvider
        locale="de"
        messages={[{ '@ordinate/components': { de: { 'tutorial-panel': { tutorialListTitle: 'Anleitungen' } } } }]}
      >
        <TutorialPanel tutorials={[projectTutorial]} />
      </I18nProvider>
    );
    expect(panel().findHeader()!.getText()).toBe('Anleitungen');
  });

  test('passes id and data attributes to the root', () => {
    render(<App id="tutorials" data-testid="tutorials" />);
    expect(screen.getByTestId('tutorials')).toHaveAttribute('id', 'tutorials');
  });

  test('has no accessibility violations in the list', async () => {
    const { container } = render(<App downloadUrl="/tutorials.pdf" onFeedbackClick={() => {}} />);
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations during and after a tutorial', async () => {
    const { container } = render(<App />);
    panel().findTutorials()[0].findStartButton().click();
    await expectNoAxeViolations(container);
    annotation()!.findNextButton()!.click();
    annotation()!.findNextButton()!.click();
    annotation()!.findFinishButton()!.click();
    await expectNoAxeViolations(container);
  });
});
