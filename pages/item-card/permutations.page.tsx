// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import ButtonDropdown from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import Container from '~components/container';
import ItemCard from '~components/item-card';
import Link from '~components/link';
import StatusIndicator from '~components/status-indicator';

import styles from './styles.module.scss';

// A plan view of a server rack, so the media slot has something drawn like the rest of the page.
function Plan() {
  return (
    <svg viewBox="0 0 320 120" role="img" aria-label="Rack plan" fill="none" stroke="currentColor">
      <rect x="0" y="0" width="320" height="120" className={styles['plan-ground']} stroke="none" />
      <rect x="40" y="24" width="240" height="72" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5].map(index => (
        <rect key={index} x={52 + index * 38} y="36" width="30" height="48" strokeWidth="1" />
      ))}
      <path d="M40 108h240M40 104v8M280 104v8" strokeWidth="0.75" />
    </svg>
  );
}

const actions = (
  <ButtonDropdown
    variant="icon"
    ariaLabel="Actions for node-01"
    items={[
      { id: 'restart', text: 'Restart' },
      { id: 'stop', text: 'Stop' },
    ]}
  />
);

function SelectableCard() {
  const [selected, setSelected] = useState(true);
  return (
    <ItemCard
      header={<Link href="#node-02">node-02</Link>}
      description="m7.xlarge in us-east-1b"
      selected={selected}
      selectionControl={
        <Checkbox checked={selected} onChange={event => setSelected(event.detail.checked)} ariaLabel="Select node-02" />
      }
    >
      <StatusIndicator type="success">Running</StatusIndicator>
    </ItemCard>
  );
}

export default function ItemCardPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">Item card</Box>

      <div className={styles.grid}>
        <ItemCard header="node-01" description="m7.large in us-east-1a" actions={actions}>
          Running for 720 hours.
        </ItemCard>

        <SelectableCard />

        <ItemCard
          header="node-03"
          description="c7.large in us-east-1c"
          footer={<Link href="#node-03">View details</Link>}
          media={<Plan />}
        >
          <StatusIndicator type="stopped">Stopped</StatusIndicator>
        </ItemCard>

        <ItemCard
          header="node-04"
          description="Being retired"
          disabled={true}
          selectionControl={<Checkbox checked={false} disabled={true} ariaLabel="Select node-04" />}
        >
          Cannot be selected.
        </ItemCard>

        <ItemCard header="A card with a header long enough to wrap onto a second line" actions={actions}>
          Header only, with actions.
        </ItemCard>

        <ItemCard>Content only.</ItemCard>
      </div>

      <Box variant="h2">Embedded</Box>
      <Container header="Selected node">
        <ItemCard
          variant="embedded"
          header="node-01"
          description="m7.large in us-east-1a"
          footer="Updated 2 minutes ago"
          actions={actions}
        >
          Running for 720 hours.
        </ItemCard>
      </Container>
    </div>
  );
}
