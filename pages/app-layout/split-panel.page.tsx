// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Button from '~components/button';
import Header from '~components/header';
import KeyValuePairs from '~components/key-value-pairs';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';
import StatusIndicator from '~components/status-indicator';

import { Breadcrumbs, DemoFrame, DemoPage, Help, Navigation } from './common';

import styles from './styles.module.scss';

const nodes = Array.from({ length: 14 }, (_, index) => ({
  id: `na-${String(index + 1).padStart(2, '0')}`,
  zone: `us-mountain-1${'abc'[index % 3]}`,
  healthy: index % 5 !== 3,
}));

export default function AppLayoutSplitPanel() {
  const [selectedId, setSelectedId] = useState('na-01');
  const [open, setOpen] = useState(true);
  const [preferences, setPreferences] = useState<AppLayoutProps.SplitPanelPreferences>({ position: 'side' });
  const [size, setSize] = useState<number>();
  const selected = nodes.find(node => node.id === selectedId) ?? nodes[0];

  return (
    <DemoPage
      title="App layout: split panel"
      description="Select a node to see it in the split panel. Drag the panel's edge or focus it and use the arrow keys to resize; the gear button switches between the bottom and side positions. The side position falls back to the bottom when the layout is too narrow."
      controls={
        <SegmentedControl
          label="Position"
          selectedId={preferences.position}
          onChange={event => setPreferences({ position: event.detail.selectedId as AppLayoutProps.SplitPanelPosition })}
          options={[
            { id: 'bottom', text: 'Bottom' },
            { id: 'side', text: 'Side' },
          ]}
        />
      }
    >
      <DemoFrame>
        <AppLayout
          disableBodyScroll={true}
          contentType="table"
          navigation={<Navigation />}
          navigationOpen={false}
          breadcrumbs={<Breadcrumbs current="Nodes" />}
          tools={<Help />}
          splitPanelOpen={open}
          onSplitPanelToggle={event => setOpen(event.detail.open)}
          splitPanelPreferences={preferences}
          onSplitPanelPreferencesChange={event => setPreferences(event.detail)}
          splitPanelSize={size}
          onSplitPanelResize={event => setSize(event.detail.size)}
          splitPanel={
            <SplitPanel
              header={selected.id}
              headerDescription={`Node in ${selected.zone}`}
              headerActions={
                <Button formAction="none" iconName="refresh">
                  Restart
                </Button>
              }
            >
              <KeyValuePairs
                columns={2}
                items={[
                  {
                    label: 'Status',
                    value: selected.healthy ? (
                      <StatusIndicator state="complete">Healthy</StatusIndicator>
                    ) : (
                      <StatusIndicator state="caution">Failing health checks</StatusIndicator>
                    ),
                  },
                  { label: 'Zone', value: selected.zone },
                  { label: 'Instance type', value: 'c7.large' },
                  { label: 'Uptime', value: '12 days' },
                ]}
              />
            </SplitPanel>
          }
          content={
            <SpaceBetween size="m">
              <Header variant="h1" counter={`(${nodes.length})`}>
                Nodes
              </Header>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Node</th>
                    <th scope="col">Zone</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map(node => (
                    <tr key={node.id} aria-selected={node.id === selectedId}>
                      <td>
                        <Button
                          variant="link"
                          formAction="none"
                          onClick={() => {
                            setSelectedId(node.id);
                            setOpen(true);
                          }}
                        >
                          {node.id}
                        </Button>
                      </td>
                      <td>{node.zone}</td>
                      <td>{node.healthy ? 'Healthy' : 'Failing'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SpaceBetween>
          }
        />
      </DemoFrame>
    </DemoPage>
  );
}
