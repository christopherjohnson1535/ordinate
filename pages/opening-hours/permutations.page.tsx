// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import OpeningHours, { OpeningHoursProps } from '~components/opening-hours';

import styles from './styles.module.scss';

const shopDays: OpeningHoursProps.Day[] = [
  { day: 'monday', closed: true, note: 'Workshop day' },
  { day: 'tuesday', opens: '08:00', closes: '18:00' },
  { day: 'wednesday', opens: '08:00', closes: '18:00' },
  { day: 'thursday', opens: '08:00', closes: '20:00', note: 'Late repairs until 8' },
  { day: 'friday', opens: '08:00', closes: '18:00' },
  { day: 'saturday', opens: '09:00', closes: '16:30' },
  { day: 'sunday', closed: true, note: 'Riding' },
];

function Example({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

// A bike shop's week: on the page, on an inverted band with today marked, on a 12-hour clock, in
// another language, and as free-form rows.
export default function OpeningHoursPermutations() {
  return (
    <div className={styles.page}>
      <div className={styles.pair}>
        <Example title="On the page, today marked">
          <OpeningHours caption="Opening hours" days={shopDays} highlightToday={true} />
        </Example>
        <Example title="Inverted band, today marked">
          <OpeningHours
            caption="When we are in"
            variant="inverted"
            days={[{ day: 'monday', opens: '10:00', closes: '18:00' }, ...shopDays.slice(1, 6), { day: 'sunday' }]}
            closedText="Closed, riding"
            highlightToday={true}
          />
        </Example>
      </div>
      <div className={styles.pair}>
        <Example title="12-hour clock, no caption">
          <OpeningHours days={shopDays.slice(1, 6)} timeFormat="12h" />
        </Example>
        <Example title="German, 24-hour clock from the locale">
          <OpeningHours caption="Öffnungszeiten" locale="de-DE" days={shopDays} closedText="Geschlossen" />
        </Example>
      </div>
      <div className={styles.pair}>
        <Example title="Free-form rows">
          <OpeningHours
            caption="Holidays"
            rows={[
              { label: '24 December', value: '09:00 – 13:00' },
              { label: '25 and 26 December', value: 'Closed' },
              { label: '31 December', value: '09:00 – 15:00' },
            ]}
          />
        </Example>
        <Example title="Narrow">
          <div className={styles.narrow}>
            <OpeningHours caption="Café" days={shopDays.slice(4)} highlightToday={true} variant="inverted" />
          </div>
        </Example>
      </div>
    </div>
  );
}
