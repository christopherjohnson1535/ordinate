// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Drawer from '../../../lib/components/drawer';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Drawer', () => {
  test('renders the header as a level 2 heading, the content and the footer', () => {
    render(
      <Drawer header="Activity" footer={<button>Done</button>}>
        Node 14 replaced.
      </Drawer>
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Activity' })).toBeInTheDocument();
    const drawer = createWrapper().findDrawer()!;
    expect(drawer.findContent()!.getText()).toBe('Node 14 replaced.');
    expect(drawer.findFooter()!.getText()).toBe('Done');
  });

  test('leaves out the header and footer when they are not set', () => {
    render(<Drawer>Content</Drawer>);
    const drawer = createWrapper().findDrawer()!;
    expect(drawer.findHeader()).toBeNull();
    expect(drawer.findFooter()).toBeNull();
  });

  test('keeps the header but replaces the content and footer while loading', () => {
    render(
      <Drawer header="Assistant" loading={true} loadingText="Starting" footer="Actions">
        Content
      </Drawer>
    );
    const drawer = createWrapper().findDrawer()!;
    expect(drawer.findHeader()!.getText()).toBe('Assistant');
    expect(drawer.findContent()).toBeNull();
    expect(drawer.findFooter()).toBeNull();
    expect(drawer.findLoadingStatus()!.getText()).toBe('Starting');
    expect(drawer.getElement()).toHaveAttribute('aria-busy', 'true');
  });

  test('uses the built-in loading text by default', () => {
    render(<Drawer loading={true} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  test('disableContentPaddings changes the content class', () => {
    const { rerender } = render(<Drawer>Content</Drawer>);
    const content = createWrapper().findDrawer()!.findContent()!.getElement();
    const before = content.className;
    rerender(<Drawer disableContentPaddings={true}>Content</Drawer>);
    expect(createWrapper().findDrawer()!.findContent()!.getElement().className).not.toBe(before);
  });

  test('sets the reference above the title', () => {
    render(
      <Drawer kind="policy" reference="P1" header="Access policy">
        Content
      </Drawer>
    );
    const drawer = createWrapper().findDrawer()!;
    expect(drawer.findReference()!.getText()).toBe('P1');
    expect(drawer.findHeader()!.getText()).toBe('Access policy');
    expect(screen.getByRole('heading', { level: 2, name: 'Access policy' })).toBeInTheDocument();
  });

  test('passes id and data attributes to the root', () => {
    render(<Drawer id="activity" data-testid="drawer" />);
    expect(screen.getByTestId('drawer')).toHaveAttribute('id', 'activity');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Drawer header="Activity" footer={<button>Done</button>}>
        <p>Node 14 replaced.</p>
      </Drawer>
    );
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations while loading', async () => {
    const { container } = render(<Drawer header="Activity" loading={true} />);
    await expectNoAxeViolations(container);
  });
});
