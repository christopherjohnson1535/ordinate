// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import RouteMap, { RouteMapProps } from '~components/route-map';

import styles from '../drawings.module.scss';

function line(id: string, title: string, statuses: RouteMapProps.Stop['status'][], lab: RouteMapProps.Stop['status']) {
  const done = statuses.filter(s => s === 'done').length;
  return {
    id,
    title,
    description: done ? `${done} of ${statuses.length} lessons done` : `${statuses.length} lessons and a lab`,
    href: `#${id}`,
    stops: [
      ...statuses.map((status, i) => ({ id: `${id}-${i + 1}`, status })),
      { id: `${id}-lab`, status: lab, type: 'station' as const },
    ],
  };
}

const lines: RouteMapProps.Line[] = [
  line('api', 'API and data modeling', ['done', 'done', 'open', 'planned', 'planned'], 'planned'),
  line('postgres', 'Postgres', ['open', 'planned', 'planned', 'planned', 'planned', 'planned'], 'planned'),
  line('kubernetes', 'Kubernetes', ['done', 'done', 'done', 'done', 'done', 'done', 'done'], 'done'),
  line('observability', 'Observability', ['planned', 'planned', 'planned', 'planned', 'planned'], 'planned'),
  line('rag', 'RAG', ['planned', 'planned', 'planned', 'planned', 'planned'], 'planned'),
];

export default function RouteMapPermutations() {
  const [selected, setSelected] = useState('api');
  return (
    <article className={styles.page}>
      <h1>Route map</h1>
      <section className={styles.section}>
        <h2>Lines into a terminus, with a selected line and the current stop</h2>
        <p>Follow a line to select it. Selected: {selected}</p>
        <RouteMap
          lines={lines}
          terminus={{ title: 'Capstone', description: 'One lab across all five', href: '#capstone' }}
          selectedLineId={selected}
          currentStopId="api-3"
          ariaLabel="Course route"
          onFollow={event => {
            event.preventDefault();
            if (event.detail.lineId) {
              setSelected(event.detail.lineId);
            }
          }}
        />
      </section>
      <section className={styles.section}>
        <h2>Without a terminus or links</h2>
        <div className={styles.wide}>
          <RouteMap
            lines={lines.slice(0, 2).map(l => ({ ...l, href: undefined }))}
            currentStopId="postgres-1"
            currentStopLabel="Next up"
            ariaLabel="Two lines"
          />
        </div>
      </section>
      <section className={styles.section}>
        <h2>One line</h2>
        <RouteMap lines={lines.slice(2, 3)} terminus={{ title: 'Capstone' }} ariaLabel="One line" />
      </section>
    </article>
  );
}
