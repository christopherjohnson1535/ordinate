// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import AnnotationContext, { AnnotationContextProps } from '../../../lib/components/annotation-context';
import Hotspot from '../../../lib/components/hotspot';
import I18nProvider from '../../../lib/components/i18n';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const tutorial: AnnotationContextProps.Tutorial = {
  title: 'Create a project',
  tasks: [
    {
      title: 'Name it',
      steps: [
        { title: 'Enter a name', content: 'Names are unique.', hotspotId: 'name' },
        { title: 'Pick a region', content: 'The closest one.', hotspotId: 'region', warningAlert: 'Cannot change.' },
      ],
    },
    { title: 'Save', steps: [{ title: 'Save it', content: 'Choose save.', hotspotId: 'save' }] },
  ],
};

interface HarnessProps extends Partial<AnnotationContextProps> {
  initialTutorial?: AnnotationContextProps.Tutorial | null;
}

function Harness({ initialTutorial = tutorial, onFinish, ...props }: HarnessProps) {
  const [current, setCurrent] = useState(initialTutorial);
  return (
    <AnnotationContext
      currentTutorial={current}
      onFinish={event => {
        onFinish?.(event);
        setCurrent(value => value && { ...value, completed: true });
      }}
      {...props}
    >
      <Hotspot hotspotId="name">
        <label>
          Name <input />
        </label>
      </Hotspot>
      <Hotspot hotspotId="region" direction="bottom">
        <span>Region</span>
      </Hotspot>
      <Hotspot hotspotId="save" side="left" />
    </AnnotationContext>
  );
}

const root = () => createWrapper();
const hotspot = (id: string) => root().findHotspot(`[data-hotspot-id="${id}"]`)!;
const annotation = () => root().findAnnotationContext();

