// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Calendar, { CalendarProps } from '~components/calendar';

import styles from './styles.module.scss';

function Example({
  title,
  initial = '',
  ...props
}: Omit<CalendarProps, 'value'> & { title: string; initial?: string }) {
  const [value, setValue] = useState(initial);
  const titleId = `calendar-${title.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <section className={styles.section}>
      <h2 id={titleId}>{title}</h2>
      <Calendar {...props} ariaLabelledby={titleId} value={value} onChange={event => setValue(event.detail.value)} />
      <p>Value: &quot;{value}&quot;</p>
    </section>
  );
}

const isWeekday = (date: Date) => date.getDay() !== 0 && date.getDay() !== 6;

export default function CalendarPermutations() {
  return (
    <article className={styles.page}>
      <h1>Calendar permutations</h1>
      <div className={styles.grid}>
        <Example title="Selected date" initial="2026-03-05" />
        <Example title="Nothing selected" />
        <Example
          title="Weekdays only"
          initial="2026-03-11"
          isDateEnabled={isWeekday}
          dateDisabledReason={() => 'Deliveries run on weekdays only.'}
        />
        <Example title="Week starting on Sunday" initial="2026-03-05" startOfWeek={0} />
        <Example title="German locale" initial="2026-03-05" locale="de-DE" />
        <Example title="Arabic locale" initial="2026-03-05" locale="ar-EG" />
        <Example title="Month granularity" granularity="month" initial="2026-03" />
        <Example
          title="Months from April"
          granularity="month"
          initial="2026-06"
          isDateEnabled={date => date >= new Date(2026, 3, 1)}
          dateDisabledReason={() => 'Budgets open in April.'}
        />
      </div>
    </article>
  );
}
