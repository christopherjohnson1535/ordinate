// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import Container from '~components/container';
import ContentLayout, { ContentLayoutProps } from '~components/content-layout';
import Flashbar from '~components/flashbar';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import styles from './styles.module.scss';

const breadcrumbs = (
  <BreadcrumbGroup
    items={[
      { text: 'North annex', href: '#' },
      { text: 'Instances', href: '#instances' },
      { text: 'i-0f3a2c91d4', href: '#instance' },
    ]}
  />
);

const notifications = (
  <Flashbar items={[{ type: 'complete', header: 'Instance started', content: 'i-0f3a2c91d4 is running.' }]} />
);

const header = (
  <Header
    variant="h1"
    description="A general purpose instance in the north annex."
    info={
      <Link variant="info" href="#">
        Info
      </Link>
    }
    actions={
      <SpaceBetween direction="horizontal" size="xs">
        <Button formAction="none">Stop</Button>
        <Button formAction="none" variant="primary">
          Connect
        </Button>
      </SpaceBetween>
    }
  >
    i-0f3a2c91d4
  </Header>
);

function Content() {
  return (
    <SpaceBetween size="l">
      <Container heading="Details">
        Instance type m5.large, 2 cores, 8 GB of memory, launched 31 October 2026.
      </Container>
      <Container heading="Storage">One 50 GB root volume and one 200 GB data volume.</Container>
    </SpaceBetween>
  );
}

function Example({ title, ...props }: ContentLayoutProps & { title: string }) {
  return (
    <section className={styles.section}>
      <Box variant="h2">{title}</Box>
      <div className={styles.frame}>
        <ContentLayout defaultPadding={true} breadcrumbs={breadcrumbs} header={header} {...props}>
          <Content />
        </ContentLayout>
      </div>
    </section>
  );
}

export default function ContentLayoutPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">Content layout</Box>
      <Example title="High contrast" headerVariant="high-contrast" notifications={notifications} />
      <Example title="High contrast without overlap" headerVariant="high-contrast" disableOverlap={true} />
      <Example title="Default" />
      <Example title="Divider" headerVariant="divider" />
      <Example title="Maximum content width of 640 pixels" headerVariant="high-contrast" maxContentWidth={640} />
      <section className={styles.section}>
        <Box variant="h2">Content only</Box>
        <div className={styles.frame}>
          <ContentLayout defaultPadding={true}>
            <Content />
          </ContentLayout>
        </div>
      </section>
    </div>
  );
}