describe('AnnotationContext', () => {
  test('opens the first step at its hotspot', () => {
    render(<Harness />);
    const open = annotation()!;
    expect(hotspot('name').findAnnotation()).not.toBeNull();
    expect(open.findTaskTitle().getText()).toBe('Task 1: Name it');
    expect(open.findStepTitle().getText()).toBe('Enter a name');
    expect(open.findContent().getText()).toBe('Names are unique.');
    expect(open.findStepCounter().getText()).toBe('Step 1 of 2');
    expect(open.findPreviousButton()).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Enter a name' })).toBe(open.getElement());
  });

  test('shows markers for the steps of the current task only', () => {
    render(<Harness />);
    expect(hotspot('name').findMarker()).not.toBeNull();
    expect(hotspot('name').isCurrent()).toBe(true);
    expect(hotspot('region').findMarker()).not.toBeNull();
    expect(hotspot('region').isCurrent()).toBe(false);
    expect(hotspot('save').findMarker()).toBeNull();
  });

  test('renders nothing extra without a tutorial', () => {
    render(<Harness initialTutorial={null} />);
    expect(
      root()
        .findAllHotspots()
        .map(entry => entry.findMarker())
    ).toEqual([null, null, null]);
    expect(annotation()).toBeNull();
    expect(hotspot('name').findContent()!.getText().trim()).toBe('Name');
  });

  test('moves through the steps and tasks with next and previous', () => {
    const onStepChange = vi.fn();
    render(<Harness onStepChange={event => onStepChange(event.detail)} />);
    annotation()!.findNextButton()!.click();
    expect(onStepChange).toHaveBeenLastCalledWith({ step: 1, reason: 'next' });
    expect(hotspot('region').findAnnotation()!.findStepTitle().getText()).toBe('Pick a region');
    expect(annotation()!.findWarningAlert()!.getText()).toContain('Cannot change.');
    expect(hotspot('name').findAnnotation()).toBeNull();

    annotation()!.findNextButton()!.click();
    expect(onStepChange).toHaveBeenLastCalledWith({ step: 2, reason: 'next' });
    const last = hotspot('save').findAnnotation()!;
    expect(last.findTaskTitle().getText()).toBe('Task 2: Save');
    expect(last.findStepCounter().getText()).toBe('Step 1 of 1');
    expect(last.findNextButton()).toBeNull();
    expect(hotspot('name').findMarker()).toBeNull();

    last.findPreviousButton()!.click();
    expect(onStepChange).toHaveBeenLastCalledWith({ step: 1, reason: 'previous' });
    expect(hotspot('region').findAnnotation()).not.toBeNull();
  });

  test('moves focus into the annotation of the new step', () => {
    render(<Harness />);
    annotation()!.findNextButton()!.click();
    expect(annotation()!.getElement()).toHaveFocus();
  });

  test('leaves focus alone when the tutorial is already running on load', () => {
    render(<Harness />);
    expect(annotation()!.getElement()).not.toHaveFocus();
  });

  test('closes with the close button or Escape and returns focus to the marker', () => {
    render(<Harness />);
    annotation()!.findDismissButton().click();
    expect(annotation()).toBeNull();
    const marker = hotspot('name').findMarker()!.getElement();
    expect(marker).toHaveFocus();
    expect(marker).toHaveAttribute('aria-expanded', 'false');
    expect(marker).toHaveAccessibleName('Open annotation for step 1 of 2');

    fireEvent.click(marker);
    expect(marker).toHaveAttribute('aria-expanded', 'true');
    expect(marker).toHaveAccessibleName('Close annotation for step 1 of 2');
    expect(annotation()!.getElement()).toHaveFocus();
    fireEvent.keyDown(annotation()!.getElement(), { key: 'Escape' });
    expect(annotation()).toBeNull();
    expect(marker).toHaveFocus();
  });

  test('opens another step of the task from its marker', () => {
    const onStepChange = vi.fn();
    render(<Harness onStepChange={event => onStepChange(event.detail)} />);
    hotspot('region').findMarker()!.click();
    expect(onStepChange).toHaveBeenCalledWith({ step: 1, reason: 'open' });
    expect(hotspot('region').findAnnotation()).not.toBeNull();
  });

  test('keeps Tab inside the annotation', () => {
    render(<Harness />);
    const panel = annotation()!;
    const next = panel.findNextButton()!.getElement();
    act(() => next.focus());
    fireEvent.keyDown(next, { key: 'Tab' });
    expect(panel.findDismissButton().getElement()).toHaveFocus();
  });

  test('fires onFinish on the last step and hides the markers once completed', () => {
    const onFinish = vi.fn();
    render(<Harness onFinish={onFinish} />);
    hotspot('region').findMarker()!.click();
    annotation()!.findNextButton()!.click();
    annotation()!.findFinishButton()!.click();
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(annotation()).toBeNull();
    expect(
      root()
        .findAllHotspots()
        .map(entry => entry.findMarker())
    ).toEqual([null, null, null]);
  });

  test('starts over when the application sets another tutorial', () => {
    const other: AnnotationContextProps.Tutorial = {
      title: 'Save quickly',
      tasks: [{ title: 'Save', steps: [{ title: 'Save it', content: 'Now.', hotspotId: 'save' }] }],
    };
    const { rerender } = render(<AnnotationContextWithHotspots tutorial={tutorial} />);
    annotation()!.findNextButton()!.click();
    rerender(<AnnotationContextWithHotspots tutorial={other} />);
    expect(hotspot('save').findAnnotation()!.findStepTitle().getText()).toBe('Save it');
  });

  test('takes its text from i18nStrings, then from an I18nProvider', () => {
    const { rerender } = render(
      <Harness
        i18nStrings={{
          nextButtonText: 'Onward',
          stepCounterText: (step, total) => `${step}/${total}`,
          taskTitle: (number, title) => `${number}. ${title}`,
        }}
      />
    );
    expect(annotation()!.findNextButton()!.getElement()).toHaveTextContent('Onward');
    expect(annotation()!.findStepCounter().getText()).toBe('1/2');
    expect(annotation()!.findTaskTitle().getText()).toBe('1. Name it');
    rerender(
      <I18nProvider
        locale="de"
        messages={[{ '@ordinate-ui/components': { de: { 'annotation-context': { nextButtonText: 'Weiter' } } } }]}
      >
        <Harness />
      </I18nProvider>
    );
    expect(annotation()!.findNextButton()!.getElement()).toHaveTextContent('Weiter');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Harness />);
    await expectNoAxeViolations(container);
    annotation()!.findNextButton()!.click();
    await expectNoAxeViolations(container);
  });
});

function AnnotationContextWithHotspots({ tutorial: current }: { tutorial: AnnotationContextProps.Tutorial }) {
  return (
    <AnnotationContext currentTutorial={current}>
      <Hotspot hotspotId="name" />
      <Hotspot hotspotId="region" />
      <Hotspot hotspotId="save" />
    </AnnotationContext>
  );
}
