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
    id: 'console',
    title: 'Annex Console, sheet A-02',
    description: (
      <p>
        The whole page, running. Filter the services, sort a column, pick a row to see it in the split panel, or open
        the logs from the note in the margin. The page scrolls inside the frame.
      </p>
    ),
    layout: 'flush',
    height: 'tall',
  },
  load: () => import('../../../../pages/examples/console.page'),
  loadSource: () => import('../../../../pages/examples/console.page.tsx?raw').then(module => module.default),
};

const parts: ReadonlyArray<Part> = [
  {
    name: 'TopNavigation',
    folder: 'top-navigation',
    role: 'The title block across the top: the product name, a command line and the signed-in person.',
  },
  {
    name: 'AppLayout',
    folder: 'app-layout',
    role: (
      <>
        Lays the sheet on the paper and places every region around it. <code>contentType="table"</code> gives the
        schedule the full width; <code>disableBodyScroll</code> keeps the scrolling inside the fixed-height region.
      </>
    ),
  },
  {
    name: 'SideNavigation',
    folder: 'side-navigation',
    role: 'The index of the drawing set: one set of sheets for the project and a second group for the account.',
  },
  { name: 'BreadcrumbGroup', folder: 'breadcrumb-group', role: 'Where the sheet sits: Projects, then North Annex.' },
  {
    name: 'Flashbar',
    folder: 'flashbar',
    role: 'A fault note in the margin beside the sheet, with an action that opens the Logs tab.',
  },
  {
    name: 'TitleBlock',
    folder: 'title-block',
    role: 'The foot of the sheet: project, sheet number, revision and who checked it. The sheet cell follows the navigation.',
  },
  {
    name: 'ContentLayout',
    folder: 'content-layout',
    role: 'Holds the page header above the content.',
  },
  {
    name: 'Header',
    folder: 'header',
    role: (
      <>
        The page title with its sheet code, a description and the two page actions; again as the table header with a
        counter.
      </>
    ),
  },
  { name: 'Stamp', folder: 'stamp', role: 'The state of the whole environment, set beside its name.' },
  {
    name: 'Container',
    folder: 'container',
    role: (
      <>
        Two sections, each with a kind and a reference: C1 for the environment&apos;s settings, R1 for its health.
      </>
    ),
  },
  { name: 'KeyValuePairs', folder: 'key-value-pairs', role: 'The environment settings in a margin layout.' },
  {
    name: 'ColumnLayout',
    folder: 'column-layout',
    role: 'Sets the four health readings side by side with rules between them.',
  },
  {
    name: 'Measure',
    folder: 'measure',
    role: 'One reading each: a value of a maximum on a ruler, a plain rate, a value against a target limit.',
  },
  { name: 'Tabs', folder: 'tabs', role: 'Services, Deployments and Logs on one sheet, with the Logs tab opened from the note.' },
  {
    name: 'Table',
    folder: 'table',
    role: (
      <>
        The schedule of services: a caption, a stable row tag S1 to S7, single selection and columns chosen in the
        preferences.
      </>
    ),
  },
  {
    name: 'PropertyFilter',
    folder: 'property-filter',
    role: 'Typed filters on name, status, image and nodes, with a count of matches against the total.',
  },
  { name: 'Pagination', folder: 'pagination', role: 'Five services a sheet, or ten from the preferences.' },
  {
    name: 'CollectionPreferences',
    folder: 'collection-preferences',
    role: 'Page size, striped rows and which columns show, confirmed together.',
  },
  { name: 'StatusIndicator', folder: 'status-indicator', role: 'The state of each service, in the table and the panel.' },
  {
    name: 'SplitPanel',
    folder: 'split-panel',
    role: 'The detail of the picked service beside the schedule, tagged with the same reference as its row.',
  },
  { name: 'ProgressBar', folder: 'progress-bar', role: 'A rollout in progress, shown in the panel for services on web:v2.' },
  { name: 'HelpPanel', folder: 'help-panel', role: 'A margin note about services, closed until the user opens it.' },
];

function Page() {
  return (
    <>
      <DocSection id="purpose" number={1} title="What the page is for">
        <Prose>
          <p>
            The console is the page most applications are built around: one environment, the things running in it, and
            the detail of one of them. A person comes here to check that everything is healthy, find the service that
            is not, and act on it without leaving the page.
          </p>
          <p>
            It is the reference for an application page in Ordinate. Every region of{' '}
            <a href="#/components/app-layout">AppLayout</a> is in use, and the schedule of services is driven by{' '}
            <a href="#/packages/collection-hooks">useCollection</a>.
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
              <strong>References tie the page together.</strong> Each service keeps its tag, S1 to S7, from its place in
              the full list, so sorting, filtering and paging never renumber it. The split panel&apos;s{' '}
              <code>headerTag</code> uses the same tag, and the Restart button names it: &quot;Restart S1&quot;.
            </>,
            <>
              <strong>Kinds say what a section holds.</strong> The environment&apos;s settings are{' '}
              <code>configuration</code> (C1); its health and the logs are <code>resource</code> (R1, R2). The color is
              never the only signal, because the reference letter says the same.
            </>,
            <>
              <strong>Selection lives in the page.</strong> The table spreads <code>collectionProps</code>, then sets{' '}
              <code>selectedItems</code> and <code>onSelectionChange</code> itself, because the split panel and the
              Restart button read the picked service too. Props after the spread win, so the picked service stays
              picked while the user filters.
            </>,
            <>
              <strong>The schedule is the main content.</strong> <code>contentType=&quot;table&quot;</code> gives it the
              full width, the header counter is drawn on the dimension line, and the property filter reports{' '}
              &quot;4 of 7&quot; rather than a bare count, so the user knows how much is hidden.
            </>,
            <>
              <strong>One fault, one note, one action.</strong> The failed health check is a fault in the margin with
              the next step on it. Open logs switches to the Logs tab, where the three log lines are shown in a resource
              section.
            </>,
            <>
              <strong>Two page actions.</strong> Preview changes and Deploy sit on the page header, with Deploy as the
              only primary button. Actions on one service sit on the table header, where the selection is.
            </>,
            <>
              <strong>Help stays closed.</strong> The help panel is there for the first visit and out of the way after
              it; a table page needs the width more.
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
  slug: 'console',
  title: 'Console',
  summary: 'An application page with navigation, a schedule of services, a split panel and notes in the margin.',
  order: 1,
  keywords: ['AppLayout', 'Table', 'PropertyFilter', 'SplitPanel', 'useCollection', 'dashboard', 'application page'],
  Page,
};

export default doc;
