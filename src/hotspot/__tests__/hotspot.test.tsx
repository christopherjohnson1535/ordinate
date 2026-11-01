// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import AnnotationContext, { AnnotationContextProps } from '../../../lib/components/annotation-context';
import Hotspot from '../../../lib/components/hotspot';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const tutorial: AnnotationContextProps.Tutorial = {
  title: 'Tour',
  tasks: [{ title: 'Look around', steps: [{ title: 'The name', content: 'Type here.', hotspotId: 'name' }] }],
};

const hotspot = () => createWrapper().findHotspot()!;

describe('Hotspot', () => {
  test('renders its children without a marker outside a tutorial', () => {
    render(
      <Hotspot hotspotId="name">
        <span>Name</span>
      </Hotspot>
    );
    expect(hotspot().findContent()!.getText()).toBe('Name');
    expect(hotspot().findMarker()).toBeNull();
    expect(hotspot().getHotspotId()).toBe('name');
  });

  test('shows a marker after the children by default', () => {
    render(
      <AnnotationContext currentTutorial={tutorial}>
        <Hotspot hotspotId="name">
          <span>Name</span>
        </Hotspot>
      </AnnotationContext>
    );
    const element = hotspot().getElement();
    expect(element.lastElementChild).toContainElement(hotspot().findMarker()!.getElement());
    expect(screen.getByRole('button', { name: 'Close annotation for step 1 of 1' })).toHaveAttribute(
      'aria-haspopup',
      'dialog'
    );
  });

  test('shows the marker before the children on the left side', () => {
    render(
      <AnnotationContext currentTutorial={tutorial}>
        <Hotspot hotspotId="name" side="left">
          <span>Name</span>
        </Hotspot>
      </AnnotationContext>
    );
    expect(hotspot().getElement().firstElementChild).toContainElement(hotspot().findMarker()!.getElement());
  });

  test('stands on its own without children', () => {
    render(
      <AnnotationContext currentTutorial={tutorial}>
        <Hotspot hotspotId="name" />
      </AnnotationContext>
    );
    expect(hotspot().findContent()).toBeNull();
    expect(hotspot().isCurrent()).toBe(true);
  });

  test('links the marker to its open annotation', () => {
    render(
      <AnnotationContext currentTutorial={tutorial}>
        <Hotspot hotspotId="name" />
      </AnnotationContext>
    );
    const marker = hotspot().findMarker()!.getElement();
    expect(marker).toHaveAttribute('aria-expanded', 'true');
    expect(marker.getAttribute('aria-controls')).toBe(hotspot().findAnnotation()!.getElement().id);
  });

  test('passes id and data attributes to the root', () => {
    render(<Hotspot hotspotId="name" id="anchor" data-testid="anchor" />);
    expect(screen.getByTestId('anchor')).toHaveAttribute('id', 'anchor');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <AnnotationContext currentTutorial={tutorial}>
        <Hotspot hotspotId="name">
          <label>
            Name <input />
          </label>
        </Hotspot>
      </AnnotationContext>
    );
    await expectNoAxeViolations(container);
  });
});
