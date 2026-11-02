// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import SpaceBetween from '~components/space-between';

import styles from './styles.module.scss';

const footer = (
  <>
    <span>Restarts drain one zone at a time.</span>
    <a href="#services">Show all 7 services</a>
  </>
);

function Lines({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <Box key={index} variant="p">
          Node {index + 1} ran for 720 hours.
        </Box>
      ))}
    </>
  );
}

export default function ContainerPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">Container</Box>

      <Container>Content only.</Container>

      <Container heading="Environment">
        <Lines count={2} />
      </Container>

      <Container
        kind="resource"
        reference="R1"
        heading="Services"
        description="Showing 4 of 7, newest image first."
        measure="7 services"
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none">Restart</Button>
            <Button formAction="none" variant="primary">
              Deploy
            </Button>
          </SpaceBetween>
        }
        footer={footer}
      >
        <Lines count={4} />
      </Container>

      <Box variant="h2">Kinds</Box>
      <Container kind="configuration" reference="C1" heading="Environment" measure="4 settings">
        <Lines count={2} />
      </Container>
      <Container kind="resource" reference="R2" heading="Volumes" measure="4 volumes">
        <Lines count={2} />
      </Container>
      <Container kind="policy" reference="P1" heading="Rollout policy" measure="3 rules">
        <Lines count={2} />
      </Container>
      <Container kind="neutral" reference="N1" heading="Notes" measure="2 notes">
        <Lines count={2} />
      </Container>

      <Box variant="h2">Without a margin</Box>
      <Container kind="resource" measure="12 nodes" actions={<Button formAction="none">Export</Button>}>
        <Lines count={2} />
      </Container>

      <Box variant="h2">Fit height</Box>
      <div className={styles.row}>
        <Container fitHeight={true} heading="Short" footer={footer}>
          <Lines count={1} />
        </Container>
        <Container fitHeight={true} heading="Long, scrolls inside" footer={footer}>
          <Lines count={12} />
        </Container>
      </div>
    </div>
  );
}
