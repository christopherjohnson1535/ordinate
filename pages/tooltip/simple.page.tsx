// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Tooltip, { TooltipProps } from '~components/tooltip';

import styles from './styles.module.scss';

const positions: TooltipProps.Position[] = ['top', 'right', 'bottom', 'left'];

export default function TooltipSimple() {
  return (
    <article className={styles.page}>
      <h1>Tooltip</h1>

      <section className={styles.section}>
        <h2>Icon buttons</h2>
        <div className={styles.row}>
          <Tooltip content="Copy node ID">
            <Button variant="icon" iconName="copy" ariaLabel="Copy" />
          </Tooltip>
          <Tooltip content="Open in a new tab">
            <Button variant="icon" iconName="open-outside" ariaLabel="Open" />
          </Tooltip>
          <Tooltip content="Remove this node from the project. Running jobs move to other nodes first.">
            <Button variant="icon" iconName="close" ariaLabel="Remove" />
          </Tooltip>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Positions</h2>
        <div className={styles.compass}>
          {positions.map(position => (
            <Tooltip key={position} position={position} content={`Shown ${position}`}>
              <Button formAction="none">{position}</Button>
            </Tooltip>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Plain text trigger</h2>
        <p>
          Availability:{' '}
          <Tooltip content="Three of four zones">
            <span className={styles.value}>75%</span>
          </Tooltip>
        </p>
      </section>

      <section className={styles.edges}>
        <Tooltip position="left" content="Flipped to the end">
          <Button formAction="none">Start edge</Button>
        </Tooltip>
        <Tooltip position="right" content="Flipped to the start">
          <Button formAction="none">End edge</Button>
        </Tooltip>
      </section>
    </article>
  );
}
