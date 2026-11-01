// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import HelpPanel from '../../../lib/components/help-panel';
import I18nProvider from '../../../lib/components/i18n';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('HelpPanel', () => {
  test('renders the header as a level 2 heading', () => {
    render(<HelpPanel header="Endpoints">Content</HelpPanel>);
    expect(screen.getByRole('heading', { level: 2, name: 'Endpoints' })).toBeInTheDocument();
  });

  test('renders the content and the footer', () => {
    render(
      <HelpPanel header="Endpoints" footer={<a href="#docs">Learn more</a>}>
        <p>An endpoint is an address.</p>
      </HelpPanel>
    );
    const panel = createWrapper().findHelpPanel()!;
    expect(panel.findHeader()!.getText()).toBe('Endpoints');
    expect(panel.findContent()!.getText()).toBe('An endpoint is an address.');
    expect(panel.findFooter()!.getText()).toBe('Learn more');
  });

  test('leaves out the parts that are not set', () => {
    render(<HelpPanel>Only content</HelpPanel>);
    const panel = createWrapper().findHelpPanel()!;
    expect(panel.findHeader()).toBeNull();
    expect(panel.findFooter()).toBeNull();
    expect(screen.queryByRole('heading')).toBeNull();
  });

  test('replaces everything with a status while loading', () => {
    render(
      <HelpPanel header="Endpoints" loading={true} loadingText="Loading help">
        Content
      </HelpPanel>
    );
    const panel = createWrapper().findHelpPanel()!;
    expect(screen.getByRole('status')).toHaveTextContent('Loading help');
    expect(panel.findLoadingStatus()).not.toBeNull();
    expect(panel.findContent()).toBeNull();
    expect(panel.getElement()).toHaveAttribute('aria-busy', 'true');
  });

  test('uses the built-in loading text, which an I18nProvider can replace', () => {
    const { rerender } = render(<HelpPanel loading={true} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    rerender(
      <I18nProvider
        locale="de"
        messages={[{ '@ordinate-ui/components': { de: { 'help-panel': { loadingText: 'Wird geladen' } } } }]}
      >
        <HelpPanel loading={true} />
      </I18nProvider>
    );
    expect(screen.getByRole('status')).toHaveTextContent('Wird geladen');
  });

  test('passes id and data attributes to the root', () => {
    render(<HelpPanel id="help" data-testid="help-panel" />);
    expect(screen.getByTestId('help-panel')).toHaveAttribute('id', 'help');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <HelpPanel
        header="Endpoints"
        footer={
          <>
            <h3>Learn more</h3>
            <ul>
              <li>
                <a href="#docs">Certificates</a>
              </li>
            </ul>
          </>
        }
      >
        <p>
          Use <code>ordinate endpoints</code> to list them.
        </p>
      </HelpPanel>
    );
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations while loading', async () => {
    const { container } = render(<HelpPanel header="Endpoints" loading={true} />);
    await expectNoAxeViolations(container);
  });
});
