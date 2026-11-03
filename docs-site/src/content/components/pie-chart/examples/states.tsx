// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import PieChart from '@ordinate/charts/pie-chart';
import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';

export default function States() {
  return (
    <ColumnLayout columns={3}>
      <PieChart data={[]} size="small" statusType="loading" loadingText="Loading visits" ariaLabel="Visits, loading" />
      <PieChart
        data={[]}
        size="small"
        statusType="error"
        errorText="Visit counts could not be loaded."
        recoveryText="Retry"
        onRecoveryClick={() => undefined}
        ariaLabel="Visits, failed to load"
      />
      <PieChart
        data={[
          { title: 'Archive', value: 0 },
          { title: 'Model shop', value: 0 },
        ]}
        size="small"
        ariaLabel="Visits, none recorded"
        empty={
          <Box textAlign="center" color="text-body-secondary">
            <b>No visits</b>
            <Box variant="p" color="inherit">
              No one has signed in at these sites this week.
            </Box>
          </Box>
        }
      />
    </ColumnLayout>
  );
}
