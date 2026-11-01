// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import TokenGroup, { TokenGroupProps } from '~components/token-group';

import styles from './styles.module.scss';

const regions: TokenGroupProps.Item[] = [
  { label: 'US East', description: 'Virginia', iconName: 'globe' },
  { label: 'US West', labelTag: 'us-west-2', description: 'Oregon' },
  { label: 'EU Central', description: 'Frankfurt', disabled: true },
  { label: 'EU North', description: 'Stockholm', tags: ['Low carbon', 'GPU'] },
  { label: 'AP South', description: 'Mumbai' },
  { label: 'AP East', description: 'Hong Kong' },
];

const labels: TokenGroupProps.Item[] = [
  { label: 'team: storage' },
  { label: 'env: production' },
  { label: 'cost-center: 4021' },
  { label: 'owner: c.johnson' },
];

function Dismissible(props: Omit<TokenGroupProps, 'items' | 'onDismiss'> & { initial: TokenGroupProps.Item[] }) {
  const { initial, ...rest } = props;
  const [items, setItems] = useState(initial);
  return (
    <TokenGroup
      {...rest}
      items={items}
      onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.itemIndex))}
    />
  );
}

export default function TokenGroupPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">Token group</Box>

      <section className={styles.section}>
        <Box variant="h2">Horizontal, dismissible</Box>
        <Dismissible initial={regions} ariaLabel="Regions" />
      </section>

      <section className={styles.section}>
        <Box variant="h2">Limit of three</Box>
        <Dismissible initial={regions} limit={3} ariaLabel="Regions" />
      </section>

      <section className={styles.section}>
        <Box variant="h2">Vertical, with a limit</Box>
        <Dismissible initial={regions} alignment="vertical" limit={4} ariaLabel="Regions" />
      </section>

      <section className={styles.section}>
        <Box variant="h2">Read-only</Box>
        <TokenGroup items={labels} readOnly={true} onDismiss={() => {}} ariaLabel="Labels" />
      </section>

      <section className={styles.section}>
        <Box variant="h2">Not dismissible</Box>
        <TokenGroup items={labels} ariaLabel="Labels" />
      </section>
    </div>
  );
}
