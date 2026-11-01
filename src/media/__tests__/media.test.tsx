// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import Media, { MediaProps } from '../../../lib/components/media';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const media = () => createWrapper().findMedia()!;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Media', () => {
  test('shows an image with its alt text', () => {
    render(<Media src="/loaves.jpg" alt="Fresh loaves on the counter" />);
    const image = screen.getByRole('img', { name: 'Fresh loaves on the counter' });
    expect(image).toHaveAttribute('src', '/loaves.jpg');
    expect(media().findImage()!.getElement()).toBe(image);
    expect(media().isPlaceholder()).toBe(false);
  });

  test('an empty alt marks the image as decoration', () => {
    const { container } = render(<Media src="/texture.jpg" alt="" />);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
    expect(screen.queryByRole('img')).toBeNull();
  });

  test('warns when an image has no alt text', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Media src="/no-alt.jpg" />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('alt'));
  });

  test('draws a placeholder when it has nothing to show, with the note hidden from screen readers', () => {
    render(<Media placeholderText="Photo of the shop front" />);
    expect(media().isPlaceholder()).toBe(true);
    const note = media().findPlaceholderText()!;
    expect(note.getText()).toBe('Photo of the shop front');
    expect(note.getElement()).toHaveAttribute('aria-hidden', 'true');
    expect(media().findImage()).toBeNull();
  });

  test('a placeholder without a note renders no text', () => {
    render(<Media />);
    expect(media().isPlaceholder()).toBe(true);
    expect(media().findPlaceholderText()).toBeNull();
  });

  test('children replace the image', () => {
    render(
      <Media src="/ignored.jpg" alt="Ignored">
        <svg role="img" aria-label="Floor plan" />
      </Media>
    );
    expect(media().findContent()).not.toBeNull();
    expect(media().findImage()).toBeNull();
    expect(screen.getByRole('img', { name: 'Floor plan' })).toBeInTheDocument();
  });

  test('applies a different class for each aspect ratio and fit', () => {
    const ratios: MediaProps.AspectRatio[] = ['1:1', '4:3', '3:2', '16:9', '4:5', 'auto'];
    render(
      <>
        {ratios.map(ratio => (
          <Media key={ratio} aspectRatio={ratio} />
        ))}
        <Media fit="contain" />
      </>
    );
    const classNames = createWrapper()
      .findAllMedias()
      .map(wrapper => wrapper.getElement().className);
    expect(new Set(classNames).size).toBe(ratios.length + 1);
  });

  test('defaults to 3:2 and cover', () => {
    render(
      <>
        <Media />
        <Media aspectRatio="3:2" fit="cover" />
      </>
    );
    const [defaults, explicit] = createWrapper().findAllMedias();
    expect(defaults.getElement().className).toBe(explicit.getElement().className);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'hero', 'data-testid': 'media', className: 'custom' } as MediaProps;
    render(<Media {...props} />);
    const root = screen.getByTestId('media');
    expect(root).toHaveAttribute('id', 'hero');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Media src="/loaves.jpg" alt="Fresh loaves on the counter" />
        <Media placeholderText="Photo" />
        <Media>
          <svg role="img" aria-label="Floor plan" />
        </Media>
      </>
    );
    await expectNoAxeViolations(container);
  });
});
