// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import TagEditor, { TagEditorProps } from '../../../lib/components/tag-editor';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const savedTags: TagEditorProps.Tag[] = [
  { key: 'team', value: 'platform', existing: true },
  { key: 'cost-center', value: '4410', existing: true },
];

function Editor({
  tags: initial = savedTags,
  onChangeSpy,
  ...rest
}: Partial<TagEditorProps> & { onChangeSpy?: (detail: TagEditorProps.ChangeDetail) => void }) {
  const [tags, setTags] = useState(initial);
  return (
    <TagEditor
      {...rest}
      tags={tags}
      onChange={event => {
        onChangeSpy?.(event.detail);
        setTags(event.detail.tags);
      }}
    />
  );
}

const getWrapper = () => createWrapper(document.body).findTagEditor()!;

describe('TagEditor', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders a row per tag with key and value fields', () => {
    render(<Editor />);
    const rows = getWrapper().findTagRows();
    expect(rows).toHaveLength(2);
    expect(rows[0].findKeyInput()!.findNativeInput().getElement()).toHaveValue('team');
    expect(rows[0].findValueInput()!.findNativeInput().getElement()).toHaveValue('platform');
    expect(rows[0].findField(1)!.getText()).toContain('Key');
    expect(rows[0].findField(2)!.getText()).toContain('Value (optional)');
  });

  test('keys of existing tags are read-only', () => {
    render(<Editor />);
    expect(getWrapper().findTagRow(1)!.findKeyInput()!.findNativeInput().getElement()).toHaveAttribute('readonly');
  });

  test('editing a value fires onChange with the tags and validity', () => {
    const onChange = vi.fn();
    render(<Editor onChangeSpy={onChange} />);
    getWrapper().findTagRow(2)!.findValueInput()!.setInputValue('4420');
    expect(onChange).toHaveBeenLastCalledWith({
      tags: [savedTags[0], { ...savedTags[1], value: '4420' }],
      valid: true,
    });
  });

  test('adding a tag appends an empty new tag and focuses its key', () => {
    const onChange = vi.fn();
    render(<Editor onChangeSpy={onChange} />);
    getWrapper().findAddButton()!.click();
    expect(onChange).toHaveBeenLastCalledWith({
      tags: [...savedTags, { key: '', value: '', existing: false }],
      valid: false,
    });
    expect(getWrapper().findTagRow(3)!.findKeyInput()!.findNativeInput().getElement()).toHaveFocus();
  });

  test('removing an existing tag marks it and Undo restores it', () => {
    const onChange = vi.fn();
    render(<Editor onChangeSpy={onChange} />);
    const row = () => getWrapper().findTagRow(1)!;
    const button = row().findRemoveButton()!;
    expect(button.getElement()).toHaveAccessibleName('Remove tag team');
    button.focus();
    button.click();

    expect(onChange).toHaveBeenLastCalledWith({
      tags: [{ ...savedTags[0], markedForRemoval: true }, savedTags[1]],
      valid: true,
    });
    expect(getWrapper().findTagRows()).toHaveLength(2);
    expect(row().findUndoPrompt()!.getText()).toBe('This tag will be removed when you save changes.');
    expect(row().findValueInput()).toBeNull();
    expect(row().findRemoveButton()!.getText()).toBe('Undo');
    expect(row().findRemoveButton()!.getElement()).toHaveAccessibleName('Undo removal of tag team');
    expect(row().findRemoveButton()!.getElement()).toHaveFocus();

    row().findRemoveButton()!.click();
    expect(onChange).toHaveBeenLastCalledWith({
      tags: [{ ...savedTags[0], markedForRemoval: false }, savedTags[1]],
      valid: true,
    });
    expect(row().findValueInput()).not.toBeNull();
  });

  test('removing a new tag deletes it and announces it', () => {
    vi.useFakeTimers();
    const { container } = render(<Editor tags={[...savedTags, { key: 'stage', value: 'beta', existing: false }]} />);
    act(() => getWrapper().findTagRow(3)!.findRemoveButton()!.click());
    expect(getWrapper().findTagRows()).toHaveLength(2);
    expect(getWrapper().findAddButton()!.getElement()).toHaveFocus();
    act(() => vi.advanceTimersByTime(1000));
    expect(container.querySelector('[aria-live="polite"]')!.textContent).toBe('Tag removed');
  });

  describe('validation', () => {
    test('shows an empty key error once the key is left or a value is typed', () => {
      const onChange = vi.fn();
      render(<Editor tags={[{ key: '', value: '', existing: false }]} onChangeSpy={onChange} />);
      const row = () => getWrapper().findTagRow(1)!;
      expect(row().findField(1)!.findError()).toBeNull();
      fireEvent.blur(row().findKeyInput()!.findNativeInput().getElement());
      expect(row().findField(1)!.findError()!.getText()).toContain('Enter a key.');
    });

    test('an empty key with a value is an error right away', () => {
      const onChange = vi.fn();
      render(<Editor tags={[{ key: '', value: '', existing: false }]} onChangeSpy={onChange} />);
      getWrapper().findTagRow(1)!.findValueInput()!.setInputValue('beta');
      expect(getWrapper().findTagRow(1)!.findField(1)!.findError()!.getText()).toContain('Enter a key.');
      expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ valid: false }));
    });

    test('flags duplicate keys on the later tag', () => {
      render(<Editor tags={[...savedTags, { key: 'team', value: 'data', existing: false }]} />);
      expect(getWrapper().findTagRow(1)!.findField(1)!.findError()).toBeNull();
      expect(getWrapper().findTagRow(3)!.findField(1)!.findError()!.getText()).toContain(
        'You have already used this key.'
      );
    });

    test('a key marked for removal can be reused', () => {
      const onChange = vi.fn();
      render(
        <Editor
          tags={[
            { ...savedTags[0], markedForRemoval: true },
            { key: 'x', value: '', existing: false },
          ]}
          onChangeSpy={onChange}
        />
      );
      getWrapper().findTagRow(2)!.findKeyInput()!.setInputValue('team');
      expect(getWrapper().findTagRow(2)!.findField(1)!.findError()).toBeNull();
      expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ valid: true }));
    });

    test('rejects characters outside the allowed pattern', () => {
      const onChange = vi.fn();
      render(
        <Editor
          tags={[{ key: 'ok', value: '', existing: false }]}
          allowedCharacterPattern={/^[a-z]*$/}
          onChangeSpy={onChange}
        />
      );
      getWrapper().findTagRow(1)!.findKeyInput()!.setInputValue('Not ok');
      getWrapper().findTagRow(1)!.findValueInput()!.setInputValue('#');
      const row = getWrapper().findTagRow(1)!;
      expect(row.findField(1)!.findError()!.getText()).toContain('The key has characters that are not allowed.');
      expect(row.findField(2)!.findError()!.getText()).toContain('The value has characters that are not allowed.');
      expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ valid: false }));
    });

    test('limits key length', () => {
      render(<Editor tags={[{ key: 'k'.repeat(129), value: '', existing: false }]} />);
      expect(getWrapper().findTagRow(1)!.findField(1)!.findError()!.getText()).toContain(
        'Keys can have up to 128 characters.'
      );
    });
  });

  describe('tag limit', () => {
    test('says how many more tags can be added', () => {
      render(<Editor tagLimit={5} />);
      expect(getWrapper().findLimitInfo()!.getText()).toBe('You can add 3 more tags.');
    });

    test('disables the add button at the limit', () => {
      render(<Editor tagLimit={2} />);
      expect(getWrapper().findAddButton()!.isDisabled()).toBe(true);
      expect(getWrapper().findLimitInfo()!.getText()).toBe('You have reached the limit of 2 tags.');
    });

    test('tags marked for removal do not count', () => {
      render(<Editor tagLimit={2} tags={[{ ...savedTags[0], markedForRemoval: true }, savedTags[1]]} />);
      expect(getWrapper().findAddButton()!.isDisabled()).toBe(false);
      expect(getWrapper().findLimitInfo()!.getText()).toBe('You can add 1 more tag.');
    });

    test('undoing past the limit makes the tags invalid', () => {
      const onChange = vi.fn();
      render(
        <Editor
          tagLimit={2}
          tags={[{ ...savedTags[0], markedForRemoval: true }, savedTags[1], { key: 'a', value: '', existing: false }]}
          onChangeSpy={onChange}
        />
      );
      getWrapper().findTagRow(1)!.findRemoveButton()!.click();
      expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ valid: false }));
      expect(getWrapper().findLimitInfo()!.getText()).toBe(
        'You have exceeded the limit of 2 tags. Remove 1 tag to save.'
      );
    });

    test('i18nStrings functions replace the limit messages', () => {
      render(<Editor tagLimit={4} i18nStrings={{ tagLimit: (available, limit) => `${available}/${limit} left` }} />);
      expect(getWrapper().findLimitInfo()!.getText()).toBe('2/4 left');
    });
  });

  describe('suggestions', () => {
    test('loads key suggestions from keysRequest', async () => {
      const keysRequest = vi.fn(() => Promise.resolve(['owner', 'stage']));
      render(<Editor tags={[{ key: '', value: '', existing: false }]} keysRequest={keysRequest} />);
      const key = getWrapper().findTagRow(1)!.findKeyInput()!;
      await act(async () => key.setInputValue('s'));
      expect(keysRequest).toHaveBeenCalledWith('s');
      expect(screen.getByRole('option', { name: 'stage' })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('option', { name: 'stage' }));
      expect(key.findNativeInput().getElement()).toHaveValue('stage');
    });

    test('loads value suggestions for the row key', async () => {
      const valuesRequest = vi.fn(() => Promise.resolve(['platform', 'payments']));
      render(<Editor valuesRequest={valuesRequest} />);
      await act(async () => getWrapper().findTagRow(1)!.findValueInput()!.setInputValue('pa'));
      expect(valuesRequest).toHaveBeenCalledWith('team', 'pa');
      expect(screen.getByRole('option', { name: 'payments' })).toBeInTheDocument();
    });

    test('shows an error with a retry button when the request fails', async () => {
      const keysRequest = vi.fn(() => Promise.reject(new Error('offline')));
      render(<Editor tags={[{ key: '', value: '', existing: false }]} keysRequest={keysRequest} />);
      await act(async () => getWrapper().findTagRow(1)!.findKeyInput()!.setInputValue('o'));
      expect(screen.getByText('Tag keys could not be retrieved')).toBeInTheDocument();
      await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Retry' })));
      expect(keysRequest).toHaveBeenCalledTimes(2);
    });
  });

  test('shows a loading state', () => {
    render(<Editor loading={true} />);
    expect(getWrapper().findLoadingStatus()!.getText()).toBe('Loading tags');
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(getWrapper().findTagRows()).toHaveLength(0);
  });

  test('shows the empty text without tags', () => {
    render(<Editor tags={[]} />);
    expect(getWrapper().findEmptySlot()!.getText()).toBe('No tags associated with the resource.');
    expect(getWrapper().findAddButton()!.getText()).toBe('Add new tag');
  });

  test('i18nStrings replaces the built-in texts', () => {
    render(
      <Editor
        i18nStrings={{
          keyHeader: 'Schlüssel',
          addButton: 'Tag hinzufügen',
          removeButtonAriaLabel: tag => `Tag ${tag.key} entfernen`,
        }}
      />
    );
    expect(getWrapper().findTagRow(1)!.findField(1)!.getText()).toContain('Schlüssel');
    expect(getWrapper().findAddButton()!.getText()).toBe('Tag hinzufügen');
    expect(getWrapper().findTagRow(1)!.findRemoveButton()!.getElement()).toHaveAccessibleName('Tag team entfernen');
  });

  test('has no axe violations', async () => {
    const { container } = render(
      <Editor
        tags={[{ ...savedTags[0], markedForRemoval: true }, savedTags[1], { key: 'team', value: '', existing: false }]}
      />
    );
    await expectNoAxeViolations(container);
  });
});
