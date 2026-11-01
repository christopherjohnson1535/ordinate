// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Media from '../../../lib/components/media';
import Plate, { PlateProps } from '../../../lib/components/plate';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const plate = () => createWrapper().findPlate()!;

describe('Plate', () => {
  test('renders the picture and the catalogue caption', () => {
    render(
      <Plate
        media={<Media src="/harbour.jpg" alt="" />}
        label="Plate I"
        title="Harbour House"
        meta="Lisbon, 2025"
        description="A net loft turned into a home."
      />
    );
    expect(plate().findMedia()!.findAllMedias()).toHaveLength(1);
    expect(plate().findLabel()!.getText()).toBe('Plate I');
    expect(plate().findTitle()!.getText()).toBe('Harbour House');
    expect(plate().findMeta()!.getText()).toBe('Lisbon, 2025');
    expect(plate().findDescription()!.getText()).toBe('A net loft turned into a home.');
  });

  test('the title is a level 3 heading by default and headingLevel changes it', () => {
    render(
      <>
        <Plate title="First" />
        <Plate title="Second" headingLevel={4} />
      </>
    );
    expect(screen.getByRole('heading', { level: 3, name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Second' })).toBeInTheDocument();
  });

  test('with href the title is the only link', () => {
    render(<Plate title="Harbour House" href="/work/harbour" label="Plate I" />);
    const link = screen.getByRole('link', { name: 'Harbour House' });
    expect(link).toHaveAttribute('href', '/work/harbour');
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(plate().findTitleLink()!.getElement()).toBe(link);
  });

  test('renders only the parts it is given', () => {
    render(<Plate title="Just a title" />);
    expect(plate().findLabel()).toBeNull();
    expect(plate().findMeta()).toBeNull();
    expect(plate().findMedia()).toBeNull();
    expect(plate().findTitleLink()).toBeNull();
  });

  test('fires onFollow on a plain click, and preventDefault stops navigation', () => {
    const onFollow = vi.fn((event: CustomEvent) => event.preventDefault());
    render(<Plate title="Harbour House" href="/work/harbour" onFollow={onFollow} />);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => {
      screen.getByRole('link').dispatchEvent(event);
    });
    expect(onFollow).toHaveBeenCalledWith(expect.objectContaining({ detail: { href: '/work/harbour' } }));
    expect(event.defaultPrevented).toBe(true);
  });

  test('leaves clicks with a modifier key to the browser', () => {
    const onFollow = vi.fn();
    render(<Plate title="Harbour House" href="/work/harbour" onFollow={onFollow} />);
    fireEvent.click(screen.getByRole('link'), { ctrlKey: true });
    expect(onFollow).not.toHaveBeenCalled();
  });

  test('the title link is reachable with the keyboard', () => {
    render(<Plate title="Harbour House" href="/work/harbour" />);
    plate().findTitleLink()!.focus();
    expect(screen.getByRole('link')).toHaveFocus();
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'plate', 'data-testid': 'plate', className: 'custom' } as unknown as PlateProps;
    render(<Plate {...props} title="Plate" />);
    const root = screen.getByTestId('plate');
    expect(root).toHaveAttribute('id', 'plate');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <h2>Selected work</h2>
        <Plate
          media={<Media src="/harbour.jpg" alt="" />}
          label="Plate I"
          title="Harbour House"
          href="/work/harbour"
          meta="Lisbon, 2025"
          description="A net loft turned into a home."
        />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
