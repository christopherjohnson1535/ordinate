// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Example } from '../../parts/example';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';

const finished: LoadedExample = {
  meta: {
    id: 'services-page',
    title: 'The finished page',
    description:
      'Pick a service and press Restart: its status changes to Restarting. The links in the navigation move the position rule without leaving the page.',
    layout: 'flush',
    height: 'tall',
  },
  load: () => import('./first-page/services-page'),
  loadSource: () => import('./first-page/services-page.tsx?raw').then(module => module.default),
};

function Page() {
  return (
    <>
      <Prose>
        <p>
          This tutorial builds the services page of a small console, one component at a time: a layout with a
          navigation, a section with the project&apos;s settings, and a table of services with an action. It assumes
          you have followed <a href="#/start/installation">Installation</a>, so the global styles are imported and a
          revision is pinned.
        </p>
      </Prose>

      <DocSection id="layout" number={1} title="Lay out the page">
        <Prose>
          <p>
            AppLayout is the frame of a console page. It lays the content on a white sheet and gives the navigation its
            own strip along the side, with a toggle that collapses it. Start with the layout and a page heading.
            ContentLayout holds the heading and spaces it from the content; Header with the <code>h1</code> variant is
            the page title.
          </p>
        </Prose>
        <CodeBlock
          label="services-page.tsx"
          code={`
import React from 'react';

import AppLayout from '@ordinate/components/app-layout';
import ContentLayout from '@ordinate/components/content-layout';
import Header from '@ordinate/components/header';

export default function ServicesPage() {
  return (
    <AppLayout
      toolsHide={true}
      content={<ContentLayout header={<Header variant="h1">Services</Header>}>{/* sections */}</ContentLayout>}
    />
  );
}
`}
        />
        <Prose>
          <p>
            <code>toolsHide</code> removes the help panel and its toggle, since this page has no help yet. The layout
            scrolls with the page. When it sits inside a region of fixed height, as in the example at the end, set{' '}
            <code>disableBodyScroll</code> and it scrolls inside that region instead.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="navigation" number={2} title="Add the navigation">
        <Prose>
          <p>
            SideNavigation lists the pages of the application. <code>activeHref</code> marks the current page with the
            position rule. When you route on the client, call <code>preventDefault()</code> in <code>onFollow</code>{' '}
            and navigate yourself; the event carries the link&apos;s <code>href</code>.
          </p>
        </Prose>
        <CodeBlock
          label="services-page.tsx"
          highlightedLines={[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]}
          code={`
const [activeHref, setActiveHref] = useState('#services');

<AppLayout
  navigation={
    <SideNavigation
      header={{ text: 'North Annex', href: '#overview' }}
      activeHref={activeHref}
      onFollow={event => {
        event.preventDefault();
        setActiveHref(event.detail.href);
      }}
      items={[
        { type: 'link', text: 'Overview', href: '#overview' },
        { type: 'link', text: 'Services', href: '#services' },
        { type: 'link', text: 'Deployments', href: '#deployments' },
      ]}
    />
  }
  toolsHide={true}
  content={/* as before */}
/>
`}
        />
      </DocSection>

      <DocSection id="details" number={3} title="Show the settings">
        <Prose>
          <p>
            A Container is a section of the sheet. Its heading sits in a margin column against a construction line, and
            its <code>kind</code> says what it holds: these are settings people change, so it is{' '}
            <code>configuration</code>, drawn in drafting blue, with the reference C1. KeyValuePairs sets each label
            against the same kind of margin, with the value beside it in ink.
          </p>
        </Prose>
        <CodeBlock
          label="services-page.tsx"
          code={`
<Container kind="configuration" reference="C1" heading="Environment" measure="3 settings">
  <KeyValuePairs
    columns={3}
    items={[
      { label: 'Project', value: 'North Annex' },
      { label: 'Region', value: 'us-mountain-1' },
      { label: 'Owner', value: 'Dana Ruiz' },
    ]}
  />
</Container>
`}
        />
        <Prose>
          <p>
            <code>measure</code> is drawn in a dimension line on the line that opens the section. Columns drop away as
            the container narrows, so the pairs stay readable on a small screen.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="table" number={4} title="List the services">
        <Prose>
          <p>
            A Table is drawn as a schedule. Give it the items and a column definition for each column: a{' '}
            <code>header</code> and a <code>cell</code> function. <code>contentType</code> letters names and figures in
            mono, and figures line up at the end of the column. The services are things that run, so the table&apos;s
            kind is <code>resource</code>.
          </p>
        </Prose>
        <CodeBlock
          label="services-page.tsx"
          code={`
const columnDefinitions: TableProps.ColumnDefinition<Service>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true, contentType: 'identifier' },
  {
    id: 'status',
    header: 'Status',
    cell: item => <StatusIndicator state={states[item.status]}>{item.status}</StatusIndicator>,
  },
  { id: 'image', header: 'Image', cell: item => item.image, contentType: 'identifier' },
  { id: 'nodes', header: 'Nodes', cell: item => item.nodes, contentType: 'number' },
];

<Table
  items={services}
  columnDefinitions={columnDefinitions}
  trackBy="name"
  kind="resource"
  reference="R1"
  header={<Header counter={\`(\${services.length})\`}>Services</Header>}
/>
`}
        />
        <Prose>
          <p>
            Put the Container and the Table in a <code>SpaceBetween size=&quot;l&quot;</code> so the two sections keep
            the same gap on every page. The table draws the Header&apos;s counter in its dimension line.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="action" number={5} title="Add an action">
        <Prose>
          <p>
            Let people pick a service and restart it. With <code>selectionType=&quot;single&quot;</code> each row gets
            a radio button; the table is controlled, so keep the picked items in state and update them in{' '}
            <code>onSelectionChange</code>. The Restart button goes in the Header&apos;s <code>actions</code>, and stays
            disabled until a row is picked.
          </p>
        </Prose>
        <CodeBlock
          label="services-page.tsx"
          code={`
const [selected, setSelected] = useState<Service[]>([]);
const target = selected[0];

const restart = () => {
  setServices(current => current.map(item => (item.name === target.name ? { ...item, status: 'Restarting' } : item)));
  setSelected([]);
};

<Table
  /* items, columns, kind and reference as before */
  selectionType="single"
  selectedItems={selected}
  onSelectionChange={event => setSelected(event.detail.selectedItems)}
  ariaLabels={{ itemSelectionLabel: (_, item) => \`Select \${item.name}\` }}
  header={
    <Header
      counter={\`(\${services.length})\`}
      actions={
        <Button disabled={!target} onClick={restart}>
          Restart
        </Button>
      }
    >
      Services
    </Header>
  }
/>
`}
        />
        <Notes
          items={[
            <>
              <code>trackBy</code> tells the table which property identifies an item, so a picked row stays picked when
              the items are replaced with new objects, as they are after a fetch. Keep the services in state too:{' '}
              <code>const [services, setServices] = useState(initialServices)</code>.
            </>,
            <>
              <code>itemSelectionLabel</code> names each radio button after its service, so a screen reader says
              &quot;Select atrium-api&quot; rather than a row number.
            </>,
            <>
              The disabled button is hatched. The footer of the finished table says why in words, as the design
              language asks.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="finished" number={6} title="The finished page">
        <Example example={finished} index={1} />
        <Prose>
          <p>
            Switch the example to dark mode, to the other revision or to right to left with its toolbar: the page
            follows without a change to its code. From here, <a href="#/components/table">Table</a> shows sorting,
            filtering and pagination with the collection hooks, and <a href="#/components/app-layout">AppLayout</a>{' '}
            adds breadcrumbs, a help panel and a title block.
          </p>
        </Prose>
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'first-page',
  title: 'Your first page',
  summary: 'Build a small console page step by step: a layout, a navigation, a section of settings and a table.',
  order: 2,
  keywords: ['tutorial', 'AppLayout', 'SideNavigation', 'Container', 'KeyValuePairs', 'Table', 'Button', 'console'],
  Page,
};

export default guide;
