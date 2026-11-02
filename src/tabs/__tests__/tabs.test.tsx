// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import Tabs, { TabsProps } from '../../../lib/components/tabs';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import marksStyles from '../../../lib/components/internal/components/crop-marks/styles.css.js';
import tabsStyles from '../../../lib/components/tabs/styles.css.js';

const tabs: TabsProps.Tab[] = [
  { id: 'overview', label: 'Overview', content: 'Overview content' },
  { id: 'nodes', label: 'Nodes', content: 'Nodes content' },
  { id: 'billing', label: 'Billing', content: 'Billing content', disabled: true, disabledReason: 'Owners only' },
  { id: 'logs', label: 'Logs', content: 'Logs content' },
];

function Controlled(props: Partial<TabsProps> & { onChangeSpy?: (detail: TabsProps.ChangeDetail) => void }) {
  const { onChangeSpy, ...rest } = props;
  const [active, setActive] = useState(props.activeTabId ?? 'overview');
  return (
    <Tabs
      tabs={tabs}
      ariaLabel="Project"
      {...rest}
      activeTabId={active}
      onChange={event => {
        onChangeSpy?.(event.detail);
        setActive(event.detail.activeTabId);
      }}
    />
  );
}

const wrapper = () => createWrapper().findTabs()!;

afterEach(() => {
  document.documentElement.removeAttribute('dir');
  vi.restoreAllMocks();
});

describe('Tabs', () => {
  test('renders a tab list with linked panels', () => {
    render(<Controlled />);
    expect(screen.getByRole('tablist', { name: 'Project' })).toBeInTheDocument();
    const tab = screen.getByRole('tab', { name: 'Overview' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    expect(panel).toHaveTextContent('Overview content');
    for (const other of screen.getAllByRole('tab').slice(1)) {
      expect(document.getElementById(other.getAttribute('aria-controls')!)).not.toBeNull();
    }
  });

  test('uses a roving tab stop on the active tab', () => {
    render(<Controlled activeTabId="nodes" />);
    const tabStops = screen.getAllByRole('tab').filter(tab => tab.getAttribute('tabindex') === '0');
    expect(tabStops).toEqual([screen.getByRole('tab', { name: 'Nodes' })]);
  });

  test('clicking a tab activates it and fires onChange', () => {
    const onChangeSpy = vi.fn();
    render(<Controlled onChangeSpy={onChangeSpy} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Nodes' }));
    expect(onChangeSpy).toHaveBeenCalledWith({ activeTabId: 'nodes', activeTabHref: undefined });
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Nodes content');
  });

  test('a disabled tab cannot be activated', () => {
    const onChangeSpy = vi.fn();
    render(<Controlled onChangeSpy={onChangeSpy} />);
    const billing = screen.getByRole('tab', { name: 'Billing' });
    expect(billing).toHaveAttribute('aria-disabled', 'true');
    expect(billing).toHaveAccessibleDescription('Owners only');
    fireEvent.click(billing);
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  test('arrow keys move focus and activate tabs, wrapping around', () => {
    const onChangeSpy = vi.fn();
    render(<Controlled onChangeSpy={onChangeSpy} />);
    const [overview, nodes, billing, logs] = screen.getAllByRole('tab');
    act(() => overview.focus());
    fireEvent.keyDown(overview, { key: 'ArrowRight' });
    expect(nodes).toHaveFocus();
    expect(onChangeSpy).toHaveBeenLastCalledWith({ activeTabId: 'nodes', activeTabHref: undefined });
    // A disabled tab takes focus, so its reason can be read, but stays inactive.
    fireEvent.keyDown(nodes, { key: 'ArrowRight' });
    expect(billing).toHaveFocus();
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(billing, { key: 'ArrowRight' });
    expect(logs).toHaveFocus();
    fireEvent.keyDown(logs, { key: 'ArrowRight' });
    expect(overview).toHaveFocus();
    fireEvent.keyDown(overview, { key: 'ArrowLeft' });
    expect(logs).toHaveFocus();
  });

  test('Home and End move to the first and last tab', () => {
    render(<Controlled activeTabId="nodes" />);
    const all = screen.getAllByRole('tab');
    act(() => all[1].focus());
    fireEvent.keyDown(all[1], { key: 'End' });
    expect(all[3]).toHaveFocus();
    expect(all[3]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(all[3], { key: 'Home' });
    expect(all[0]).toHaveFocus();
  });

  test('arrow keys follow the reading direction in right-to-left layout', () => {
    document.documentElement.dir = 'rtl';
    render(
      <div style={{ direction: 'rtl' }}>
        <Controlled />
      </div>
    );
    const [overview, nodes] = screen.getAllByRole('tab');
    act(() => overview.focus());
    fireEvent.keyDown(overview, { key: 'ArrowLeft' });
    expect(nodes).toHaveFocus();
    fireEvent.keyDown(nodes, { key: 'ArrowRight' });
    expect(overview).toHaveFocus();
  });

  test('without activeTabId it manages the active tab itself', () => {
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} ariaLabel="Project" onChange={onChange} />);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('tab', { name: 'Logs' }));
    expect(screen.getByRole('tab', { name: 'Logs' })).toHaveAttribute('aria-selected', 'true');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('a tab with href is a link that reports its href', () => {
    const onChangeSpy = vi.fn();
    render(
      <Controlled
        tabs={[
          { id: 'a', label: 'First', href: '#first' },
          { id: 'b', label: 'Second', href: '#second' },
        ]}
        activeTabId="a"
        onChangeSpy={onChangeSpy}
      />
    );
    const second = screen.getByRole('tab', { name: 'Second' });
    expect(second.tagName).toBe('A');
    expect(second).toHaveAttribute('href', '#second');
    fireEvent.click(second, { ctrlKey: true });
    expect(onChangeSpy).not.toHaveBeenCalled();
    fireEvent.click(second);
    expect(onChangeSpy).toHaveBeenCalledWith({ activeTabId: 'b', activeTabHref: '#second' });
  });

  test('dismissible tabs have a close button that fires onDismiss', () => {
    const onDismiss = vi.fn();
    render(
      <Controlled
        tabs={[
          { id: 'a', label: 'Query 1', dismissible: true, dismissLabel: 'Close Query 1', onDismiss },
          { id: 'b', label: 'Query 2', dismissible: true },
        ]}
        activeTabId="a"
      />
    );
    const close = screen.getByRole('button', { name: 'Close Query 1' });
    expect(close).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Close tab' })).toHaveAttribute('tabindex', '-1');
    fireEvent.click(close);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss.mock.calls[0][0].detail).toEqual({ tabId: 'a' });
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Query 1' }), { key: 'Delete' });
    expect(onDismiss).toHaveBeenCalledTimes(2);
    expect(wrapper().findDismissButtonByTabId('b')).not.toBeNull();
  });

  test('renders an action next to its tab', () => {
    render(
      <Controlled tabs={[{ id: 'a', label: 'Query', action: <button type="button">Rename</button> }]} activeTabId="a" />
    );
    expect(wrapper().findActionByTabId('a')!.getText()).toBe('Rename');
  });

  test('disableContentPaddings and variants set the layout', () => {
    render(<Controlled variant="container" disableContentPaddings={true} />);
    expect(wrapper().findTabContent()!.getText()).toBe('Overview content');
  });

  test('shows the disabled reason on hover', () => {
    render(<Controlled />);
    const billing = screen.getByRole('tab', { name: 'Billing' });
    fireEvent.mouseEnter(billing);
    expect(wrapper().getElement().textContent).toContain('Owners only');
    fireEvent.mouseLeave(billing);
  });

  test('shows scroll buttons when the tabs overflow', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(800);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
    const scrollBy = vi.fn();
    HTMLElement.prototype.scrollBy = scrollBy;
    render(<Controlled />);
    const left = screen.getByRole('button', { name: 'Scroll to previous tabs' });
    const right = screen.getByRole('button', { name: 'Scroll to next tabs' });
    expect(left).toBeDisabled();
    expect(right).toBeEnabled();
    fireEvent.click(right);
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: 225 }));
    delete (HTMLElement.prototype as Partial<HTMLElement>).scrollBy;
  });

  test('i18nStrings name the scroll buttons', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(800);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
    render(<Controlled i18nStrings={{ scrollLeftAriaLabel: 'Back', scrollRightAriaLabel: 'Forward' }} />);
    expect(wrapper().findScrollLeftButton()!.getElement()).toHaveAccessibleName('Back');
    expect(wrapper().findScrollRightButton()!.getElement()).toHaveAccessibleName('Forward');
  });
});

