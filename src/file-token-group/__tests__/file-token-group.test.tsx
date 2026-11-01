// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import FileTokenGroup, { FileTokenGroupProps } from '../../../lib/components/file-token-group';
import I18nProvider from '../../../lib/components/i18n';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const lastModified = new Date(2026, 9, 31, 14, 5).getTime();

// The size is set rather than filled, so a gigabyte file costs nothing to make.
function file(name: string, size: number, type = 'application/pdf') {
  const created = new File([], name, { type, lastModified });
  Object.defineProperty(created, 'size', { value: size });
  return created;
}

const plan = file('site-plan.pdf', 512);
const section = file('section-a.png', 2_480, 'image/png');
const survey = file('survey.dwg', 3_250_000, 'application/acad');
const archive = file('archive.zip', 4_200_000_000, 'application/zip');

const items: FileTokenGroupProps.Item[] = [{ file: plan }, { file: section }, { file: survey }];

const group = () => createWrapper().findFileTokenGroup()!;

function Controlled(props: Partial<FileTokenGroupProps>) {
  const [current, setCurrent] = useState(props.items ?? items);
  return (
    <FileTokenGroup
      {...props}
      items={current}
      onDismiss={event => setCurrent(list => list.filter((_, index) => index !== event.detail.fileIndex))}
    />
  );
}

