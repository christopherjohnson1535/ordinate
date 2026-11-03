// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import RouteMap, { RouteMapProps } from '@ordinate/components/route-map';

type Status = RouteMapProps.Stop['status'];

function line(id: string, title: string, lessons: Status[], lab: Status): RouteMapProps.Line {
  const done = lessons.filter(status => status === 'done').length;
  return {
    id,
    title,
    description: done ? `${done} of ${lessons.length} lessons done` : `${lessons.length} lessons and a lab`,
    stops: [
      ...lessons.map((status, i) => ({ id: `${id}-${i + 1}`, status })),
      { id: `${id}-lab`, status: lab, type: 'station' as const },
    ],
  };
}

const lines = [
  line('networking', 'Networking', ['done', 'done', 'done', 'done', 'done'], 'done'),
  line('storage', 'Storage and backups', ['done', 'done', 'open', 'planned', 'planned', 'planned'], 'planned'),
  line('deploys', 'Deploying safely', ['open', 'open', 'planned', 'planned'], 'planned'),
  line('observability', 'Observability', ['planned', 'planned', 'planned', 'planned', 'planned'], 'planned'),
];

export default function Course() {
  return (
    <RouteMap
      lines={lines}
      terminus={{ title: 'Capstone', description: 'A week on call' }}
      currentStopId="storage-3"
      ariaLabel="Platform course route"
    />
  );
}
