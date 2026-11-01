// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import FormField from '../../../lib/components/form-field';
import I18nProvider from '../../../lib/components/i18n';
import Input from '../../../lib/components/input';
import Journey, { JourneyProps } from '../../../lib/components/journey';
import createWrapper from '../../../lib/components/test-utils/dom';
import Tiles from '../../../lib/components/tiles';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Choice() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Tiles
      value={value}
      onChange={event => setValue(event.detail.value)}
      items={[
        { value: 'kitchen', label: 'A kitchen' },
        { value: 'bathroom', label: 'A bathroom' },
      ]}
    />
  );
}

const steps: JourneyProps.Step[] = [
  { id: 'room', question: 'What would you like to change?', description: 'Pick one.', content: <Choice /> },
  {
    id: 'notes',
    question: 'Anything we should know?',
    isOptional: true,
    content: (
      <FormField label="Notes">
        <Input value="" onChange={() => {}} />
      </FormField>
    ),
  },
  { id: 'contact', question: 'Where can we reach you?', content: <p>Contact fields</p> },
];

const wrapper = () => createWrapper().findJourney()!;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Journey', () => {
  test('shows the first question as a level 2 heading, with its description and counter', () => {
    render(<Journey steps={steps} />);
    const heading = screen.getByRole('heading', { level: 2, name: 'What would you like to change?' });
    expect(heading).toHaveAccessibleDescription('Question 1 of 3');
    expect(wrapper().findDescription()!.getText()).toBe('Pick one.');
    expect(wrapper().findCounter().getText()).toBe('Question 1 of 3');
    expect(wrapper().findBackButton()).toBeNull();
    expect(wrapper().findContinueButton().getText()).toBe('Continue');
  });

  test('draws the progress as a ruler hidden from assistive technology', () => {
    render(<Journey steps={steps} activeStepIndex={1} />);
    const ruler = wrapper().findProgress().getElement();
    expect(ruler).toHaveAttribute('aria-hidden', 'true');
    expect(ruler.children).toHaveLength(3);
  });

  test('moves on its own when uncontrolled, reports each move and focuses the new question', () => {
    const onNavigate = vi.fn();
    render(<Journey steps={steps} onNavigate={event => onNavigate(event.detail)} />);
    wrapper().findContinueButton().click();
    expect(onNavigate).toHaveBeenLastCalledWith({ requestedStepIndex: 1, reason: 'next' });
    const heading = screen.getByRole('heading', { name: 'Anything we should know?' });
    expect(heading).toHaveFocus();
    expect(wrapper().findOptionalLabel()!.getText()).toBe('Optional');

    wrapper().findBackButton()!.click();
    expect(onNavigate).toHaveBeenLastCalledWith({ requestedStepIndex: 0, reason: 'back' });
    expect(screen.getByRole('heading', { name: 'What would you like to change?' })).toHaveFocus();
  });

  test('does not move focus on the first render', () => {
    render(<Journey steps={steps} />);
    expect(document.body).toHaveFocus();
  });

  test('stays on the question when controlled until the consumer moves it', () => {
    const onNavigate = vi.fn();
    render(<Journey steps={steps} activeStepIndex={0} onNavigate={event => onNavigate(event.detail)} />);
    wrapper().findContinueButton().click();
    expect(onNavigate).toHaveBeenCalledWith({ requestedStepIndex: 1, reason: 'next' });
    expect(wrapper().findQuestion().getText()).toBe('What would you like to change?');
  });

  test('Enter in a text field continues, as in a website form', () => {
    const onNavigate = vi.fn();
    render(<Journey steps={steps} activeStepIndex={1} onNavigate={event => onNavigate(event.detail)} />);
    fireEvent.submit(screen.getByRole('textbox', { name: 'Notes' }).closest('form')!);
    expect(onNavigate).toHaveBeenCalledWith({ requestedStepIndex: 2, reason: 'next' });
  });

  test('the last question finishes with finishButtonText', () => {
    const onFinish = vi.fn();
    const onNavigate = vi.fn();
    render(
      <Journey
        steps={steps}
        activeStepIndex={2}
        finishButtonText="Send my request"
        onFinish={onFinish}
        onNavigate={onNavigate}
      />
    );
    expect(wrapper().findContinueButton().getText()).toBe('Send my request');
    wrapper().findContinueButton().click();
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  test('uses the built-in finish label without finishButtonText', () => {
    render(<Journey steps={steps} activeStepIndex={2} />);
    expect(wrapper().findContinueButton().getText()).toBe('Finish');
  });

  test('loading blocks navigation and finishing', () => {
    const onNavigate = vi.fn();
    const onFinish = vi.fn();
    const { rerender } = render(
      <Journey steps={steps} activeStepIndex={1} isLoading={true} onNavigate={onNavigate} onFinish={onFinish} />
    );
    expect(wrapper().findBackButton()!.getElement()).toBeDisabled();
    wrapper().findContinueButton().click();
    fireEvent.submit(wrapper().getElement());
    expect(onNavigate).not.toHaveBeenCalled();

    rerender(
      <Journey steps={steps} activeStepIndex={2} isLoading={true} onNavigate={onNavigate} onFinish={onFinish} />
    );
    fireEvent.submit(wrapper().getElement());
    expect(onFinish).not.toHaveBeenCalled();
  });

  test('shows a step error in an alert region', () => {
    render(
      <Journey
        steps={steps.map((step, index) => (index === 0 ? { ...step, errorText: 'Choose one to continue.' } : step))}
      />
    );
    expect(wrapper().findError()!.getText()).toBe('Choose one to continue.');
    expect(screen.getByRole('alert')).toHaveTextContent('Choose one to continue.');
    expect(screen.getByRole('img', { name: 'Error' })).toBeInTheDocument();
  });

  test('headingLevel sets the heading element, and an invalid level falls back to 2', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = render(<Journey steps={steps} headingLevel={1} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('What would you like to change?');
    rerender(<Journey steps={steps} headingLevel={9 as JourneyProps.HeadingLevel} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('headingLevel'));
  });

  test('tiles in a question are named and described by the question and take the answer look', () => {
    render(<Journey steps={steps} />);
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAccessibleName('What would you like to change?');
    expect(group).toHaveAccessibleDescription('Pick one.');
    fireEvent.click(screen.getByRole('radio', { name: 'A bathroom' }));
    expect(createWrapper().findTiles()!.getSelectedValue()).toBe('bathroom');
  });

  test('an explicit label on the tiles wins over the question', () => {
    render(
      <Journey
        steps={[
          {
            id: 'room',
            question: 'Which room?',
            content: <Tiles ariaLabel="Room" value={null} items={[{ value: 'a', label: 'A' }]} />,
          },
        ]}
      />
    );
    expect(screen.getByRole('radiogroup')).toHaveAccessibleName('Room');
  });

  test('i18nStrings and the I18nProvider replace the built-in labels', () => {
    const { rerender } = render(
      <Journey
        steps={steps}
        activeStepIndex={1}
        i18nStrings={{
          backButton: 'Previous question',
          continueButton: 'Next question',
          optional: 'Can skip',
          questionCounterText: (number, total) => `${number} / ${total}`,
        }}
      />
    );
    expect(wrapper().findBackButton()!.getText()).toBe('Previous question');
    expect(wrapper().findContinueButton().getText()).toBe('Next question');
    expect(wrapper().findOptionalLabel()!.getText()).toBe('Can skip');
    expect(wrapper().findCounter().getText()).toContain('2 / 3');

    rerender(
      <I18nProvider
        locale="en"
        messages={[
          {
            '@ordinate-ui/components': {
              en: { journey: { questionCounterText: 'Step {questionNumber} out of {questionsCount}' } },
            },
          },
        ]}
      >
        <Journey steps={steps} activeStepIndex={1} />
      </I18nProvider>
    );
    expect(wrapper().findCounter().getText()).toContain('Step 2 out of 3');
  });

  test('renders nothing and warns without steps', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Journey steps={[]} />);
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalled();
  });

  test('passes id and data attributes to the root', () => {
    render(<Journey steps={steps} id="plan" data-testid="journey" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'plan');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'journey');
  });

  test('keyboard: the question takes focus from code but stays out of the Tab order, and Back is not a submit', () => {
    render(<Journey steps={steps} activeStepIndex={1} />);
    const heading = wrapper().findQuestion().getElement();
    expect(heading).toHaveAttribute('tabindex', '-1');
    act(() => heading.focus());
    expect(heading).toHaveFocus();
    expect(wrapper().findBackButton()!.getElement()).toHaveAttribute('type', 'button');
    expect(wrapper().findContinueButton().getElement()).toHaveAttribute('type', 'submit');
  });

  test('has no axe violations', async () => {
    const { container } = render(
      <Journey
        steps={steps.map((step, index) => (index === 0 ? { ...step, errorText: 'Something is wrong.' } : step))}
        activeStepIndex={0}
      />
    );
    await expectNoAxeViolations(container);
  });

  test('has no axe violations on an optional question with fields', async () => {
    const { container } = render(<Journey steps={steps} activeStepIndex={1} />);
    await expectNoAxeViolations(container);
  });
});