describe('FileTokenGroup', () => {
  test('renders a list with a token per file', () => {
    render(<FileTokenGroup items={items} ariaLabel="Drawings" />);
    expect(screen.getByRole('list', { name: 'Drawings' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(
      group()
        .findFileTokens()
        .map(token => token.findFileName().getText())
    ).toEqual(['site-plan.pdf', 'section-a.png', 'survey.dwg']);
  });

  test('shows no size, date or thumbnail unless asked', () => {
    render(<FileTokenGroup items={items} />);
    const token = group().findFileToken(1)!;
    expect(token.findFileSize()).toBeNull();
    expect(token.findFileLastModified()).toBeNull();
    expect(token.findFileThumbnail()).toBeNull();
  });

  test('formats file sizes in B, KB, MB and GB', () => {
    render(<FileTokenGroup items={[...items, { file: archive }]} showFileSize={true} />);
    expect(
      group()
        .findFileTokens()
        .map(token => token.findFileSize()!.getText())
    ).toEqual(['512 B', '2.48 KB', '3.25 MB', '4.2 GB']);
  });

  test('formats sizes in the locale of the I18nProvider', () => {
    render(
      <I18nProvider locale="de" messages={[]}>
        <FileTokenGroup items={[{ file: section }]} showFileSize={true} />
      </I18nProvider>
    );
    expect(group().findFileToken(1)!.findFileSize()!.getText()).toBe('2,48 KB');
  });

  test('shows the last-modified date', () => {
    render(<FileTokenGroup items={[{ file: plan }]} showFileLastModified={true} />);
    const text = group().findFileToken(1)!.findFileLastModified()!.getText();
    expect(text).toContain('2026');
    expect(text).toContain('Oct');
  });

  test('takes size and date formats from i18nStrings', () => {
    render(
      <FileTokenGroup
        items={[{ file: plan }]}
        showFileSize={true}
        showFileLastModified={true}
        i18nStrings={{
          formatFileSize: size => `${size} bytes`,
          formatFileLastModified: date => `year ${date.getFullYear()}`,
        }}
      />
    );
    const token = group().findFileToken(1)!;
    expect(token.findFileSize()!.getText()).toBe('512 bytes');
    expect(token.findFileLastModified()!.getText()).toBe('year 2026');
  });

  test('fires onDismiss with the file index, and names the buttons after the files', () => {
    const onDismiss = vi.fn();
    render(<FileTokenGroup items={items} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove file 2, section-a.png' }));
    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ detail: { fileIndex: 1 } }));
  });

  test('takes the remove label from i18nStrings', () => {
    render(
      <FileTokenGroup
        items={items}
        onDismiss={() => {}}
        i18nStrings={{ removeFileAriaLabel: (index, name) => `Drop ${name} at ${index}` }}
      />
    );
    expect(group().findFileToken(3)!.findRemoveButton()!.getElement()).toHaveAccessibleName('Drop survey.dwg at 2');
  });

  test('moves focus to the next remove button after a removal', () => {
    render(<Controlled />);
    const remove = screen.getByRole('button', { name: 'Remove file 1, site-plan.pdf' });
    act(() => remove.focus());
    fireEvent.click(remove);
    expect(screen.getByRole('button', { name: 'Remove file 1, section-a.png' })).toHaveFocus();
  });

  test('moves focus to the previous remove button when the last file is removed', () => {
    render(<Controlled />);
    const remove = screen.getByRole('button', { name: 'Remove file 3, survey.dwg' });
    act(() => remove.focus());
    fireEvent.click(remove);
    expect(screen.getByRole('button', { name: 'Remove file 2, section-a.png' })).toHaveFocus();
  });

  test('leaves focus alone when a remove button is clicked without focus', () => {
    render(
      <>
        <button>Elsewhere</button>
        <Controlled />
      </>
    );
    const elsewhere = screen.getByRole('button', { name: 'Elsewhere' });
    act(() => elsewhere.focus());
    group().findFileToken(1)!.findRemoveButton()!.click();
    expect(elsewhere).toHaveFocus();
  });

  test('has no remove buttons when read-only or without onDismiss', () => {
    const { rerender } = render(<FileTokenGroup items={items} readOnly={true} onDismiss={() => {}} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    rerender(<FileTokenGroup items={items} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('shows a file error and warning below the token', () => {
    render(
      <FileTokenGroup
        items={[
          { file: plan, errorText: 'Too large', warningText: 'Hidden by the error' },
          { file: section, warningText: 'Low resolution' },
        ]}
      />
    );
    const [first, second] = group().findFileTokens();
    expect(first.findFileError()!.getText()).toBe('Too large');
    expect(first.findFileWarning()).toBeNull();
    expect(second.findFileWarning()!.getText()).toBe('Low resolution');
    expect(screen.getByRole('img', { name: 'Error' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
  });

  test('takes the icon labels from i18nStrings', () => {
    render(
      <FileTokenGroup
        items={[
          { file: plan, errorText: 'Too large' },
          { file: section, warningText: 'Low resolution' },
        ]}
        i18nStrings={{ errorIconAriaLabel: 'Problem', warningIconAriaLabel: 'Caution' }}
      />
    );
    expect(screen.getByRole('img', { name: 'Problem' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Caution' })).toBeInTheDocument();
  });

  test('shows a spinner for a loading file and marks it busy', () => {
    render(<FileTokenGroup items={[{ file: plan, loading: true }, { file: section }]} />);
    const [loading, done] = group().findFileTokens();
    expect(loading.isLoading()).toBe(true);
    expect(loading.getElement()).toHaveAttribute('aria-busy', 'true');
    expect(done.isLoading()).toBe(false);
  });

  test('limits the files and toggles the rest', () => {
    render(<FileTokenGroup items={items} limit={1} />);
    expect(group().findFileTokens()).toHaveLength(1);
    const toggle = group().findTokenToggle()!;
    expect(toggle.getText()).toBe('Show 2 more');
    expect(toggle.getElement()).toHaveAttribute('aria-expanded', 'false');
    toggle.click();
    expect(group().findFileTokens()).toHaveLength(3);
    expect(toggle.getText()).toBe('Show fewer');
    expect(toggle.getElement()).toHaveAttribute('aria-expanded', 'true');
  });

  test('takes the toggle texts from i18nStrings', () => {
    render(<FileTokenGroup items={items} limit={1} i18nStrings={{ limitShowMore: 'More', limitShowFewer: 'Less' }} />);
    const toggle = group().findTokenToggle()!;
    expect(toggle.getText()).toBe('More');
    toggle.click();
    expect(toggle.getText()).toBe('Less');
  });

  test('has no toggle when the files fit the limit', () => {
    render(<FileTokenGroup items={items} limit={3} />);
    expect(group().findTokenToggle()).toBeNull();
  });

  test('stacks the tokens with the vertical alignment', () => {
    const { container } = render(<FileTokenGroup items={items} alignment="vertical" />);
    expect(container.querySelector('[class*="alignment-vertical"]')).not.toBeNull();
  });

  test('cuts long names, keeping the full name available', () => {
    const long = file(`${'very-long-drawing-name-'.repeat(8)}.pdf`, 10);
    render(<FileTokenGroup items={[{ file: long }]} />);
    expect(group().findFileToken(1)!.findFileName().getText()).toBe(long.name);
  });

  test('passes id and data attributes to the root', () => {
    render(<FileTokenGroup id="files" data-testid="files" items={items} />);
    expect(group().getElement()).toHaveAttribute('id', 'files');
    expect(group().getElement()).toHaveAttribute('data-testid', 'files');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <FileTokenGroup
        items={[
          { file: plan, errorText: 'Too large' },
          { file: section, warningText: 'Low resolution' },
          { file: survey },
        ]}
        limit={2}
        showFileSize={true}
        showFileLastModified={true}
        showFileThumbnail={true}
        ariaLabel="Drawings"
        onDismiss={() => {}}
      />
    );
    await expectNoAxeViolations(container);
  });
});

describe('FileTokenGroup thumbnails', () => {
  const createObjectURL = vi.fn((blob: Blob) => `blob:${(blob as File).name}`);
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
  });

  afterEach(() => {
    Reflect.deleteProperty(URL, 'createObjectURL');
    Reflect.deleteProperty(URL, 'revokeObjectURL');
  });

  test('previews image files and shows an icon for other files', () => {
    render(<FileTokenGroup items={[{ file: section }, { file: plan }]} showFileThumbnail={true} />);
    const [image, document] = group().findFileTokens();
    expect(image.findFileThumbnail()!.getElement()).toHaveAttribute('src', 'blob:section-a.png');
    expect(image.findFileThumbnail()!.getElement()).toHaveAttribute('alt', '');
    expect(document.findFileThumbnail()).toBeNull();
    expect(createObjectURL).toHaveBeenCalledTimes(1);
  });

  test('revokes the preview URL when the token goes away', () => {
    const { rerender, unmount } = render(<FileTokenGroup items={[{ file: section }]} showFileThumbnail={true} />);
    rerender(<FileTokenGroup items={[]} showFileThumbnail={true} />);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:section-a.png');
    unmount();
  });

  test('revokes the preview URL on unmount', () => {
    const { unmount } = render(<FileTokenGroup items={[{ file: section }]} showFileThumbnail={true} />);
    unmount();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:section-a.png');
  });

  test('creates no preview URL without showFileThumbnail', () => {
    render(<FileTokenGroup items={[{ file: section }]} />);
    expect(createObjectURL).not.toHaveBeenCalled();
  });
});
