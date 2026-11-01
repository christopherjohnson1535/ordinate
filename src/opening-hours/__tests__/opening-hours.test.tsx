// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import I18nProvider from '../../../lib/components/i18n';
import OpeningHours, { OpeningHoursProps } from '../../../lib/components/opening-hours';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const week: OpeningHoursProps.Day[] = [
  { day: 'monday', closed: true, note: 'Workshop day' },
  { day: 'tuesday', opens: '08:00', closes: '18:00' },
  { day: 'wednesday', opens: '08:00', closes: '17:30', note: 'Late repairs until 8' },
  { day: 'sunday' },
];

const wrapper = () => createWrapper().findOpeningHours()!;
const normalize = (text: string) => text.replace(/[\u2009\u202f]/g, ' ');

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('OpeningHours', () => {
  test('renders a table named by its caption, with a row header per day', () => {
    render(<OpeningHours caption="Opening hours" days={week} locale="en-GB" />);
    const table = screen.getByRole('table', { name: 'Opening hours' });
    const headers = within(table).getAllByRole('rowheader');
    expect(headers.map(header => header.textContent)).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Sunday']);
    expect(wrapper().findCaption()!.getText()).toBe('Opening hours');
  });

  test('writes times in the locale, with machine-readable time elements', () => {
    render(<OpeningHours days={week} locale="en-GB" />);
    const tuesday = wrapper().findRows()[1];
    expect(normalize(wrapper().findRowValue(tuesday).getText())).toBe('8:00 – 18:00');
    const times = tuesday.findAll('time').map(time => time.getElement().getAttribute('datetime'));
    expect(times).toEqual(['08:00', '18:00']);
  });

  test('timeFormat picks a 12- or 24-hour clock regardless of locale', () => {
    const { rerender } = render(<OpeningHours days={week} locale="en-GB" timeFormat="12h" />);
    expect(normalize(wrapper().findRowValue(wrapper().findRows()[2]).getText())).toMatch(/^8:00 am – 5:30 pm$/i);
    rerender(<OpeningHours days={week} locale="en-US" timeFormat="24h" />);
    expect(normalize(wrapper().findRowValue(wrapper().findRows()[2]).getText())).toBe('08:00 – 17:30');
  });

  test('names days in the locale unless a label is given', () => {
    render(
      <OpeningHours
        days={[
          { day: 'monday', opens: '9:00', closes: '17:00' },
          { day: 'friday', label: 'Fri' },
        ]}
        locale="de-DE"
      />
    );
    expect(
      wrapper()
        .findRows()
        .map(row => wrapper().findRowLabel(row).getText())
    ).toEqual(['Montag', 'Fri']);
  });

  test('shows closed days, including days without times, with their notes', () => {
    render(<OpeningHours days={week} />);
    const closed = wrapper().findClosedRows();
    expect(closed).toHaveLength(2);
    expect(wrapper().findRowValue(closed[0]).getText()).toBe('Closed');
    expect(wrapper().findRowNote(closed[0])!.getText()).toBe('Workshop day');
    expect(wrapper().findRowNote(wrapper().findRows()[2])!.getText()).toBe('Late repairs until 8');
  });

  test('closedText and todayText replace the built-in words, and so does the I18nProvider', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 1, 12));
    const { rerender } = render(
      <OpeningHours days={week} closedText="Closed, riding" todayText="Now" highlightToday={true} />
    );
    expect(wrapper().findRowValue(wrapper().findClosedRows()[0]).getText()).toBe('Closed, riding');
    expect(wrapper().findTodayMarker()!.getText()).toBe('Now');

    rerender(
      <I18nProvider
        locale="en"
        messages={[{ '@ordinate/components': { en: { 'opening-hours': { closedText: 'Shut' } } } }]}
      >
        <OpeningHours days={week} />
      </I18nProvider>
    );
    expect(wrapper().findRowValue(wrapper().findClosedRows()[0]).getText()).toBe('Shut');
  });

  test("highlightToday marks the visitor's day, with the word in the row header", () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    // 3 November 2026 is a Tuesday.
    vi.setSystemTime(new Date(2026, 10, 3, 9));
    render(<OpeningHours days={week} highlightToday={true} locale="en-GB" />);
    const today = wrapper().findTodayRow()!;
    expect(wrapper().findRowLabel(today).getText()).toBe('Tuesday');
    expect(screen.getByRole('rowheader', { name: /^Tuesday\s*,\s*Today$/ })).toBeInTheDocument();
    expect(wrapper().findTodayMarker()!.getText()).toBe('Today');
  });

  test('does not mark today unless asked', () => {
    render(<OpeningHours days={week} />);
    expect(wrapper().findTodayRow()).toBeNull();
  });

  test('free-form rows show their label and value, and days take precedence', () => {
    const rows = [
      { label: '24 December', value: '09:00 to 13:00' },
      { label: '25 December', value: 'Closed' },
    ];
    const { rerender } = render(<OpeningHours rows={rows} />);
    expect(screen.getAllByRole('rowheader').map(header => header.textContent)).toEqual(['24 December', '25 December']);
    expect(wrapper().findRowValue(wrapper().findRows()[0]).getText()).toBe('09:00 to 13:00');
    rerender(<OpeningHours rows={rows} days={week.slice(0, 1)} locale="en-GB" />);
    expect(wrapper().findRows()).toHaveLength(1);
  });

  test('shows a time it cannot read as written, and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<OpeningHours days={[{ day: 'monday', opens: 'noon', closes: '24:00' }]} locale="en-GB" />);
    expect(normalize(wrapper().findRowValue(wrapper().findRows()[0]).getText())).toBe('noon – 0:00');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"noon"'));
  });

  test('passes id and data attributes to the root', () => {
    render(<OpeningHours days={week} id="hours" data-testid="hours" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'hours');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'hours');
  });

  test('has no axe violations, in both variants', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 2, 9));
    const { container } = render(
      <>
        <OpeningHours caption="Opening hours" days={week} highlightToday={true} />
        <OpeningHours caption="Holidays" variant="inverted" rows={[{ label: '24 December', value: 'Closed' }]} />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
