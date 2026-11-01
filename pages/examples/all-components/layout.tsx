// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import AppLayoutToolbar, { AppLayoutToolbarProps } from '~components/app-layout-toolbar';
import Box from '~components/box';
import Button from '~components/button';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import ContentLayout from '~components/content-layout';
import Drawer from '~components/drawer';
import Grid from '~components/grid';
import Header from '~components/header';
import HelpPanel from '~components/help-panel';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import PanelLayout from '~components/panel-layout';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';
import StatusIndicator from '~components/status-indicator';
import StyleScope, { StyleScopeProps } from '~components/style-scope';
import TextContent from '~components/text-content';
import TitleBlock, { TitleBlockProps } from '~components/title-block';

import { AnnexBreadcrumbs, SheetIndex, stayOnPage } from './samples';
import { Cell, Frame, Group, Row, Swatch } from './specimen';

import styles from './specimen.module.scss';

const annexSheet: TitleBlockProps.Item[] = [
  { label: 'Project', value: 'North Annex, production' },
  { label: 'Sheet', value: 'A-02 Services' },
  { label: 'Revision', value: '△2, 31 Oct 2026' },
  { label: 'Checked', value: 'D. Ruiz' },
];

function AppLayoutSpecimen() {
  const [toolsOpen, setToolsOpen] = useState(false);
  return (
    <Frame height="tall">
      <AppLayout
        disableBodyScroll={true}
        navigation={<SheetIndex />}
        breadcrumbs={<AnnexBreadcrumbs />}
        titleBlock={<TitleBlock ariaLabel="Sheet" items={annexSheet} />}
        tools={
          <HelpPanel header="Services">
            <p>Each service runs one image on a set of nodes. Restart a service to roll its nodes one at a time.</p>
          </HelpPanel>
        }
        toolsOpen={toolsOpen}
        onToolsChange={event => setToolsOpen(event.detail.open)}
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
                headingTagOverride="h4"
                code="Sheet A-02"
                description="North Annex, production · us-mountain-1"
                actions={<Button variant="primary">Deploy</Button>}
              >
                Services
              </Header>
            }
          >
            <Container header={<Header headingTagOverride="h5">Environment</Header>}>
              <KeyValuePairs
                columns={3}
                items={[
                  { label: 'Region', value: 'us-mountain-1' },
                  { label: 'Nodes', value: '20 of 32' },
                  { label: 'Status', value: <StatusIndicator type="success">Running</StatusIndicator> },
                ]}
              />
            </Container>
          </ContentLayout>
        }
      />
    </Frame>
  );
}

const toolbarDrawers: AppLayoutToolbarProps.Drawer[] = [
  { id: 'help', ariaLabel: 'Help panel', iconName: 'status-info' },
  { id: 'activity', ariaLabel: 'Activity', iconName: 'history' },
  { id: 'notifications', ariaLabel: 'Notifications', iconName: 'notification', badge: true },
];

function AppLayoutToolbarSpecimen() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  return (
    <div className={styles.site}>
      <AppLayoutToolbar
        breadcrumbs={<AnnexBreadcrumbs />}
        navigationOpen={navigationOpen}
        onNavigationChange={event => setNavigationOpen(event.detail.open)}
        drawers={toolbarDrawers}
        activeDrawerId={activeDrawerId}
        onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
      />
    </div>
  );
}

function DrawerSpecimen() {
  const [open, setOpen] = useState(false);
  return (
    <SpaceBetween size="s">
      <Button onClick={() => setOpen(current => !current)} ariaExpanded={open}>
        {open ? 'Hide activity' : 'Show activity'}
      </Button>
      {open && (
        <Frame height="short">
          <Drawer header="Activity" footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
            <TextContent>
              <ul>
                <li>Node 14 replaced after three failed health checks.</li>
                <li>Certificate renewed until 2 October 2027.</li>
                <li>Firewall rule web-ingress updated.</li>
              </ul>
            </TextContent>
          </Drawer>
        </Frame>
      )}
    </SpaceBetween>
  );
}

function PanelLayoutSpecimen() {
  const [size, setSize] = useState(260);
  return (
    <Frame height="short">
      <PanelLayout
        resizable={true}
        panelSize={size}
        minPanelSize={180}
        maxPanelSize={420}
        onPanelResize={event => setSize(event.detail.panelSize)}
        panelFocusable={{ ariaLabel: 'Repair queue' }}
        panelContent={
          <Box padding="m">
            <Box variant="strong">Repair queue</Box>
            <Box variant="p">7 bikes waiting, 3 promised for today.</Box>
          </Box>
        }
        mainContent={
          <Box padding="m">
            <Box variant="strong">Ticket 2041: town bike, rear brake</Box>
            <Box variant="p">Pads worn to the metal. Quote sent at 9:40; the panel is {size} px wide.</Box>
          </Box>
        }
      />
    </Frame>
  );
}

