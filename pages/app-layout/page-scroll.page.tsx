// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import SplitPanel from '~components/split-panel';
import TextContent from '~components/text-content';
import TopNavigation from '~components/top-navigation';

import { Breadcrumbs, DemoPage, Help, Navigation, ProjectContent } from './common';

import styles from './styles.module.scss';

export default function AppLayoutPageScroll() {
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);
  return (
    <DemoPage
      title="App layout: page scroll"
      description="Without disableBodyScroll the page itself scrolls, as in an application. A sticky top navigation stands in for a fixed header; headerSelector points the layout at it, so the side columns and the split panel stay in view below it."
    >
      <div id="page-scroll-header" className={styles['header-bar']}>
        <TopNavigation identity={{ href: '#app-layout/page-scroll', title: 'Annex Console' }} />
      </div>
      <AppLayout
        headerSelector="#page-scroll-header"
        navigation={<Navigation />}
        breadcrumbs={<Breadcrumbs />}
        tools={<Help />}
        toolsOpen={true}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={event => setSplitPanelOpen(event.detail.open)}
        splitPanel={
          <SplitPanel header="na-01">
            <TextContent>
              <p>Healthy, in us-mountain-1a.</p>
            </TextContent>
          </SplitPanel>
        }
        content={<ProjectContent sections={6} />}
      />
    </DemoPage>
  );
}
