// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import AppLayout, { AppLayoutProps } from '@ordinate/components/app-layout';
import Header from '@ordinate/components/header';
import HelpPanel from '@ordinate/components/help-panel';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';

const topics = {
  nodes: {
    header: 'Nodes',
    body: 'A node is one machine in the project. Nodes in the same zone share a network and a power supply.',
  },
  volumes: {
    header: 'Volumes',
    body: 'A volume is a disk you attach to a node. Data volumes keep their data when the node is replaced.',
  },
};

type Topic = keyof typeof topics;

export default function InfoLink() {
  const layout = useRef<AppLayoutProps.Ref>(null);
  const [topic, setTopic] = useState<Topic>('nodes');
  const [toolsOpen, setToolsOpen] = useState(false);

  const info = (next: Topic) => (
    <Link
      variant="info"
      onFollow={() => {
        setTopic(next);
        layout.current?.openTools();
      }}
    >
      Info
    </Link>
  );

  return (
    <AppLayout
      ref={layout}
      disableBodyScroll={true}
      navigationHide={true}
      toolsOpen={toolsOpen}
      onToolsChange={event => setToolsOpen(event.detail.open)}
      tools={
        <HelpPanel header={topics[topic].header}>
          <p>{topics[topic].body}</p>
        </HelpPanel>
      }
      content={
        <SpaceBetween size="l">
          <Header variant="h1">north-annex</Header>
          <Header variant="h2" info={info('nodes')} description="20 nodes in us-mountain-1.">
            Nodes
          </Header>
          <Header variant="h2" info={info('volumes')} description="4 volumes, 500 GB in all.">
            Volumes
          </Header>
        </SpaceBetween>
      }
    />
  );
}
