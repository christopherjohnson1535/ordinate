// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Stamp, { StampProps } from '../../../lib/components/stamp';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const types: StampProps.Type[] = ['success', 'warning', 'error', 'info', 'neutral', 'draft'];

describe('Stamp', () => {
  test('is text that screen readers read as written', () => {
    render(
      <h1>
        North Annex <Stamp type="success">Running</Stamp>
      </h1>
    );
    expect(screen.getByRole('heading', { name: 'North Annex Running' })).toBeInTheDocument();
    expect(createWrapper().findStamp()!.findText().getText()).toBe('Running');
    expect(createWrapper().findStamp()!.getElement().querySelector('svg, img')).toBeNull();
  });

  test('is neutral, slightly rotated and medium by default', () => {
    render(
      <>
        <Stamp>Archived</Stamp>
        <Stamp type="neutral" rotation="slight" size="medium">
          Archived
        </Stamp>
      </>
    );
    const [byDefault, explicit] = createWrapper().findAllStamps();
    expect(byDefault.getElement().className).toBe(explicit.getElement().className);
    expect(byDefault.getType()).toBe('neutral');
    expect(byDefault.isRotated()).toBe(true);
  });

  test('applies a different class for each type, size and rotation', () => {
    render(
      <>
        {types.map(type => (
          <Stamp key={type} type={type}>
            {type}
          </Stamp>
        ))}
        <Stamp size="small" rotation="none">
          Level
        </Stamp>
      </>
    );
    const stamps = createWrapper().findAllStamps();
    expect(stamps.slice(0, types.length).map(stamp => stamp.getType())).toEqual(types);
    expect(new Set(stamps.map(stamp => stamp.getElement().className)).size).toBe(types.length + 1);
    expect(stamps[types.length].isRotated()).toBe(false);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'state', 'data-testid': 'stamp', className: 'custom' } as StampProps;
    render(<Stamp {...props}>Draft</Stamp>);
    const stamp = screen.getByTestId('stamp');
    expect(stamp).toHaveAttribute('id', 'state');
    expect(stamp).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <p>
        {types.map(type => (
          <Stamp key={type} type={type} size="small">
            {type}
          </Stamp>
        ))}
      </p>
    );
    await expectNoAxeViolations(container);
  });
});
