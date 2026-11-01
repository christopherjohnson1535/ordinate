// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Button from '../../../lib/components/button';
import StyleScope from '../../../lib/components/style-scope';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('StyleScope', () => {
  test('sets the global classes for the settings it is given', () => {
    render(
      <StyleScope styleName="shopfront" mode="dark" density="compact" revision="2026.2">
        <Button>Book a repair</Button>
      </StyleScope>
    );
    const scope = createWrapper().findStyleScope()!.getElement();
    expect(scope).toHaveClass('ord-style-shopfront', 'ord-dark-mode', 'ord-compact-mode', 'ord-revision-2026-2');
    expect(scope).toContainElement(screen.getByRole('button', { name: 'Book a repair' }));
  });

  test('inherits whatever it is not given', () => {
    render(<StyleScope styleName="console">Content</StyleScope>);
    const classes = Array.from(createWrapper().findStyleScope()!.getElement().classList);
    expect(classes.some(name => name.startsWith('ord-'))).toBe(false);
  });

  test('can render as a landmark with a name', () => {
    render(
      <StyleScope styleName="editorial" tagOverride="section" ariaLabel="Journal preview">
        Content
      </StyleScope>
    );
    expect(screen.getByRole('region', { name: 'Journal preview' })).toHaveClass('ord-style-editorial');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <StyleScope styleName="studio" mode="dark">
        <Button>Contact</Button>
      </StyleScope>
    );
    await expectNoAxeViolations(container);
  });
});
