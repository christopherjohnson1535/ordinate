// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';

import styles from './styles.module.scss';

const header = (
  <Header description="Last 30 days." actions={<Button formAction="none">Export</Button>}>
    Usage
  </Header>
);

const footer = <a href="#usage">View all usage</a>;

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

      <Container header={header}>
        <Lines count={2} />
      </Container>

      <Container header="Environment">
        <Lines count={2} />
      </Container>

      <Container
        header={
          <Header code="Sheet A-03" counter="(4)">
            Volumes
          </Header>
        }
        footer={footer}
      >
        <Lines count={2} />
      </Container>

      <Container header={header} footer={footer}>
        <Lines count={2} />
      </Container>

      <Container header={header} footer={footer} disableHeaderPaddings={true}>
        Header paddings disabled.
      </Container>

      <Container header={header} footer={footer} disableContentPaddings={true}>
        <div className={styles.bleed}>Content paddings disabled.</div>
      </Container>

      <Container header={header} footer={footer} disableFooterPaddings={true}>
        Footer paddings disabled.
      </Container>

      <Box variant="h2">Stacked</Box>
      <div>
        <Container variant="stacked" header={<Header>Compute</Header>}>
          12 nodes.
        </Container>
        <Container variant="stacked" header={<Header>Storage</Header>}>
          4 volumes.
        </Container>
        <Container variant="stacked" header="Network">
          2 gateways.
        </Container>
      </div>

      <Box variant="h2">Fit height</Box>
      <div className={styles.row}>
        <Container fitHeight={true} header={<Header>Short</Header>} footer={footer}>
          <Lines count={1} />
        </Container>
        <Container fitHeight={true} header={<Header>Long, scrolls inside</Header>} footer={footer}>
          <Lines count={12} />
        </Container>
      </div>
    </div>
  );
}