describe('Tabs drawing', () => {
  test('one set of open ink crop marks marks the active tab, hidden from assistive technology', () => {
    render(<Controlled />);
    const marks = wrapper().findAllByClassName(marksStyles.root);
    expect(marks).toHaveLength(1);
    const element = marks[0].getElement();
    expect(element).toHaveAttribute('aria-hidden', 'true');
    expect(element).toHaveClass(marksStyles.selected, marksStyles.open);
    expect(element.parentElement).toHaveClass(tabsStyles.marker);
  });

  test("shows each tab's reference after its label, as part of its name", () => {
    render(
      <Tabs
        ariaLabel="Cluster"
        kind="resource"
        tabs={[
          { id: 'a', label: 'Overview', reference: 'R1', content: 'A' },
          { id: 'b', label: 'Nodes', content: 'B' },
        ]}
      />
    );
    expect(screen.getByRole('tab', { name: 'Overview R1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Nodes' })).toBeInTheDocument();
    expect(wrapper().getElement()).toHaveClass(tabsStyles['kind-resource']);
  });
});

describe('Tabs test utilities and accessibility', () => {
  test('the wrapper finds tabs, the active tab and the content', () => {
    render(<Controlled />);
    expect(wrapper().findTabLinks()).toHaveLength(4);
    wrapper().findTabLinkByIndex(2)!.click();
    expect(wrapper().findActiveTab()!.getText()).toBe('Nodes');
    expect(wrapper().findTabContent()!.getText()).toBe('Nodes content');
    expect(wrapper().findTabLinkById('logs')!.getText()).toBe('Logs');
    expect(wrapper().findScrollLeftButton()).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Controlled />
        <Tabs
          ariaLabel="Queries"
          variant="container"
          tabs={[
            {
              id: 'a',
              label: 'Query 1',
              content: 'Select * from nodes',
              dismissible: true,
              dismissLabel: 'Close Query 1',
              action: <button type="button">Rename</button>,
            },
            { id: 'b', label: 'Query 2', href: '#query-2', dismissible: true, dismissLabel: 'Close Query 2' },
          ]}
        />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
