// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import SpaceBetween, { SpaceBetweenProps } from '~components/space-between';

import styles from './styles.module.scss';

const sizes: SpaceBetweenProps.Size[] = ['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];
const alignments: SpaceBetweenProps.AlignItems[] = ['start', 'center', 'end'];

function Swatch({ tall = false }: { tall?: boolean }) {
  return <div className={tall ? styles['swatch-tall'] : styles.swatch} />;
}

export default function SpaceBetweenPermutations() {
  return (
    <SpaceBetween size="xl">
      <Box variant="h1">Space between</Box>

      <section>
        <Box variant="h2">Horizontal</Box>
        <SpaceBetween size="s">
          {sizes.map(size => (
            <div key={size} className={styles.row}>
              <Box variant="code">{size}</Box>
              <SpaceBetween size={size} direction="horizontal">
                <Swatch />
                <Swatch />
                <Swatch />
              </SpaceBetween>
            </div>
          ))}
        </SpaceBetween>
      </section>

      <section>
        <Box variant="h2">Vertical</Box>
        <SpaceBetween size="l" direction="horizontal">
          {sizes.map(size => (
            <div key={size}>
              <Box variant="code">{size}</Box>
              <SpaceBetween size={size}>
                <Swatch />
                <Swatch />
                <Swatch />
              </SpaceBetween>
            </div>
          ))}
        </SpaceBetween>
      </section>

      <section>
        <Box variant="h2">Align items</Box>
        <SpaceBetween size="l" direction="horizontal">
          {alignments.map(alignItems => (
            <div key={alignItems}>
              <Box variant="code">{alignItems}</Box>
              <SpaceBetween size="xs" direction="horizontal" alignItems={alignItems}>
                <Swatch tall={true} />
                <Swatch />
                <Swatch tall={true} />
              </SpaceBetween>
            </div>
          ))}
        </SpaceBetween>
      </section>

      <section>
        <Box variant="h2">Actions</Box>
        <SpaceBetween size="xs" direction="horizontal">
          <Button formAction="none" variant="link">
            Cancel
          </Button>
          <Button formAction="none">Save draft</Button>
          <Button formAction="none" variant="primary">
            Create project
          </Button>
        </SpaceBetween>
      </section>
    </SpaceBetween>
  );
}
