// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import ColumnLayout from '../../../lib/components/column-layout';
import I18nProvider from '../../../lib/components/i18n';
import KeyValuePairs from '../../../lib/components/key-value-pairs';
import Measure, { MeasureProps } from '../../../lib/components/measure';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const wrapper = () => createWrapper().findMeasure()!;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Measure', () => {
  test('shows the label, the formatted reading with its unit, and the description', () => {
    render(<Measure label="Requests per minute" value={4210} description="last 24 h" />);
    expect(wrapper().findLabel()!.getText()).toBe('Requests per minute');
    expect(wrapper().findValue().getText()).toBe('4,210');
    expect(wrapper().findDescription()!.getText()).toBe('last 24 h');
    expect(wrapper().findRuler()).toBeNull();
  });

  test('shows text values as they are', () => {
    render(<Measure label="Uptime" value="99.98%" />);
    expect(wrapper().findValue().getText()).toBe('99.98%');
  });

  test('with max, says the numbers in text and draws a ruler hidden from screen readers', () => {
    render(<Measure label="Nodes in service" value={20} max={32} unit="nodes" />);
    expect(wrapper().findReading().getElement()).toHaveTextContent('20 of 32 nodes');
    const ruler = wrapper().findRuler()!;
    expect(ruler.getElement()).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper().findRun()!.getElement().style.inlineSize).toBe('62.5%');
    // Major ticks every 5 nodes and a minor tick for each node, from 0 to 32.
    expect(wrapper().findTicks()).toHaveLength(33);
  });

  test('current sets the run when the value is text, and is clamped to the scale', () => {
    const { rerender } = render(<Measure value="99.98%" current={99.98} max={100} />);
    expect(wrapper().findRun()!.getElement().style.inlineSize).toBe('99.98%');
    rerender(<Measure value={40} max={32} />);
    expect(wrapper().findRun()!.getElement().style.inlineSize).toBe('100%');
  });

  test('a text value without current draws the ruler without a run', () => {
    render(<Measure value="n/a" max={10} />);
    expect(wrapper().findRuler()).not.toBeNull();
    expect(wrapper().findRun()).toBeNull();
  });

  test('draws a dashed limit named by limitLabel, or by the built-in label', () => {
    const { rerender } = render(
      <Measure label="Slowest 5% of requests" value={182} unit="ms" max={250} limit={200} limitLabel="target 200 ms" />
    );
    expect(wrapper().findLimitMark()!.getElement().style.insetInlineStart).toBe('80%');
    expect(wrapper().findLimitLabel()!.getText()).toBe('target 200 ms');
    // The label hangs toward the side with more room.
    expect(wrapper().findLimitLabel()!.getElement().style.marginInlineEnd).toBe('20%');
    rerender(<Measure value={182} max={250} limit={50} />);
    expect(wrapper().findLimitLabel()!.getText()).toBe('Limit 50');
    expect(wrapper().findLimitLabel()!.getElement().style.marginInlineStart).toBe('20%');
  });

  test('warns about a limit or max that cannot be drawn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Measure value={3} limit={5} />);
    expect(wrapper().findLimitMark()).toBeNull();
    expect(wrapper().findLimitLabel()).toBeNull();
    render(<Measure value={3} max={0} />);
    expect(warn).toHaveBeenCalled();
  });

  test('format replaces the number format', () => {
    render(<Measure value={0.42} max={1} format={value => `${Math.round(value * 100)}%`} />);
    expect(wrapper().findReading().getElement()).toHaveTextContent('42% of 100%');
  });

  test('uses the provider locale for numbers and its messages for the words', () => {
    render(
      <I18nProvider locale="de" messages={[{ '@ordinate-ui/components': { de: { measure: { ofMax: 'von {max}' } } } }]}>
        <Measure value={4210} max={5000} />
      </I18nProvider>
    );
    expect(wrapper().findReading().getElement()).toHaveTextContent('4.210 von 5.000');
  });

  test('i18nStrings replace the built-in words', () => {
    render(
      <Measure
        value={3}
        max={8}
        limit={6}
        i18nStrings={{ ofMax: max => `out of ${max}`, limitLabel: limit => `Quota ${limit}` }}
      />
    );
    expect(wrapper().findReading().getElement()).toHaveTextContent('3 out of 8');
    expect(wrapper().findLimitLabel()!.getText()).toBe('Quota 6');
  });

  test('fits in a column layout and in a key-value pair', () => {
    render(
      <>
        <ColumnLayout columns={2}>
          <Measure label="Nodes" value={20} max={32} />
          <Measure label="Uptime" value="99.98%" />
        </ColumnLayout>
        <KeyValuePairs items={[{ label: 'Disk', value: <Measure value={61} unit="%" max={100} /> }]} />
      </>
    );
    expect(createWrapper().findAllMeasures()).toHaveLength(3);
    expect(screen.getByText('Disk')).toBeInTheDocument();
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'nodes', 'data-testid': 'measure', className: 'custom', value: 1 } as MeasureProps;
    render(<Measure {...props} />);
    const root = screen.getByTestId('measure');
    expect(root).toHaveAttribute('id', 'nodes');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <ColumnLayout columns={2}>
        <Measure label="Nodes in service" value={20} max={32} unit="nodes" description="of the fleet" />
        <Measure label="Latency" value={182} unit="ms" max={250} limit={200} limitLabel="target 200 ms" />
      </ColumnLayout>
    );
    await expectNoAxeViolations(container);
  });
});
