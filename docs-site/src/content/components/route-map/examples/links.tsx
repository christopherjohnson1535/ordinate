// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import RouteMap, { RouteMapProps } from '@ordinate/components/route-map';
import SpaceBetween from '@ordinate/components/space-between';

const modules: { id: string; title: string; done: number; total: number }[] = [
  { id: 'networking', title: 'Networking', done: 5, total: 5 },
  { id: 'storage', title: 'Storage and backups', done: 2, total: 6 },
  { id: 'deploys', title: 'Deploying safely', done: 0, total: 4 },
];

const lines: RouteMapProps.Line[] = modules.map(module => ({
  id: module.id,
  title: module.title,
  description: `${module.done} of ${module.total} done`,
  href: `#/components/route-map?module=${module.id}`,
  stops: Array.from({ length: module.total }, (_, i) => ({
    id: `${module.id}-${i + 1}`,
    status: i < module.done ? 'done' : i === module.done ? 'open' : 'planned',
    type: i === module.total - 1 ? 'station' : 'stop',
  })),
}));

export default function Links() {
  const [selected, setSelected] = useState('storage');
  const module = modules.find(m => m.id === selected);

  return (
    <SpaceBetween size="m">
      <RouteMap
        lines={lines}
        terminus={{ title: 'Capstone', href: '#/components/route-map?module=capstone' }}
        selectedLineId={selected}
        currentStopId="storage-3"
        currentStopLabel="Next up"
        ariaLabel="Course modules"
        onFollow={event => {
          event.preventDefault();
          setSelected(event.detail.lineId ?? 'capstone');
        }}
      />
      <Box color="text-body-secondary">
        {module
          ? `${module.title}: ${module.done} of ${module.total} lessons done.`
          : 'Capstone: opens when every module is done.'}
      </Box>
    </SpaceBetween>
  );
}
