// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import RouteMap from '@ordinate/components/route-map';

export default function WithoutTerminus() {
  return (
    <RouteMap
      ariaLabel="Onboarding for new platform engineers"
      currentStopId="week1-4"
      lines={[
        {
          id: 'week1',
          title: 'Week 1',
          description: 'Accounts and access',
          stops: [
            { id: 'week1-1', status: 'done' },
            { id: 'week1-2', status: 'done' },
            { id: 'week1-3', status: 'done' },
            { id: 'week1-4', status: 'open' },
            { id: 'week1-5', status: 'planned', type: 'station' },
          ],
        },
        {
          id: 'week2',
          title: 'Week 2',
          description: 'First on-call shadow',
          stops: [
            { id: 'week2-1', status: 'planned' },
            { id: 'week2-2', status: 'planned' },
            { id: 'week2-3', status: 'planned', type: 'station' },
          ],
        },
      ]}
    />
  );
}
