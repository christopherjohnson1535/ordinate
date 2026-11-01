// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import HelpPanel from '~components/help-panel';
import Link from '~components/link';

import { Breadcrumbs, DemoFrame, DemoPage, Help, Navigation, ProjectContent } from './common';

export default function AppLayoutTools() {
  const layoutRef = useRef<AppLayoutProps.Ref>(null);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [topic, setTopic] = useState<'projects' | 'loading'>('projects');

  const showLoadingHelp = () => {
    setTopic('loading');
    layoutRef.current?.openTools();
  };

  return (
    <DemoPage
      title="App layout: help panel"
      description="The help panel opens at the end of the line and collapses to a rail toggle. The Info link opens it with the layout's openTools() method, which also moves focus to its close button."
    >
      <DemoFrame>
        <AppLayout
          ref={layoutRef}
          disableBodyScroll={true}
          navigation={<Navigation />}
          breadcrumbs={<Breadcrumbs />}
          tools={
            topic === 'loading' ? <HelpPanel header="Status" loading={true} loadingText="Loading help" /> : <Help />
          }
          toolsOpen={toolsOpen}
          onToolsChange={event => {
            setToolsOpen(event.detail.open);
            if (!event.detail.open) {
              setTopic('projects');
            }
          }}
          content={
            <ProjectContent
              info={
                <Link
                  variant="info"
                  href="#app-layout/tools"
                  onFollow={event => {
                    event.preventDefault();
                    showLoadingHelp();
                  }}
                >
                  Info
                </Link>
              }
            />
          }
        />
      </DemoFrame>
    </DemoPage>
  );
}
