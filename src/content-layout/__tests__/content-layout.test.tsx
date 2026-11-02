// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import BreadcrumbGroup from '../../../lib/components/breadcrumb-group';
import Container from '../../../lib/components/container';
import ContentLayout, { ContentLayoutProps } from '../../../lib/components/content-layout';
import Header from '../../../lib/components/header';
import createWrapper, { HeaderWrapper } from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/content-layout/styles.css.js';

function renderLayout(props: Partial<ContentLayoutProps> = {}) {
  render(
    <ContentLayout
      header={<Header variant="h1">Instances</Header>}
      breadcrumbs={<nav aria-label="Breadcrumbs">Service / Instances</nav>}
      notifications={<div>Instance i-123 started.</div>}
      {...props}
    >
      <p>12 instances are running.</p>
    </ContentLayout>
  );
  return createWrapper().findContentLayout()!;
}

describe('ContentLayout', () => {
  test('renders every area in order: notifications, breadcrumbs, heading, content', () => {
    const layout = renderLayout();
    expect(layout.findNotifications()!.getText()).toBe('Instance i-123 started.');
    expect(layout.findBreadcrumbs()!.getText()).toBe('Service / Instances');
    expect(layout.findHeader()!.findComponent(HeaderWrapper)!.findHeadingText().getText()).toBe('Instances');
    expect(layout.findContent().getText()).toBe('12 instances are running.');
    const text = layout.getElement().textContent!;
    expect(text.indexOf('started')).toBeLessThan(text.indexOf('Service'));
    expect(text.indexOf('Service')).toBeLessThan(text.indexOf('Instances'));
  });

  test('renders only the content when there is no heading area', () => {
    render(<ContentLayout>Content</ContentLayout>);
    const layout = createWrapper().findContentLayout()!;
    expect(layout.findHeader()).toBeNull();
    expect(layout.findBreadcrumbs()).toBeNull();
    expect(layout.findNotifications()).toBeNull();
    expect(layout.findContent().getText()).toBe('Content');
  });

  test('the high-contrast header draws a band the content overlaps', () => {
    const root = renderLayout({ headerVariant: 'high-contrast' }).getElement();
    expect(root.querySelector(`.${styles.band}`)).not.toBeNull();
    expect(root).toHaveClass(styles['header-variant-high-contrast'], styles.overlap, styles.padded);
    expect(root).not.toHaveClass(styles['padded-top']);
  });

  test('disableOverlap starts the content below the band', () => {
    const root = renderLayout({ headerVariant: 'high-contrast', disableOverlap: true }).getElement();
    expect(root.querySelector(`.${styles.band}`)).not.toBeNull();
    expect(root).not.toHaveClass(styles.overlap);
  });

  test.each(['default', 'divider'] as const)('the %s header has no band and no overlap', headerVariant => {
    const root = renderLayout({ headerVariant }).getElement();
    expect(root.querySelector(`.${styles.band}`)).toBeNull();
    expect(root).not.toHaveClass(styles.overlap);
  });

  test('the divider header rules off the heading', () => {
    expect(renderLayout({ headerVariant: 'divider' }).getElement()).toHaveClass(styles['header-variant-divider']);
  });

  test('defaultPadding pads the heading and the content', () => {
    expect(renderLayout().getElement()).not.toHaveClass(styles.padded);
    render(<ContentLayout defaultPadding={true}>Padded</ContentLayout>);
    expect(createWrapper().findAllContentLayouts()[1].getElement()).toHaveClass(styles.padded, styles['padded-top']);
  });

  test('maxContentWidth limits the width of the heading and the content', () => {
    const root = renderLayout({ maxContentWidth: 960 }).getElement();
    expect(root.style.getPropertyValue('--content-layout-max-width')).toBe('960px');
  });

  test('passes id and data attributes', () => {
    render(
      <ContentLayout id="page" data-testid="page">
        Content
      </ContentLayout>
    );
    expect(screen.getByTestId('page')).toHaveAttribute('id', 'page');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <ContentLayout
        headerVariant="high-contrast"
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Service', href: '#' },
              { text: 'Instances', href: '#instances' },
            ]}
          />
        }
        header={
          <Header variant="h1" description="Every instance in this region." actions={<button>Launch</button>}>
            Instances
          </Header>
        }
      >
        <Container heading="Summary">12 instances are running.</Container>
      </ContentLayout>
    );
    await expectNoAxeViolations(container);
  });
});
