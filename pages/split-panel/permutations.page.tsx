// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Button from '~components/button';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import SplitPanel, { SplitPanelProps } from '~components/split-panel';
import TextContent from '~components/text-content';

import styles from './styles.module.scss';

interface ExampleProps {
  title: string;
  position: AppLayoutProps.SplitPanelPosition;
  initiallyOpen?: boolean;
  closeBehavior?: SplitPanelProps.CloseBehavior;
  hidePreferencesButton?: boolean;
  rich?: boolean;
  headerTag?: string;
}

function Example({
  title,
  position: initialPosition,
  initiallyOpen = true,
  closeBehavior,
  hidePreferencesButton,
  rich = false,
  headerTag,
}: ExampleProps) {
  const [open, setOpen] = useState(initiallyOpen);
  const [position, setPosition] = useState(initialPosition);
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <div className={styles.frame}>
        <AppLayout
          disableBodyScroll={true}
          navigationHide={true}
          toolsHide={true}
          contentType="table"
          splitPanelOpen={open}
          onSplitPanelToggle={event => setOpen(event.detail.open)}
          splitPanelPreferences={{ position }}
          onSplitPanelPreferencesChange={event => setPosition(event.detail.position)}
          splitPanel={
            <SplitPanel
              header="na-01"
              headerTag={headerTag}
              closeBehavior={closeBehavior}
              hidePreferencesButton={hidePreferencesButton}
              headerDescription={rich ? 'Node in us-mountain-1a' : undefined}
              headerInfo={rich ? <Link variant="info">Info</Link> : undefined}
              headerActions={
                rich ? (
                  <Button formAction="none" iconName="refresh">
                    Restart
                  </Button>
                ) : undefined
              }
            >
              <KeyValuePairs
                columns={2}
                items={[
                  { label: 'Zone', value: 'us-mountain-1a' },
                  { label: 'Instance type', value: 'c7.large' },
                  { label: 'Uptime', value: '12 days' },
                  { label: 'Address', value: '10.0.4.12' },
                ]}
              />
            </SplitPanel>
          }
          content={
            <TextContent>
              <p>Content of the page. The split panel is {open ? 'open' : 'closed'}.</p>
              {closeBehavior === 'hide' && !open && (
                <Button formAction="none" onClick={() => setOpen(true)}>
                  Show details
                </Button>
              )}
            </TextContent>
          }
        />
      </div>
    </section>
  );
}

export default function SplitPanelPermutations() {
  return (
    <article className={styles.page}>
      <h1>Split panel</h1>
      <p className={styles.note}>
        Split panels live in an app layout, which tells them their position, size and open state. Each example below is
        a small app layout.
      </p>
      <Example title="Side, with a tag" position="side" rich={true} headerTag="S3" />
      <Example title="Bottom, with a tag, description, info and actions" position="bottom" rich={true} headerTag="S3" />
      <Example title="Side, without a tag" position="side" rich={true} />
      <Example title="Bottom, without a tag" position="bottom" />
      <Example title="Collapsed at the bottom" position="bottom" initiallyOpen={false} headerTag="S3" />
      <Example title="Collapsed at the side" position="side" initiallyOpen={false} />
      <Example
        title="Hidden when closed, without preferences"
        position="bottom"
        closeBehavior="hide"
        hidePreferencesButton={true}
      />
    </article>
  );
}
