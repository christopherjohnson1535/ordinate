// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import PanelLayout, { PanelLayoutProps } from '~components/panel-layout';
import SegmentedControl from '~components/segmented-control';
import SideNavigation from '~components/side-navigation';

import styles from './styles.module.scss';

const panel = (
  <SideNavigation
    header={{ text: 'Instances', href: '#' }}
    activeHref="#running"
    items={[
      { type: 'link', text: 'Running', href: '#running' },
      { type: 'link', text: 'Stopped', href: '#stopped' },
      { type: 'link', text: 'Terminated', href: '#terminated' },
    ]}
  />
);

function Main({ size }: { size?: number }) {
  return (
    <div className={styles.pane}>
      <Box variant="h3">Running instances</Box>
      <Box variant="p">12 instances are running in the north annex.</Box>
      {size !== undefined && <Box variant="small">Panel width: {size} px</Box>}
    </div>
  );
}

function Controlled() {
  const [size, setSize] = useState(260);
  return (
    <div className={styles.frame}>
      <PanelLayout
        resizable={true}
        panelSize={size}
        minPanelSize={160}
        maxPanelSize={480}
        onPanelResize={event => setSize(event.detail.panelSize)}
        panelFocusable={{ ariaLabel: 'Instance filters' }}
        panelContent={panel}
        mainContent={<Main size={size} />}
      />
    </div>
  );
}

function Displays() {
  const [display, setDisplay] = useState<PanelLayoutProps.Display>('all');
  return (
    <>
      <div className={styles.row}>
        <SegmentedControl
          label="Display"
          selectedId={display}
          onChange={event => setDisplay(event.detail.selectedId as PanelLayoutProps.Display)}
          options={[
            { id: 'all', text: 'All' },
            { id: 'panel-only', text: 'Panel only' },
            { id: 'main-only', text: 'Main only' },
          ]}
        />
      </div>
      <div className={styles.frame}>
        <PanelLayout resizable={true} display={display} panelContent={panel} mainContent={<Main />} />
      </div>
    </>
  );
}

export default function PanelLayoutPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">Panel layout</Box>

      <section className={styles.section}>
        <Box variant="h2">Resizable, controlled, panel at the start</Box>
        <Controlled />
      </section>

      <section className={styles.section}>
        <Box variant="h2">Resizable, panel at the end</Box>
        <div className={styles.frame}>
          <PanelLayout
            resizable={true}
            panelPosition="side-end"
            defaultPanelSize={300}
            minPanelSize={200}
            panelContent={<div className={styles.pane}>Details of the selected instance.</div>}
            mainContent={<Main />}
          />
        </div>
      </section>

      <section className={styles.section}>
        <Box variant="h2">Fixed size</Box>
        <div className={styles.frame}>
          <PanelLayout panelSize={220} panelContent={panel} mainContent={<Main />} />
        </div>
      </section>

      <section className={styles.section}>
        <Box variant="h2">Display</Box>
        <Displays />
      </section>
    </div>
  );
}
