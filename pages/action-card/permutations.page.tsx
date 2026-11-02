// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ActionCard from '~components/action-card';
import Box from '~components/box';

import styles from './styles.module.scss';

export default function ActionCardPermutations() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className={styles.page}>
      <Box variant="h1">Action card</Box>
      <Box variant="p">Button cards clicked: {clicks}</Box>

      <div className={styles.grid}>
        <ActionCard
          header="Create a cluster"
          description="Start with three nodes in one region."
          iconName="add"
          onClick={() => setClicks(count => count + 1)}
        />
        <ActionCard
          header="Import a cluster"
          description="Bring an existing cluster under management."
          iconName="upload"
          onClick={() => setClicks(count => count + 1)}
        >
          Takes about five minutes.
        </ActionCard>
        <ActionCard
          header="Read the guide"
          description="How node pools, zones and rollouts fit together."
          iconName="file-open"
          href="#action-card/permutations"
          onFollow={event => event.preventDefault()}
        />
        <ActionCard header="Open the console" description="In a new tab." href="#" target="_blank" />
        <ActionCard header="Migrate" description="Not available on the free plan." iconName="redo" disabled={true} />
        <ActionCard header="Archive" description="A disabled link." href="#archive" disabled={true} />
        <ActionCard header="No icon or description" />
      </div>
    </div>
  );
}
