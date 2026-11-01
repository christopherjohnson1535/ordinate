// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('ExpandableSection', () => {
  test('starts closed with the button wired to the content', () => {
    render(<ExpandableSection headerText="Advanced settings">Retry policy</ExpandableSection>);
    const button = screen.getByRole('button', { name: 'Advanced settings' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    const content = document.getElementById(button.getAttribute('aria-controls')!)!;
    expect(content).toHaveTextContent('Retry policy');
    expect(content).not.toBeVisible();
  });

  test('opens and closes on click when uncontrolled', () => {
    const onChange = vi.fn();
    render(
      <ExpandableSection headerText="Advanced settings" onChange={event => onChange(event.detail)}>
        Retry policy
      </ExpandableSection>
    );
    const button = screen.getByRole('button', { name: 'Advanced settings' });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('group', { name: 'Advanced settings' })).toBeVisible();
    expect(onChange).toHaveBeenLastCalledWith({ expanded: true });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).toHaveBeenLastCalledWith({ expanded: false });
  });

  test('defaultExpanded opens the section on first render', () => {
    render(
      <ExpandableSection headerText="Logs" defaultExpanded={true}>
        Log lines
      </ExpandableSection>
    );
    expect(screen.getByRole('button', { name: 'Logs' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Log lines')).toBeVisible();
  });

  test('a controlled section only changes when the parent updates it', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ExpandableSection headerText="Logs" expanded={false} onChange={event => onChange(event.detail)}>
        Log lines
      </ExpandableSection>
    );
    const button = screen.getByRole('button', { name: 'Logs' });
    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith({ expanded: true });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    rerender(
      <ExpandableSection headerText="Logs" expanded={true} onChange={event => onChange(event.detail)}>
        Log lines
      </ExpandableSection>
    );
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('works with keyboard through the native button', () => {
    function Controlled() {
      const [expanded, setExpanded] = useState(false);
      return (
        <ExpandableSection headerText="Logs" expanded={expanded} onChange={event => setExpanded(event.detail.expanded)}>
          Log lines
        </ExpandableSection>
      );
    }
    render(<Controlled />);
    const button = screen.getByRole('button', { name: 'Logs' });
    button.focus();
    expect(button).toHaveFocus();
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    // Enter and Space activate a native button with a click event.
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('the container variant renders an h2 heading with the counter, info and actions outside the button', () => {
    render(
      <ExpandableSection
        variant="container"
        headerText="Instances"
        headerCounter="(3)"
        headerDescription="Running in north-annex"
        headerInfo={<a href="#info">Info</a>}
        headerActions={<button>Add</button>}
      >
        Table
      </ExpandableSection>
    );
    const heading = screen.getByRole('heading', { level: 2 });
    const button = screen.getByRole('button', { name: 'Instances (3)' });
    expect(heading).toContainElement(button);
    expect(button).toHaveAccessibleDescription('Running in north-annex');
    expect(button).not.toContainElement(screen.getByRole('link', { name: 'Info' }));
    expect(button).not.toContainElement(screen.getByRole('button', { name: 'Add' }));
  });

  test('headingTagOverride sets the heading level, and other variants render no heading by default', () => {
    const { rerender } = render(<ExpandableSection headerText="Logs">Log lines</ExpandableSection>);
    expect(screen.queryByRole('heading')).toBeNull();
    rerender(
      <ExpandableSection headerText="Logs" headingTagOverride="h3">
        Log lines
      </ExpandableSection>
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Logs' })).toBeInTheDocument();
  });

  test('container extras are ignored outside the container variants', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ExpandableSection headerText="Logs" headerActions={<button>Add</button>} headerCounter="(3)">
        Log lines
      </ExpandableSection>
    );
    expect(screen.queryByRole('button', { name: 'Add' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Logs' })).toBeInTheDocument();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  test('the navigation and inline variants leave out the description', () => {
    render(
      <>
        <ExpandableSection variant="navigation" headerText="Compute" headerDescription="Hidden">
          Links
        </ExpandableSection>
        <ExpandableSection variant="inline" headerText="Details" headerDescription="Hidden">
          Text
        </ExpandableSection>
      </>
    );
    expect(screen.queryByText('Hidden')).toBeNull();
  });

  test('headerAriaLabel names the button', () => {
    render(
      <ExpandableSection headerText="More" headerAriaLabel="More about pricing">
        Text
      </ExpandableSection>
    );
    expect(screen.getByRole('button', { name: 'More about pricing' })).toBeInTheDocument();
  });

  test('focus() moves focus to the button', () => {
    const ref = React.createRef<ExpandableSectionProps.Ref>();
    render(
      <ExpandableSection ref={ref} headerText="Logs">
        Log lines
      </ExpandableSection>
    );
    ref.current?.focus();
    expect(screen.getByRole('button', { name: 'Logs' })).toHaveFocus();
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'logs', 'data-testid': 'section', className: 'custom' } as ExpandableSectionProps;
    render(<ExpandableSection {...props} headerText="Logs" />);
    const root = screen.getByTestId('section');
    expect(root).toHaveAttribute('id', 'logs');
    expect(root).not.toHaveClass('custom');
  });
});

describe('ExpandableSection test utilities and accessibility', () => {
  test('the wrapper reads the parts and toggles', () => {
    render(
      <ExpandableSection
        variant="container"
        headerText="Instances"
        headerCounter="(3)"
        headerDescription="Running"
        headerActions={<button>Add</button>}
      >
        Table
      </ExpandableSection>
    );
    const section = createWrapper().findExpandableSection()!;
    expect(section.isExpanded()).toBe(false);
    expect(section.findHeaderText().getText()).toBe('Instances (3)');
    expect(section.findHeaderCounter()!.getText()).toBe('(3)');
    expect(section.findHeaderDescription()!.getText()).toBe('Running');
    expect(section.findHeaderActions()!.getText()).toBe('Add');
    section.findExpandButton().click();
    expect(section.isExpanded()).toBe(true);
    expect(section.findContent().getElement()).toBeVisible();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <ExpandableSection headerText="Default" headerDescription="Description" defaultExpanded={true}>
          Content
        </ExpandableSection>
        <ExpandableSection variant="footer" headerText="Footer">
          Content
        </ExpandableSection>
        <ExpandableSection
          variant="container"
          headerText="Container"
          headerCounter="(2)"
          headerActions={<button>Add</button>}
          defaultExpanded={true}
        >
          Content
        </ExpandableSection>
        <ExpandableSection variant="stacked" headerText="Stacked one">
          Content
        </ExpandableSection>
        <ExpandableSection variant="stacked" headerText="Stacked two">
          Content
        </ExpandableSection>
        <ExpandableSection variant="navigation" headerText="Navigation">
          Content
        </ExpandableSection>
        <ExpandableSection variant="inline" headerText="Inline">
          Content
        </ExpandableSection>
      </>
    );
    await expectNoAxeViolations(container);
  });
});
