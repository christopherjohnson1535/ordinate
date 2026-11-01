// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import createWrapper from '../../../lib/components/test-utils/dom';
import Wizard, { WizardProps } from '../../../lib/components/wizard';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const steps: WizardProps.Step[] = [
  {
    title: 'Name the cluster',
    description: 'Choose a name.',
    summary: 'north-annex',
    content: <p>Name fields</p>,
  },
  { title: 'Choose capacity', info: <a href="#info">Info</a>, content: <p>Capacity fields</p> },
  { title: 'Add tags', description: 'Tags help you find it.', isOptional: true, content: <p>Tag fields</p> },
];

const wrapper = () => createWrapper().findWizard()!;

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
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wizard, checklist variant', () => {
  test('is the default: every step is an item in one list, and only the open item shows its content', () => {
    render(<Wizard steps={steps} />);
    const list = screen.getByRole('list', { name: 'Checklist' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('heading', { level: 2, name: 'Step 1 Name the cluster' })).toBeInTheDocument();
    expect(wrapper().findContent().getText()).toBe('Name fields');
    expect(screen.queryByText('Capacity fields')).toBeNull();
    expect(wrapper().findActiveItem()!.getElement()).toHaveAttribute('aria-current', 'step');
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  test('the open item shows its description and info; items not opened yet show their description', () => {
    render(<Wizard steps={steps} activeStepIndex={1} />);
    expect(wrapper().findHeader().getText()).toContain('Info');
    expect(wrapper().findItem(3)!.findSummary()!.getText()).toBe('Tags help you find it.');
    // The first item was never opened, so it shows its description rather than its summary.
    expect(wrapper().findItem(1)!.findSummary()!.getText()).toBe('Choose a name.');
  });

  test('labels optional items in their heading', () => {
    render(<Wizard steps={steps} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Step 3 Add tags - optional' })).toBeInTheDocument();
    expect(wrapper().findItem(3)!.isOptional()).toBe(true);
  });

  test('items open in any order with the reason step, and the open item moves focus to its heading', () => {
    const onNavigateSpy = vi.fn();
    render(<Controlled onNavigateSpy={onNavigateSpy} />);
    const open = wrapper().findItem(3)!.findOpenButton()!;
    expect(open.getElement()).toHaveAccessibleName('Open Add tags');
    open.click();
    expect(onNavigateSpy).toHaveBeenLastCalledWith({ requestedStepIndex: 2, reason: 'step' });
    expect(wrapper().findContent().getText()).toBe('Tag fields');
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 2, name: /Add tags/ }));
  });

  test('an item left behind is checked, folds to its summary and offers Change', () => {
    const onNavigateSpy = vi.fn();
    render(<Controlled onNavigateSpy={onNavigateSpy} />);
    wrapper().findItem(2)!.findOpenButton()!.click();
    const first = wrapper().findItem(1)!;
    expect(first.isChecked()).toBe(true);
    expect(first.findSummary()!.getText()).toBe('north-annex');
    expect(first.findContent()).toBeNull();
    const change = first.findChangeButton()!;
    expect(change.getText()).toBe('Change');
    expect(change.getElement()).toHaveAccessibleName('Change Name the cluster');
    change.click();
    expect(onNavigateSpy).toHaveBeenLastCalledWith({ requestedStepIndex: 0, reason: 'step' });
    // Choice 2 was opened, so it is checked now, with the built-in summary.
    expect(wrapper().findItem(2)!.isChecked()).toBe(true);
    expect(wrapper().findItem(2)!.findSummary()!.getText()).toBe('Done');
  });

  test('the next button opens the following item with the reason next, and the last item has none', () => {
    const onNavigateSpy = vi.fn();
    render(<Controlled onNavigateSpy={onNavigateSpy} />);
    wrapper().findActiveItem()!.findNextButton()!.click();
    expect(onNavigateSpy).toHaveBeenLastCalledWith({ requestedStepIndex: 1, reason: 'next' });
    wrapper().findActiveItem()!.findNextButton()!.click();
    expect(wrapper().findActiveItem()!.findNextButton()).toBeNull();
  });

  test('moves on its own when uncontrolled, and stays put when controlled', () => {
    const onNavigate = vi.fn();
    const { unmount } = render(<Wizard steps={steps} onNavigate={event => onNavigate(event.detail)} />);
    wrapper().findItem(2)!.findOpenButton()!.click();
    expect(wrapper().findContent().getText()).toBe('Capacity fields');
    unmount();
    render(<Wizard steps={steps} activeStepIndex={0} onNavigate={event => onNavigate(event.detail)} />);
    wrapper().findItem(2)!.findOpenButton()!.click();
    expect(wrapper().findContent().getText()).toBe('Name fields');
  });

  test('submits only once every required item has been opened, without opening optional ones', () => {
    const onSubmit = vi.fn();
    render(<Controlled onSubmit={onSubmit} submitButtonText="Create cluster" />);
    const submit = wrapper().findPrimaryButton();
    expect(submit.getText()).toBe('Create cluster');
    expect(submit.isDisabled()).toBe(true);
    expect(wrapper().findStatusLine()!.getText()).toBe('0 of 2 required items checked');
    wrapper().findItem(2)!.findOpenButton()!.click();
    expect(wrapper().findPrimaryButton().isDisabled()).toBe(false);
    expect(wrapper().findStatusLine()!.getText()).toBe('2 of 2 required items checked');
    wrapper().findPrimaryButton().click();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('the submit button says Issue by default', () => {
    render(<Wizard steps={steps} />);
    expect(wrapper().findPrimaryButton().getText()).toBe('Issue');
  });

  test('an error circles the item, counts in the footer, describes the item and stops submitting', () => {
    const errorSteps = steps.map((step, index) =>
      index === 1 ? { ...step, errorText: 'Enter between 1 and 100 nodes.' } : step
    );
    render(<Wizard steps={errorSteps} activeStepIndex={0} />);
    const item = wrapper().findItem(2)!;
    expect(item.findError()!.getText()).toBe('Enter between 1 and 100 nodes.');
    const group = within(item.getElement()).getByRole('group', { name: /Choose capacity/ });
    expect(group).toHaveAccessibleDescription('Error: Enter between 1 and 100 nodes.');
    expect(item.isChecked()).toBe(false);
    expect(wrapper().findStatusLine()!.getText()).toContain('△1 open');
    expect(wrapper().findStatusLine()!.getText()).toContain('1 error to fix');
    expect(wrapper().findPrimaryButton().isDisabled()).toBe(true);
  });

  test('the open item reports its own error through findError', () => {
    render(<Wizard steps={[{ ...steps[0], errorText: 'Enter a name.' }, steps[1]]} />);
    expect(wrapper().findError()!.getText()).toBe('Enter a name.');
  });

  test('announces the count of checked items and errors politely', () => {
    vi.useFakeTimers();
    const { rerender } = render(<Wizard steps={steps} activeStepIndex={1} />);
    act(() => {
      vi.runAllTimers();
    });
    const live = () => wrapper().findStatusLine()!.find('[aria-live="polite"]')!.getElement().textContent;
    expect(live()).toBe('0 of 2 required items checked');
    rerender(
      <Wizard
        steps={steps.map((step, index) => (index === 0 ? { ...step, errorText: 'Enter a name.' } : step))}
        activeStepIndex={1}
      />
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(live()).toBe('0 of 2 required items checked , 1 error to fix');
  });

  test('while the next step loads, items cannot be opened and the sheet cannot be issued', () => {
    const onNavigate = vi.fn();
    render(<Wizard steps={steps} activeStepIndex={0} isLoadingNextStep={true} onNavigate={onNavigate} />);
    expect(wrapper().findActiveItem()!.findNextButton()!.isLoading()).toBe(true);
    expect(wrapper().findItem(2)!.findOpenButton()!.isDisabled()).toBe(true);
    expect(wrapper().findPrimaryButton().isDisabled()).toBe(true);
    wrapper().findActiveItem()!.findNextButton()!.click();
    expect(onNavigate).not.toHaveBeenCalled();
    expect(screen.getByText('Loading next step')).toBeInTheDocument();
  });

  test('cancel fires onCancel, and the footer holds the secondary actions', () => {
    const onCancel = vi.fn();
    render(<Wizard steps={steps} onCancel={onCancel} secondaryActions={<button>Save draft</button>} />);
    wrapper().findCancelButton().click();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(wrapper().findSecondaryActions()!.getText()).toBe('Save draft');
  });

  test('renders the aside beside the sheet, and below it in a narrow container', () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1200);
    const { unmount } = render(<Wizard steps={steps} aside={<p>Summary</p>} />);
    expect(wrapper().findAside()!.getText()).toBe('Summary');
    const wideClasses = wrapper().getElement().classList.length;
    unmount();
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(500);
    render(<Wizard steps={steps} aside={<p>Summary</p>} />);
    expect(wrapper().findAside()!.getText()).toBe('Summary');
    expect(wrapper().getElement().classList.length).toBe(wideClasses - 1);
  });

  test('without an aside there is no side column', () => {
    render(<Wizard steps={steps} />);
    expect(wrapper().findAside()).toBeNull();
  });

  test('ignores allowSkipTo: every item can be opened', () => {
    render(<Wizard steps={steps} allowSkipTo={false} />);
    expect(wrapper().findItem(2)!.findOpenButton()).not.toBeNull();
    expect(wrapper().findItem(3)!.findOpenButton()).not.toBeNull();
    expect(wrapper().findSkipToButton()).toBeNull();
    expect(wrapper().findPreviousButton()).toBeNull();
  });

  test('i18nStrings replace the built-in labels', () => {
    render(
      <Controlled
        steps={steps.map((step, index) => (index === 1 ? { ...step, errorText: 'Too many nodes.' } : step))}
        i18nStrings={{
          checklistAriaLabel: 'Launch list',
          stepNumberLabel: stepNumber => `Part ${stepNumber}`,
          openButton: 'Fill in',
          openButtonAriaLabel: step => `Fill in ${step.title}`,
          changeButton: 'Edit',
          changeButtonAriaLabel: (_, stepNumber) => `Edit part ${stepNumber}`,
          doneSummary: 'Filled in',
          submitButton: 'Launch',
          checkedStatusText: (checked, required) => `${checked}/${required}`,
          openErrorsMarkText: count => `${count} left`,
          openErrorsText: count => `${count} problem`,
        }}
      />
    );
    expect(screen.getByRole('list', { name: 'Launch list' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Part 1 Name the cluster' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fill in Add tags' }));
    expect(screen.getByRole('button', { name: 'Edit part 1' })).toHaveTextContent('Edit');
    expect(wrapper().findPrimaryButton().getText()).toBe('Launch');
    expect(wrapper().findStatusLine()!.getText()).toBe('1/2 · △1 left, 1 problem');
  });

  test('passes id and data attributes to the root', () => {
    render(<Wizard steps={steps} id="wizard" data-testid="wizard" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'wizard');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'wizard');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Wizard
        steps={steps.map((step, index) => (index === 1 ? { ...step, errorText: 'Too many nodes.' } : step))}
        activeStepIndex={2}
        aside={<p>Summary</p>}
        secondaryActions={<button>Save draft</button>}
      />
    );
    await expectNoAxeViolations(container);
  });
});