function SplitPanelSpecimen() {
  const [open, setOpen] = useState(true);
  const [preferences, setPreferences] = useState<AppLayoutProps.SplitPanelPreferences>({ position: 'bottom' });
  return (
    <Frame height="medium">
      <AppLayout
        disableBodyScroll={true}
        navigationHide={true}
        toolsHide={true}
        splitPanelOpen={open}
        onSplitPanelToggle={event => setOpen(event.detail.open)}
        splitPanelPreferences={preferences}
        onSplitPanelPreferencesChange={event => setPreferences(event.detail)}
        splitPanel={
          <SplitPanel header="vault-store" headerTag="S5" headerDescription="store:v12 on 2 nodes">
            <KeyValuePairs
              columns={2}
              items={[
                { label: 'Status', value: <StatusIndicator type="error">Failed</StatusIndicator> },
                { label: 'Last check', value: '14:03, connection refused' },
              ]}
            />
          </SplitPanel>
        }
        content={
          <Box padding="m">
            <Button variant="link" onClick={() => setOpen(true)}>
              Open the details of vault-store
            </Button>
          </Box>
        }
      />
    </Frame>
  );
}

const scopes: StyleScopeProps.StyleName[] = ['editorial', 'shopfront'];

export default function LayoutGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Layout">
      <Cell name="AppLayout" wide={true} note="A whole console frame, held in a box of fixed height.">
        <AppLayoutSpecimen />
      </Cell>
      <Cell name="AppLayoutToolbar" wide={true}>
        <AppLayoutToolbarSpecimen />
      </Cell>
      <Cell name="ColumnLayout">
        <ColumnLayout columns={3} variant="text-grid" borders="vertical">
          <div>
            <Box variant="key-label">Open</Box>
            <Box variant="value-large">14</Box>
          </div>
          <div>
            <Box variant="key-label">Due today</Box>
            <Box variant="value-large">3</Box>
          </div>
          <div>
            <Box variant="key-label">Waiting on parts</Box>
            <Box variant="value-large">2</Box>
          </div>
        </ColumnLayout>
      </Cell>
      <Cell name="Container">
        <Container
          header={
            <Header headingTagOverride="h4" description="Leith, open Tuesday to Sunday">
              Fixit Bikes workshop
            </Header>
          }
          footer={
            <Link href="#hours" onFollow={stayOnPage}>
              Opening hours
            </Link>
          }
        >
          Six mechanics, four stands and a kettle that is always on.
        </Container>
      </Cell>
      <Cell name="ContentLayout">
        <Frame height="short">
          <ContentLayout
            defaultPadding={true}
            headerVariant="divider"
            header={
              <Header variant="h1" headingTagOverride="h4" description="Small homes and huts in the Borders">
                Harbour &amp; Pine
              </Header>
            }
          >
            <Container>Hut No. 3 is out to tender until 14 November.</Container>
          </ContentLayout>
        </Frame>
      </Cell>
      <Cell name="Drawer">
        <DrawerSpecimen />
      </Cell>
      <Cell name="Grid">
        <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }, { colspan: 4 }, { colspan: 8 }]}>
          <Swatch>Plan, 8 of 12</Swatch>
          <Swatch>Key, 4</Swatch>
          <Swatch>Notes, 4</Swatch>
          <Swatch>Section, 8</Swatch>
        </Grid>
      </Cell>
      <Cell name="HelpPanel">
        <div className={styles.column}>
          <HelpPanel
            header="Truing a wheel"
            footer={
              <Link href="#guides" onFollow={stayOnPage}>
                All repair guides
              </Link>
            }
          >
            <p>
              Spin the wheel and watch the gap at the brake pad. Tighten the spokes opposite the wobble a quarter turn
              at a time.
            </p>
          </HelpPanel>
        </div>
      </Cell>
      <Cell name="PanelLayout" wide={true} note="Drag the handle between the panels to resize them.">
        <PanelLayoutSpecimen />
      </Cell>
      <Cell name="SpaceBetween">
        <SpaceBetween size="s">
          <SpaceBetween direction="horizontal" size="xs">
            <Swatch>Drop off</Swatch>
            <Swatch>Quote</Swatch>
            <Swatch>Repair</Swatch>
          </SpaceBetween>
          <Swatch>Collect, the same day</Swatch>
        </SpaceBetween>
      </Cell>
      <Cell name="SplitPanel" wide={true}>
        <SplitPanelSpecimen />
      </Cell>
      <Cell name="StyleScope" note="The same parts in two other styles, whatever the top bar says.">
        <Row>
          {scopes.map(styleName => (
            <StyleScope key={styleName} styleName={styleName}>
              <SpaceBetween size="xs">
                <Box variant="small">{styleName}</Box>
                <Button variant="primary">Book a visit</Button>
              </SpaceBetween>
            </StyleScope>
          ))}
        </Row>
      </Cell>
      <Cell name="TitleBlock">
        <TitleBlock ariaLabel="Drawing" columns={2} items={annexSheet} />
      </Cell>
    </Group>
  );
}
