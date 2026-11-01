// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Button from '../../../lib/components/button';
import FormField from '../../../lib/components/form-field';
import I18nProvider from '../../../lib/components/i18n';
import PromptInput, { PromptInputProps } from '../../../lib/components/prompt-input';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Controlled({ initial = '', ...rest }: Partial<PromptInputProps> & { initial?: string }) {
  const [value, setValue] = useState(initial);
  return <PromptInput ariaLabel="Prompt" {...rest} value={value} onChange={event => setValue(event.detail.value)} />;
}

const getWrapper = () => createWrapper(document.body).findPromptInput()!;

describe('PromptInput', () => {
  test('renders a textarea with a send button', () => {
    render(<PromptInput value="" ariaLabel="Prompt" placeholder="Ask a question" />);
    const textarea = screen.getByRole('textbox', { name: 'Prompt' });
    expect(textarea).toHaveAttribute('placeholder', 'Ask a question');
    expect(textarea).toHaveAttribute('rows', '1');
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  test('typing fires onChange', () => {
    const onChange = vi.fn();
    render(<PromptInput value="" ariaLabel="Prompt" onChange={event => onChange(event.detail)} />);
    getWrapper().setTextareaValue('Hello');
    expect(onChange).toHaveBeenCalledWith({ value: 'Hello' });
  });

  test('Enter fires onAction with the value and adds no line break', () => {
    const onAction = vi.fn();
    render(<Controlled initial="Deploy it" onAction={event => onAction(event.detail)} />);
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    getWrapper().findNativeTextarea().fireEvent(event);
    expect(onAction).toHaveBeenCalledWith({ value: 'Deploy it' });
    expect(event.defaultPrevented).toBe(true);
  });

  test('Shift+Enter starts a new line instead of sending', () => {
    const onAction = vi.fn();
    render(<Controlled initial="Line" onAction={onAction} />);
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true, cancelable: true });
    getWrapper().findNativeTextarea().fireEvent(event);
    expect(onAction).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  test('ignores Enter while an input method is composing', () => {
    const onAction = vi.fn();
    render(<Controlled initial="漢" onAction={onAction} />);
    getWrapper().pressEnter({ isComposing: true });
    expect(onAction).not.toHaveBeenCalled();
  });

  test('clicking the action button fires onAction', () => {
    const onAction = vi.fn();
    render(<Controlled initial="Status?" onAction={event => onAction(event.detail)} />);
    getWrapper().findActionButton().click();
    expect(onAction).toHaveBeenCalledWith({ value: 'Status?' });
  });

  test('onKeyDown can prevent sending', () => {
    const onAction = vi.fn();
    render(
      <Controlled
        initial="Wait"
        onAction={onAction}
        onKeyDown={event => event.detail.key === 'Enter' && event.preventDefault()}
      />
    );
    getWrapper().pressEnter();
    expect(onAction).not.toHaveBeenCalled();
  });

  test('disableActionButton, disabled and readOnly stop sending', () => {
    const onAction = vi.fn();
    const { rerender } = render(<PromptInput value="x" ariaLabel="Prompt" onAction={onAction} disableActionButton />);
    expect(getWrapper().findActionButton().isDisabled()).toBe(true);
    getWrapper().pressEnter();

    rerender(<PromptInput value="x" ariaLabel="Prompt" onAction={onAction} disabled />);
    expect(getWrapper().isDisabled()).toBe(true);
    expect(getWrapper().findActionButton().isDisabled()).toBe(true);

    rerender(<PromptInput value="x" ariaLabel="Prompt" onAction={onAction} readOnly />);
    expect(getWrapper().isReadOnly()).toBe(true);
    getWrapper().pressEnter();
    expect(onAction).not.toHaveBeenCalled();
  });

  test('sets the action icon and accessible name', () => {
    render(
      <PromptInput value="" ariaLabel="Prompt" actionButtonIconName="arrow-up" actionButtonAriaLabel="Submit prompt" />
    );
    expect(screen.getByRole('button', { name: 'Submit prompt' })).toBeInTheDocument();
  });

  test('reads the action button name from the i18n provider', () => {
    const messages = { '@ordinate-ui/components': { de: { 'prompt-input': { actionButtonAriaLabel: 'Senden' } } } };
    render(
      <I18nProvider locale="de" messages={[messages]}>
        <PromptInput value="" ariaLabel="Prompt" />
      </I18nProvider>
    );
    expect(screen.getByRole('button', { name: 'Senden' })).toBeInTheDocument();
  });

  test('renders the secondary slots and moves the action button below the text', () => {
    render(
      <PromptInput
        value=""
        ariaLabel="Prompt"
        secondaryContent={<span>report.pdf</span>}
        secondaryActions={<Button variant="icon" iconName="upload" ariaLabel="Attach" />}
      />
    );
    const wrapper = getWrapper();
    expect(wrapper.findSecondaryContent()!.getText()).toBe('report.pdf');
    expect(wrapper.findSecondaryActions()!.find('button')!.getElement()).toHaveAccessibleName('Attach');
    expect(wrapper.findActionButton().getElement().closest('[class*="toolbar"]')).not.toBeNull();
  });

  test('picks up the label, description and error from a form field', () => {
    render(
      <FormField label="Question" description="Ask about your resources." errorText="Too long.">
        <PromptInput value="" />
      </FormField>
    );
    const textarea = screen.getByRole('textbox', { name: 'Question' });
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription(/Too long\. Ask about your resources\./);
  });

  test('ref focuses and selects the text', () => {
    const ref = createRef<PromptInputProps.Ref>();
    render(<PromptInput ref={ref} value="Select me" ariaLabel="Prompt" />);
    ref.current!.focus();
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea).toHaveFocus();
    ref.current!.select();
    expect(textarea.selectionStart).toBe(0);
    expect(textarea.selectionEnd).toBe('Select me'.length);
  });

  test('fires onFocus, onBlur and onKeyUp', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyUp = vi.fn();
    render(<PromptInput value="" ariaLabel="Prompt" onFocus={onFocus} onBlur={onBlur} onKeyUp={onKeyUp} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);
    fireEvent.keyUp(textarea, { key: 'a' });
    fireEvent.blur(textarea);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onKeyUp.mock.calls[0][0].detail).toMatchObject({ key: 'a' });
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('has no axe violations', async () => {
    const { container } = render(
      <FormField label="Question">
        <PromptInput
          value="How many instances are running?"
          secondaryActions={<Button variant="icon" iconName="upload" ariaLabel="Attach" />}
        />
      </FormField>
    );
    await expectNoAxeViolations(container);
  });
});
