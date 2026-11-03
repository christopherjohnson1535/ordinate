// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Example } from '../../parts/example';
import { DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';
import { Composition, Part } from './shared/composition';

const page: LoadedExample = {
  meta: {
    id: 'app-shell',
    title: 'north-annex, project detail',
    description: (
      <p>
        The whole page, running. Choose Actions, then Restart, to see a loading note turn into a complete one, or move
        between the tabs. The Logs tab is unavailable, with its reason on hover and focus.
      </p>
    ),
    layout: 'flush',
    height: 'tall',
  },
  load: () => import('../../../../pages/examples/app-shell.page'),
  loadSource: () => import('../../../../pages/examples/app-shell.page.tsx?raw').then(module => module.default),
};

const parts: ReadonlyArray<Part> = [
  {
    name: 'TopNavigation',
    folder: 'top-navigation',
    role: 'The title block: a logo and product name, a project search, Docs, notifications with an unread dot, and the person menu.',
  },
  {
    name: 'SideNavigation',
    folder: 'side-navigation',
    role: 'Dashboard and Projects, a collapsible Networking section, a divider, then Billing and an external link to the docs.',
  },
  {
    name: 'Flashbar',
    folder: 'flashbar',
    role: 'Notes stacked above the page: the scheduled maintenance, and the restart while it runs and after.',
  },
  { name: 'BreadcrumbGroup', folder: 'breadcrumb-group', role: 'Compute, Projects, north-annex, joined by leaders.' },
  {
    name: 'Header',
    folder: 'header',
    role: 'The project name and description, with the page actions at the end of the line.',
  },
  {
    name: 'ButtonDropdown',
    folder: 'button-dropdown',
    role: 'Restart, Take snapshot and Delete project under one Actions button. Restart is disabled while a restart runs.',
  },
  {
    name: 'Button',
    folder: 'button',
    role: (
      <>
        Edit settings, the one primary action. It has an <code>href</code>, because it goes to another page.
      </>
    ),
  },
  {
    name: 'Tabs',
    folder: 'tabs',
    role: 'Details, Activity, Connect and a disabled Logs tab that says why.',
  },
  { name: 'Container', folder: 'container', role: 'One section per subject inside each tab.' },
  {
    name: 'KeyValuePairs',
    folder: 'key-value-pairs',
    role: 'The overview in three columns, with the status and the endpoint as rich values.',
  },
  {
    name: 'StatusIndicator',
    folder: 'status-indicator',
    role: 'Running, or Restarting while the restart runs.',
  },
  { name: 'Link', folder: 'link', role: 'The endpoint address, inside a value.' },
  { name: 'ProgressBar', folder: 'progress-bar', role: "How much of the month's compute and storage is used." },
  {
    name: 'ExpandableSection',
    folder: 'expandable-section',
    role: 'Recent events, the newest open and the rest folded to their titles.',
  },
  { name: 'Badge', folder: 'badge', role: "The number of recent events, as the container's measure." },
  { name: 'TextContent', folder: 'text-content', role: 'Running text with a command and a link on the Connect tab.' },
  { name: 'TitleBlock', folder: 'title-block', role: 'The foot of the sheet: project, sheet, revision and checker.' },
];

function Page() {
  return (
    <>
      <DocSection id="purpose" number={1} title="What the page is for">
        <Prose>
          <p>
            The detail page of one thing a person owns: here a project, with its state, its usage, what happened to it
            and how to connect to it. It is the page a person lands on from a list, and the one they come back to after
            changing a setting.
          </p>
          <p>
            The shell is drawn without <a href="#/components/app-layout">AppLayout</a>, from TopNavigation,
            SideNavigation and a framed sheet laid out by a small grid in the page&apos;s own style sheet. It shows what
            the navigation and content components look like on their own; for a real application, use AppLayout, as{' '}
            <a href="#/patterns/console">Console</a> does.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="parts" number={2} title="Parts" description="In the order they appear, from the top of the page.">
        <Composition parts={parts} />
      </DocSection>

      <DocSection id="decisions" number={3} title="Decisions">
        <Notes
          items={[
            <>
              <strong>A restart is told in one note.</strong> Choosing Restart replaces any earlier restart note with a
              loading one, &quot;Restarting north-annex&quot;; when it finishes, the same note becomes a complete one
              that can be dismissed. The note keeps its <code>id</code>, so the stack does not grow with every restart.
            </>,
            <>
              <strong>The state shows where the user is looking.</strong> While the restart runs, the overview&apos;s
              Status reads Restarting and the Restart item is disabled, so the action cannot run twice.
            </>,
            <>
              <strong>Rarely used actions are folded.</strong> Restart, snapshot and delete sit under one Actions
              button, leaving Edit settings as the only button with weight.
            </>,
            <>
              <strong>Unavailable is explained.</strong> The Logs tab stays in the row so people know logs exist, and
              its <code>disabledReason</code> says they are turned off for this project.
            </>,
            <>
              <strong>Navigation stays in the page.</strong> The side navigation, breadcrumbs and product name call{' '}
              <code>preventDefault</code> in <code>onFollow</code> and update the current sheet, as a single-page
              application with its own router would.
            </>,
            <>
              <strong>Recent events fold.</strong> The newest event is open, the others are one line each, so the tab
              stays short however many events there are.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="page" number={4} title="The page">
        <Example example={page} index={1} />
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'app-shell',
  title: 'Application shell',
  summary: 'A project detail page with top and side navigation, tabs, notifications and a title block.',
  order: 2,
  keywords: ['TopNavigation', 'SideNavigation', 'Tabs', 'Flashbar', 'detail page', 'shell'],
  Page,
};

export default doc;
