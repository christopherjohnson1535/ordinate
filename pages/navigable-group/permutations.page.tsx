// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Link from '~components/link';
import NavigableGroup, { NavigableGroupProps } from '~components/navigable-group';
import SpaceBetween from '~components/space-between';

import styles from './styles.module.scss';

const byText = (element: HTMLElement) => element.dataset.key ?? element.textContent ?? '';

export default function NavigableGroupPermutations() {
  const [items, setItems] = useState(['Copy', 'Cut', 'Paste']);
  const [archiveDisabled, setArchiveDisabled] = useState(false);
  const groupRef = useRef<NavigableGroupProps.Ref>(null);

  return (
    <article className={styles.page}>
      <h1>Navigable group</h1>
      <Box color="text-body-secondary">
        The group adds keyboard behavior only. Tab reaches one item; the arrow keys move between items; Home and End
        jump to the ends. Everything you see is drawn by the children.
      </Box>

      <section className={styles.section}>
        <h2>Horizontal toolbar, looping</h2>
        <NavigableGroup
          ref={groupRef}
          navigationDirection="horizontal"
          role="toolbar"
          ariaLabel="Edit"
          loopFocus={true}
          getItemKey={byText}
        >
          <SpaceBetween direction="horizontal" size="xs">
            {items.map(item => (
              <Button key={item} data-key={item}>
                {item}
              </Button>
            ))}
            <Button data-key="archive" disabled={archiveDisabled}>
              Archive
            </Button>
          </SpaceBetween>
        </NavigableGroup>
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="link" onClick={() => setItems(current => [...current, `Action ${current.length + 1}`])}>
            Add an item
          </Button>
          <Button variant="link" onClick={() => setArchiveDisabled(current => !current)}>
            {archiveDisabled ? 'Enable' : 'Disable'} Archive
          </Button>
          <Button variant="link" onClick={() => groupRef.current?.focus()}>
            Focus the group
          </Button>
        </SpaceBetween>
      </section>

      <section className={styles.section}>
        <h2>Vertical list of links, stopping at the ends</h2>
        <NavigableGroup navigationDirection="vertical" ariaLabel="Plates" getItemKey={byText}>
          <ul className={styles.list}>
            {['Plate I: Elevation', 'Plate II: Section', 'Plate III: Details', 'Plate IV: Site plan'].map(plate => (
              <li key={plate}>
                <Link variant="primary" href="#navigable-group/permutations" onFollow={event => event.preventDefault()}>
                  {plate}
                </Link>
              </li>
            ))}
          </ul>
        </NavigableGroup>
      </section>

      <section className={styles.section}>
        <h2>Both directions, with a nested group</h2>
        <NavigableGroup navigationDirection="both" ariaLabel="Sheets" getItemKey={byText}>
          <div className={styles.grid}>
            {['A1', 'A2', 'A3', 'B1', 'B2', 'B3'].map(sheet => (
              <button key={sheet} type="button" className={styles.tile}>
                Sheet {sheet}
              </button>
            ))}
          </div>
          <NavigableGroup navigationDirection="horizontal" ariaLabel="Sheet actions" role="toolbar" getItemKey={byText}>
            <div className={styles.nested}>
              <Button>Print</Button>
              <Button>Export</Button>
            </div>
          </NavigableGroup>
        </NavigableGroup>
      </section>
    </article>
  );
}
