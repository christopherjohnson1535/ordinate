// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Container from '~components/container';
import ExpandableSection from '~components/expandable-section';
import Header from '~components/header';
import Link from '~components/link';

import styles from './styles.module.scss';

const body = 'Retries back off exponentially, starting at 2 seconds and stopping after 5 attempts.';

export default function ExpandableSectionSimple() {
  const [expanded, setExpanded] = useState(true);

  return (
    <article className={styles.page}>
      <h1>Expandable section</h1>

      <section className={styles.section}>
        <h2>Default</h2>
        <ExpandableSection headerText="Retry policy" defaultExpanded={true}>
          {body}
        </ExpandableSection>
        <ExpandableSection headerText="Advanced settings" headerDescription="Timeouts, retries and logging">
          {body}
        </ExpandableSection>
        <div className={styles.narrow}>
          <ExpandableSection headerText="A long header that wraps onto a second line in a narrow column">
            {body}
          </ExpandableSection>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Footer</h2>
        <Container
          header={<Header>Instance</Header>}
          footer={
            <ExpandableSection variant="footer" headerText="Additional details" defaultExpanded={true}>
              {body}
            </ExpandableSection>
          }
        >
          north-annex-04 is running.
        </Container>
      </section>

      <section className={styles.section}>
        <h2>Container, controlled</h2>
        <div className={styles.row}>
          <Button formAction="none" onClick={() => setExpanded(current => !current)}>
            Toggle from outside
          </Button>
        </div>
        <ExpandableSection
          variant="container"
          headerText="Instances"
          headerCounter="(12)"
          headerDescription="Running in north-annex"
          headerInfo={
            <Link variant="info" href="#">
              Info
            </Link>
          }
          headerActions={<Button formAction="none">Add instance</Button>}
          expanded={expanded}
          onChange={event => setExpanded(event.detail.expanded)}
        >
          {body}
        </ExpandableSection>
        <ExpandableSection variant="container" headerText="No content paddings" disableContentPaddings={true}>
          <div className={styles.flush}>Content that draws its own edges</div>
        </ExpandableSection>
      </section>

      <section className={styles.section}>
        <h2>Stacked</h2>
        <div>
          <ExpandableSection variant="stacked" headerText="Networking" defaultExpanded={true}>
            {body}
          </ExpandableSection>
          <ExpandableSection variant="stacked" headerText="Storage" headerDescription="Volumes and snapshots">
            {body}
          </ExpandableSection>
          <ExpandableSection variant="stacked" headerText="Security">
            {body}
          </ExpandableSection>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Navigation</h2>
        <div className={styles.nav}>
          <ExpandableSection variant="navigation" headerText="Compute" defaultExpanded={true}>
            <div className={styles.links}>
              <Link href="#">Instances</Link>
              <Link href="#">Images</Link>
            </div>
          </ExpandableSection>
          <ExpandableSection variant="navigation" headerText="Storage">
            <div className={styles.links}>
              <Link href="#">Volumes</Link>
            </div>
          </ExpandableSection>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Inline</h2>
        <ExpandableSection variant="inline" headerText="Show the full error">
          <code>ECONNRESET: socket hang up at north-annex-04:443</code>
        </ExpandableSection>
      </section>
    </article>
  );
}
