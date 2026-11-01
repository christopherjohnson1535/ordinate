// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Figure, { FigureProps } from '../../../lib/components/figure';
import Media from '../../../lib/components/media';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const figure = () => createWrapper().findFigure()!;

describe('Figure', () => {
  test('is a figure named by its caption, label and credit', () => {
    render(
      <Figure
        media={<Media src="/quay.jpg" alt="The east quay" />}
        label="Fig. 1"
        caption="The east quay at low tide."
        credit="Photo: Ana Ruiz"
      />
    );
    const element = screen.getByRole('figure');
    expect(element.tagName).toBe('FIGURE');
    expect(figure().findCaption()!.getElement().tagName).toBe('FIGCAPTION');
    expect(figure().findLabel()!.getText()).toBe('Fig. 1');
    expect(figure().findCaptionText()!.getText()).toBe('The east quay at low tide.');
    expect(figure().findCredit()!.getText()).toBe('Photo: Ana Ruiz');
    expect(figure().findMedia()!.findAllMedias()).toHaveLength(1);
  });

  test('renders only the parts it is given', () => {
    render(<Figure media={<Media />} caption="Morning light." />);
    expect(figure().findLabel()).toBeNull();
    expect(figure().findCredit()).toBeNull();
    expect(figure().findCaptionText()!.getText()).toBe('Morning light.');
  });

  test('has no figcaption without caption, label or credit', () => {
    render(<Figure media={<Media />} />);
    expect(figure().findCaption()).toBeNull();
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'fig-1', 'data-testid': 'figure', className: 'custom' } as FigureProps;
    render(<Figure {...props} caption="Caption" />);
    const root = screen.getByTestId('figure');
    expect(root).toHaveAttribute('id', 'fig-1');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Figure
        media={<Media src="/quay.jpg" alt="The east quay" />}
        label="Plate III"
        caption="Ground floor, as surveyed."
        credit="Town archive"
      />
    );
    await expectNoAxeViolations(container);
  });
});
