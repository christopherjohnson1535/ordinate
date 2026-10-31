// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Divider from '~components/divider';
import SpaceBetween from '~components/space-between';

import styles from './styles.module.scss';

export default function DividerPermutations() {
  return (
    <SpaceBetween size="xl">
      <Box variant="h1">Divider</Box>

      <section>
        <Box variant="h2">Horizontal</Box>
        <SpaceBetween size="m">
          <Box>Compute</Box>
          <Divider />
          <Box>Storage</Box>
        </SpaceBetween>
      </section>

      <section>
        <Box variant="h2">With a label</Box>
        <SpaceBetween size="m">
          <Button formAction="none" fullWidth={true}>
            Sign in with a passkey
          </Button>
          <Divider>Or</Divider>
          <Button formAction="none" fullWidth={true}>
            Sign in with a password
          </Button>
          <Divider>
            A longer label that wraps when the column is narrow, with the lines keeping their minimum length
          </Divider>
        </SpaceBetween>
      </section>

      <section>
        <Box variant="h2">Vertical</Box>
        <div className={styles.row}>
          <Box>12 nodes</Box>
          <Divider orientation="vertical" />
          <Box>4 volumes</Box>
          <Divider orientation="vertical" />
          <Box>2 gateways</Box>
        </div>
      </section>
    </SpaceBetween>
  );
}
