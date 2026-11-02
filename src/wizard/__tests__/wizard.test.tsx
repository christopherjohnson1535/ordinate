// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import createWrapper from '../../../lib/components/test-utils/dom';
import BaseWizard, { WizardProps } from '../../../lib/components/wizard';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const steps: WizardProps.Step[] = [
  { title: 'Name the cluster', description: 'Choose a name.', content: <p>Name fields</p> },
  { title: 'Choose capacity', info: <a href="#info">Info</a>, content: <p>Capacity fields</p> },
  { title: 'Add tags', isOptional: true, content: <p>Tag fields</p> },
  { title: 'Set up notifications', isOptional: true, content: <p>Notification fields</p> },
  { title: 'Review', content: <p>Review</p> },
];

// These tests cover the step-by-step layout; wizard-checklist.test.tsx covers the default checklist.
function Wizard(props: WizardProps) {
  return <BaseWizard variant="steps" {...props} />;
}

const wrapper = () => createWrapper().findWizard()!;
const navigationButton = (title: string) =>
  within(screen.getByRole('navigation', { name: 'Steps' })).getByRole('button', { name: new RegExp(title) });

function Controlled(props: Partial<WizardProps> & { onNavigateSpy?: (detail: WizardProps.NavigateDetail) => void }) {
  const { onNavigateSpy, ...rest } = props;
  const [index, setIndex] = useState(props.activeStepIndex ?? 0);
  return (
    <Wizard
      steps={steps}
      {...rest}
      activeStepIndex={index}
      onNavigate={({ detail }) => {
        onNavigateSpy?.(detail);
        setIndex(detail.requestedStepIndex);
      }}
    />
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wizard, steps variant', () => {
  test('renders the first step with its heading, description and content', () => {
    render(<Wizard steps={steps} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Name the cluster' })).toBeInTheDocument();
    expect(wrapper().findHeader().getText()).toContain('Choose a name.');
    expect(wrapper().findContent().getText()).toBe('Name fields');
  });

  test('shows cancel and next on the first step, without previous', () => {
    render(<Wizard steps={steps} />);
    expect(wrapper().findCancelButton().getText()).toBe('Cancel');
    expect(wrapper().findPrimaryButton().getText()).toBe('Next');
    expect(wrapper().findPreviousButton()).toBeNull();
    expect(wrapper().findSkipToButton()).toBeNull();
  });

  test('moves between steps on its own when uncontrolled, and reports each move', () => {
    const onNavigate = vi.fn();
    render(<Wizard steps={steps} onNavigate={event => onNavigate(event.detail)} />);
    wrapper().findPrimaryButton().click();
    expect(onNavigate).toHaveBeenLastCalledWith({ requestedStepIndex: 1, reason: 'next' });
    expect(screen.getByRole('heading', { level: 1, name: 'Choose capacity' })).toBeInTheDocument();
    wrapper().findPreviousButton()!.click();
    expect(onNavigate).toHaveBeenLastCalledWith({ requestedStepIndex: 0, reason: 'previous' });
    expect(screen.getByRole('heading', { level: 1, name: 'Name the cluster' })).toBeInTheDocument();
  });

  test('stays on the step when controlled until the consumer moves it', () => {
    const onNavigate = vi.fn();
    render(<Wizard steps={steps} activeStepIndex={0} onNavigate={event => onNavigate(event.detail)} />);
    wrapper().findPrimaryButton().click();
    expect(onNavigate).toHaveBeenCalledWith({ requestedStepIndex: 1, reason: 'next' });
    expect(screen.getByRole('heading', { level: 1, name: 'Name the cluster' })).toBeInTheDocument();
  });

  test('the last step submits with submitButtonText', () => {
    const onSubmit = vi.fn();
    const onNavigate = vi.fn();
    render(
      <Wizard
        steps={steps}
        activeStepIndex={4}
        submitButtonText="Create cluster"
        onSubmit={onSubmit}
        onNavigate={onNavigate}
      />
    );
    const primary = wrapper().findPrimaryButton();
    expect(primary.getText()).toBe('Create cluster');
    primary.click();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  test('cancel fires onCancel', () => {
    const onCancel = vi.fn();
    render(<Wizard steps={steps} onCancel={onCancel} />);
    wrapper().findCancelButton().click();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('marks the current step and offers only steps already reached', () => {
    render(<Controlled />);
    expect(wrapper().findActiveNavigationItem()!.getText()).toContain('Name the cluster');
    const current = wrapper().findActiveNavigationItem()!.find('[aria-current="step"]')!;
    expect(current.getText()).toContain('Step 1');
    expect(current.getText()).toContain('Name the cluster');
    expect(wrapper().findNavigationLinks()).toHaveLength(0);

    wrapper().findPrimaryButton().click();
    wrapper().findPrimaryButton().click();
    expect(
      wrapper()
        .findNavigationLinks()
        .map(link => link.getElement())
    ).toEqual([navigationButton('Name the cluster'), navigationButton('Choose capacity')]);
  });

  test('labels each step on the scale with its reference, hidden from screen readers', () => {
    render(<Wizard steps={steps} activeStepIndex={1} />);
    expect(wrapper().findStepScale()).not.toBeNull();
    const items = wrapper().findNavigationItems();
    expect(items.map(item => item.getText().match(/S\d/)![0])).toEqual(['S1', 'S2', 'S3', 'S4', 'S5']);
    expect(navigationButton('Name the cluster')).toHaveAccessibleName('Step 1 Name the cluster');
  });

  test('kind and reference mark the step count above the heading', () => {
    render(<Wizard steps={steps} activeStepIndex={1} kind="configuration" reference="C4" />);
    expect(wrapper().findHeader().getText()).toContain('C4 · Step 2 of 5');
    expect(wrapper().getElement().className).toMatch(/kind-configuration/);
  });

  test('stands the actions on the footer rule', () => {
    render(<Wizard steps={steps} activeStepIndex={1} />);
    const footer = wrapper().findFooter()!;
    expect(footer.getElement()).toContainElement(wrapper().findPrimaryButton().getElement());
    expect(footer.getElement()).toContainElement(wrapper().findPreviousButton()!.getElement());
  });

  test('a step reached before can be chosen in the navigation, with the reason step', () => {
    const onNavigateSpy = vi.fn();
    render(<Controlled onNavigateSpy={onNavigateSpy} />);
    wrapper().findPrimaryButton().click();
    wrapper().findPrimaryButton().click();
    fireEvent.click(navigationButton('Name the cluster'));
    expect(onNavigateSpy).toHaveBeenLastCalledWith({ requestedStepIndex: 0, reason: 'step' });
    // Steps reached stay available after going back.
    expect(navigationButton('Add tags')).toBeInTheDocument();
  });

  test('labels optional steps in the heading and the navigation', () => {
    render(<Wizard steps={steps} activeStepIndex={2} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Add tags - optional');
    expect(wrapper().findNavigationItem(4)!.getText()).toContain('optional');
  });

  test('shows the step error above the buttons', () => {
    render(<Wizard steps={[{ ...steps[0], errorText: 'Enter a name.' }, steps[1]]} />);
    expect(wrapper().findError()!.getText()).toBe('Enter a name.');
    expect(screen.getByRole('img', { name: 'Error' })).toBeInTheDocument();
  });

  test('allowSkipTo shows a skip button to the next required step', () => {
    const onNavigateSpy = vi.fn();
    render(<Controlled allowSkipTo={true} onNavigateSpy={onNavigateSpy} />);
    // The step after the active one is required, so there is nothing to skip.
    expect(wrapper().findSkipToButton()).toBeNull();
    wrapper().findPrimaryButton().click();
    const skip = wrapper().findSkipToButton()!;
    expect(skip.getText()).toBe('Skip to Review');
    skip.click();
    expect(onNavigateSpy).toHaveBeenLastCalledWith({ requestedStepIndex: 4, reason: 'skip' });
    expect(screen.getByRole('heading', { level: 1, name: 'Review' })).toBeInTheDocument();
  });

  test('allowSkipTo lets later steps be chosen when the steps before them are optional', () => {
    const onNavigateSpy = vi.fn();
    render(<Controlled allowSkipTo={true} activeStepIndex={2} onNavigateSpy={onNavigateSpy} />);
    fireEvent.click(navigationButton('Review'));
    expect(onNavigateSpy).toHaveBeenLastCalledWith({ requestedStepIndex: 4, reason: 'skip' });
  });

  test('without allowSkipTo, later steps cannot be chosen', () => {
    render(<Wizard steps={steps} activeStepIndex={2} />);
    expect(
      wrapper()
        .findNavigationLinks()
        .map(link => link.getText())
    ).not.toContainEqual(expect.stringContaining('Review'));
  });

  test('while the next step loads, navigation stops and the primary button shows loading', () => {
    const onNavigate = vi.fn();
    render(
      <Wizard steps={steps} activeStepIndex={3} allowSkipTo={true} isLoadingNextStep={true} onNavigate={onNavigate} />
    );
    expect(wrapper().findPrimaryButton().isLoading()).toBe(true);
    expect(wrapper().findPreviousButton()!.isDisabled()).toBe(true);
    expect(wrapper().findNavigationLinks()).toHaveLength(0);
    wrapper().findPrimaryButton().click();
    expect(onNavigate).not.toHaveBeenCalled();
    expect(screen.getByText('Loading next step')).toBeInTheDocument();
  });

  test('moves focus to the heading of the new step', () => {
    render(<Wizard steps={steps} />);
    expect(document.activeElement).toBe(document.body);
    wrapper().findPrimaryButton().click();
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1, name: 'Choose capacity' }));
  });

  test('i18nStrings replace the built-in labels', () => {
    render(
      <Wizard
        steps={steps}
        activeStepIndex={1}
        i18nStrings={{
          cancelButton: 'Discard',
          previousButton: 'Back',
          nextButton: 'Continue',
          navigationAriaLabel: 'Progress',
          stepNumberLabel: stepNumber => `Part ${stepNumber}`,
        }}
      />
    );
    expect(wrapper().findCancelButton().getText()).toBe('Discard');
    expect(wrapper().findPreviousButton()!.getText()).toBe('Back');
    expect(wrapper().findPrimaryButton().getText()).toBe('Continue');
    const navigation = screen.getByRole('navigation', { name: 'Progress' });
    expect(within(navigation).getByRole('button', { name: 'Part 1 Name the cluster' })).toBeInTheDocument();
  });

  test('keeps the scale in a narrow container, with the names kept for screen readers', () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400);
    render(<Controlled activeStepIndex={1} />);
    expect(wrapper().findNavigationToggle()).toBeNull();
    expect(wrapper().findStepScale()!.getElement().className).toMatch(/scale-compact/);
    expect(wrapper().findHeader().getText()).toContain('Step 2 of 5');
    fireEvent.click(navigationButton('Name the cluster'));
    expect(screen.getByRole('heading', { level: 1, name: 'Name the cluster' })).toBeInTheDocument();
  });

  test('shows the step names on the scale in a wide container', () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1000);
    render(<Wizard steps={steps} />);
    expect(wrapper().findStepScale()!.getElement().className).not.toMatch(/scale-compact/);
  });

  test('renders secondary actions', () => {
    render(<Wizard steps={steps} secondaryActions={<button>Save draft</button>} />);
    expect(wrapper().findSecondaryActions()!.getText()).toBe('Save draft');
  });

  test('passes id and data attributes to the root', () => {
    render(<Wizard steps={steps} id="wizard" data-testid="wizard" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'wizard');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'wizard');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Wizard steps={steps} activeStepIndex={2} allowSkipTo={true} />);
    await expectNoAxeViolations(container);
  });
});
