// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import AppLayout, { AppLayoutProps } from '@ordinate/components/app-layout';
import BreadcrumbGroup from '@ordinate/components/breadcrumb-group';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import ContentLayout from '@ordinate/components/content-layout';
import Header from '@ordinate/components/header';
import HelpPanel from '@ordinate/components/help-panel';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import Link from '@ordinate/components/link';
import SideNavigation from '@ordinate/components/side-navigation';
import StatusIndicator from '@ordinate/components/status-indicator';
import TitleBlock from '@ordinate/components/title-block';

const base = 'https://example.com/north-annex';

export default function Console() {
  const layout = useRef<AppLayoutProps.Ref>(null);
  const [activeHref, setActiveHref] = useState(`${base}/services`);

  return (
    <AppLayout
      ref={layout}
      disableBodyScroll={true}
      navigationWidth={220}
      navigation={
        <SideNavigation
          header={{ text: 'North Annex', href: base }}
          activeHref={activeHref}
          onFollow={event => {
            event.preventDefault();
            setActiveHref(event.detail.href);
          }}
          items={[
            { type: 'link', text: 'Overview', href: `${base}/overview` },
            { type: 'link', text: 'Services', href: `${base}/services` },
            { type: 'link', text: 'Deployments', href: `${base}/deployments` },
            { type: 'link', text: 'Logs', href: `${base}/logs` },
          ]}
        />
      }
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'North Annex', href: base },
            { text: 'Services', href: `${base}/services` },
          ]}
          onFollow={event => event.preventDefault()}
        />
      }
      tools={
        <HelpPanel header="Services">
          <p>Each service runs one image on a set of nodes. Restart a service to roll its nodes one at a time.</p>
        </HelpPanel>
      }
      titleBlock={
        <TitleBlock
          ariaLabel="Sheet"
          items={[
            { label: 'Project', value: 'North Annex' },
            { label: 'Sheet', value: 'A-02 Services' },
            { label: 'Revision', value: '△2, 31 Oct 2026' },
            { label: 'Checked', value: 'D. Ruiz' },
          ]}
        />
      }
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              code="Sheet A-02"
              description="North Annex, production, us-mountain-1"
              info={
                <Link variant="info" onFollow={() => layout.current?.openTools()}>
                  Info
                </Link>
              }
              actions={<Button variant="primary">Deploy</Button>}
            >
              Services
            </Header>
          }
        >
          <Container kind="configuration" reference="C1" heading="Environment" measure="3 settings">
            <KeyValuePairs
              columns={3}
              items={[
                { label: 'Region', value: 'us-mountain-1' },
                { label: 'Nodes', value: '20 of 32' },
                { label: 'Status', value: <StatusIndicator state="complete">Running</StatusIndicator> },
              ]}
            />
          </Container>
        </ContentLayout>
      }
    />
  );
}
