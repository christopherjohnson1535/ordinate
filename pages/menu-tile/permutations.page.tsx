// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import MenuTile from '~components/menu-tile';

import styles from '../website-content.module.scss';

export default function MenuTilePermutations() {
  return (
    <article className={styles.page}>
      <h1>Menu tile permutations</h1>
      <section className={styles.section}>
        <h2>Repair menu</h2>
        <div className={styles.columns}>
          <MenuTile
            headingLevel={2}
            title="Quick fixes"
            description="While you wait, most days."
            items={[
              { label: 'Flat tire repair', value: '$18' },
              { label: 'Brake adjustment', value: '$25' },
              { label: 'Chain clean and lube', value: '$20' },
            ]}
          />
          <MenuTile
            headingLevel={2}
            tone="emphasis"
            badge="Most booked"
            title="Full service"
            description="Everything checked, trued and tuned."
            items={[
              { label: 'Full service', value: '$85', description: 'Gears, brakes, wheels and bearings.' },
              { label: 'With new cables', value: '$110' },
            ]}
            footer={<Button>Book a service</Button>}
          />
          <MenuTile
            headingLevel={2}
            tone="accent"
            title="Wheels"
            items={[
              { label: 'Wheel truing', value: '$30' },
              { label: 'Spoke replacement, each additional spoke after the first', value: '$6' },
              { label: 'Tubeless setup', value: 'from $40' },
            ]}
            footer="Bring the wheel in on its own if that's easier."
          />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Badge on a default tile, title only</h2>
        <div className={styles.columns}>
          <MenuTile
            headingLevel={2}
            badge="New"
            title="Breakfast"
            items={[
              { label: 'Toast and jam', value: '4.50' },
              { label: 'Porridge with stewed apple', value: '6.00' },
            ]}
          />
          <MenuTile headingLevel={2} title="Ask us about custom builds" description="We quote every build by hand." />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={styles.narrow}>
          <MenuTile
            tone="emphasis"
            badge="Most booked"
            title="Full service with a long title"
            items={[
              { label: 'Full service', value: '$85', description: 'Gears, brakes, wheels and bearings.' },
              { label: 'Full service with new cables and housing', value: '$110' },
            ]}
            footer={<Button>Book</Button>}
          />
        </div>
      </section>
    </article>
  );
}
