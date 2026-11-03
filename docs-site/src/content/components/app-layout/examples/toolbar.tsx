// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '@ordinate/components/app-layout';
import BreadcrumbGroup from '@ordinate/components/breadcrumb-group';
import Container from '@ordinate/components/container';
import Drawer from '@ordinate/components/drawer';
import Header from '@ordinate/components/header';
import HelpPanel from '@ordinate/components/help-panel';
import SideNavigation from '@ordinate/components/side-navigation';
import SpaceBetween from '@ordinate/components/space-between';
import TextContent from '@ordinate/components/text-content';

const base = 'https://example.com/fixit-bikes';

export default function Toolbar() {
  return (
    <AppLayout
      disableBodyScroll={true}
      variant="toolbar"
      navigation={
        <SideNavigation
          header={{ text: 'Fixit Bikes', href: base }}
          activeHref={`${base}/repairs`}
          onFollow={event => event.preventDefault()}
          items={[
            { type: 'link', text: 'Repairs', href: `${base}/repairs` },
            { type: 'link', text: 'Parts', href: `${base}/parts` },
            { type: 'link', text: 'Customers', href: `${base}/customers` },
          ]}
        />
      }
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Repairs', href: `${base}/repairs` },
            { text: 'Ticket 2041', href: `${base}/repairs/2041` },
          ]}
          onFollow={event => event.preventDefault()}
        />
      }
      tools={
        <HelpPanel header="Tickets">
          <p>A ticket follows one bike from drop-off to collection.</p>
        </HelpPanel>
      }
      drawers={[
        {
          id: 'parts',
          trigger: { iconName: 'list-view' },
          ariaLabels: { drawerName: 'Parts on order' },
          content: (
            <Drawer header="Parts on order">
              <TextContent>
                <p>Rear brake pads, arriving Tuesday.</p>
              </TextContent>
            </Drawer>
          ),
        },
      ]}
      content={
        <SpaceBetween size="l">
          <Header variant="h1" description="Town bike, rear brake">
            Ticket 2041
          </Header>
          <Container heading="Diagnosis">Pads worn to the metal. Quote sent at 9:40.</Container>
        </SpaceBetween>
      }
    />
  );
}
