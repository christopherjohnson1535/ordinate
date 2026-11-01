// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BreadcrumbGroup from '~components/breadcrumb-group';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import { StatusIndicatorProps } from '~components/status-indicator';

// Sample content for the specimen sheet: the North Annex services console, the Fixit Bikes workshop
// and the Harbour & Pine architecture studio.

export type ServiceStatus = 'Running' | 'Starting' | 'Stopped' | 'Failed';

export interface Service {
  name: string;
  status: ServiceStatus;
  image: string;
  nodes: number;
}

export const services: Service[] = [
  { name: 'north-annex-web', status: 'Running', image: 'web:v2', nodes: 8 },
  { name: 'gallery-east', status: 'Starting', image: 'web:v2', nodes: 4 },
  { name: 'atrium-api', status: 'Running', image: 'api:v7', nodes: 6 },
  { name: 'archive-batch', status: 'Stopped', image: 'batch:v3', nodes: 0 },
  { name: 'vault-store', status: 'Failed', image: 'store:v12', nodes: 2 },
  { name: 'lobby-cache', status: 'Running', image: 'cache:v4', nodes: 2 },
  { name: 'reading-room', status: 'Running', image: 'web:v2', nodes: 3 },
];

export const serviceTag = (service: Service) => `S${services.indexOf(service) + 1}`;

export const statusTypes: Record<ServiceStatus, StatusIndicatorProps.Type> = {
  Running: 'success',
  Starting: 'in-progress',
  Stopped: 'stopped',
  Failed: 'error',
};

export const sheets: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Overview', href: '#/overview', code: 'A-01' },
  { type: 'link', text: 'Services', href: '#/services', code: 'A-02' },
  { type: 'link', text: 'Deployments', href: '#/deployments', code: 'A-03' },
  { type: 'link', text: 'Logs', href: '#/logs', code: 'A-04' },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'Account',
    code: 'Set B',
    items: [
      { type: 'link', text: 'People and access', href: '#/people', code: 'B-01' },
      { type: 'link', text: 'Billing', href: '#/billing', code: 'B-02' },
    ],
  },
];

/** The sheet index of the North Annex console, following links in place so the dev shell keeps its page. */
export function SheetIndex() {
  const [activeHref, setActiveHref] = useState('#/services');
  return (
    <SideNavigation
      header={{ text: 'North Annex', href: '#/' }}
      activeHref={activeHref}
      onFollow={event => {
        event.preventDefault();
        if (event.detail.href) {
          setActiveHref(event.detail.href);
        }
      }}
      items={sheets}
    />
  );
}

export function AnnexBreadcrumbs() {
  return (
    <BreadcrumbGroup
      items={[
        { text: 'Projects', href: '#/projects' },
        { text: 'North Annex', href: '#/projects/north-annex' },
        { text: 'Services', href: '#/projects/north-annex/services' },
      ]}
      onFollow={event => event.preventDefault()}
    />
  );
}

/** Stops a sample link from changing the dev shell's page, which lives in the address hash. */
export const stayOnPage = (event: CustomEvent) => event.preventDefault();
