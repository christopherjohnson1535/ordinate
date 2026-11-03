// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Cards from '@ordinate/components/cards';
import Checkbox from '@ordinate/components/checkbox';
import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import SegmentedControl from '@ordinate/components/segmented-control';
import SideNavigation from '@ordinate/components/side-navigation';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator, { StatusIndicatorProps } from '@ordinate/components/status-indicator';
import Table, { TableProps } from '@ordinate/components/table';
import Tabs from '@ordinate/components/tabs';
import Toggle from '@ordinate/components/toggle';
import ToggleButton from '@ordinate/components/toggle-button';
import TreeView from '@ordinate/components/tree-view';

import { href } from '../../app/router';
import { DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { Figure, Split } from './shared/figure';

import styles from './selection.module.scss';

function Kind({
  code,
  title,
  question,
  readout,
  children,
}: {
  code: string;
  title: string;
  question: string;
  readout: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.kind}>
      <div className={styles['kind-head']}>
        <span className={styles['kind-code']}>{code}</span>
        <h3 className={styles['kind-title']}>{title}</h3>
      </div>
      <p className={styles['kind-question']}>{question}</p>
      <div className={styles['kind-stage']}>{children}</div>
      <p className={styles.readout} aria-live="polite">
        {readout}
      </p>
    </div>
  );
}

function OneOfASet() {
  const [range, setRange] = useState('week');
  const [page, setPage] = useState(2);
  return (
    <Kind
      code="M5 · Crop marks"
      title="One of a set"
      question="Which one of these is showing?"
      readout={
        <>
          Range <span className={styles['readout-value']}>{range}</span>, sheet{' '}
          <span className={styles['readout-value']}>{page}</span> of 6
        </>
      }
    >
      <SegmentedControl
        label="Range"
        selectedId={range}
        onChange={event => setRange(event.detail.selectedId)}
        options={[
          { id: 'day', text: 'Day' },
          { id: 'week', text: 'Week' },
          { id: 'month', text: 'Month' },
        ]}
      />
      <Pagination
        currentPageIndex={page}
        pagesCount={6}
        onChange={event => setPage(event.detail.currentPageIndex)}
        ariaLabels={{ pageLabel: number => `Sheet ${number}` }}
      />
    </Kind>
  );
}

function OnOff() {
  const [backups, setBackups] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [logs, setLogs] = useState(true);
  return (
    <Kind
      code="M10 · Ink fill"
      title="On or off"
      question="Is this switched on?"
      readout={
        <>
          Backups <span className={styles['readout-value']}>{backups ? 'on' : 'off'}</span>, pinned{' '}
          <span className={styles['readout-value']}>{pinned ? 'yes' : 'no'}</span>
        </>
      }
    >
      <Toggle checked={backups} onChange={event => setBackups(event.detail.checked)}>
        Nightly backups
      </Toggle>
      <Checkbox checked={logs} onChange={event => setLogs(event.detail.checked)}>
        Keep request logs
      </Checkbox>
      <div>
        <ToggleButton
          pressed={pinned}
          onChange={event => setPinned(event.detail.pressed)}
          iconName="star"
          pressedIconName="star-solid"
        >
          Pin
        </ToggleButton>
      </div>
    </Kind>
  );
}

interface Node {
  id: string;
  name: string;
  children?: Node[];
}

const drawings: Node[] = [
  {
    id: 'plans',
    name: 'Plans',
    children: [
      { id: 'a-101', name: 'A-101 Ground floor' },
      { id: 'a-102', name: 'A-102 Roof' },
    ],
  },
];

function YouAreHere() {
  const [page, setPage] = useState('#/services');
  const [current, setCurrent] = useState('a-101');
  return (
    <Kind
      code="M11 · Position rule"
      title="You are here"
      question="Where am I in this set of pages?"
      readout={
        <>
          On <span className={styles['readout-value']}>{page.replace('#/', '')}</span>
        </>
      }
    >
      <SideNavigation
        activeHref={page}
        onFollow={event => {
          event.preventDefault();
          setPage(event.detail.href);
        }}
        items={[
          { type: 'link', text: 'Overview', href: '#/overview' },
          { type: 'link', text: 'Services', href: '#/services' },
          { type: 'link', text: 'Logs', href: '#/logs' },
        ]}
      />
      <TreeView
        ariaLabel="Drawings"
        items={drawings}
        expandedItems={['plans']}
        currentItemId={current}
        getItemId={node => node.id}
        getItemChildren={node => node.children}
        renderItem={node => ({
          content: node.children ? (
            node.name
          ) : (
            <Button variant="link" onClick={() => setCurrent(node.id)}>
              {node.name}
            </Button>
          ),
        })}
      />
    </Kind>
  );
}

interface Service {
  name: string;
  state: StatusIndicatorProps.State;
  label: string;
}

const services: Service[] = [
  { name: 'north-annex-web', state: 'complete', label: 'Running' },
  { name: 'atrium-api', state: 'complete', label: 'Running' },
  { name: 'vault-store', state: 'fault', label: 'Failed' },
];

const columns: TableProps.ColumnDefinition<Service>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true, contentType: 'identifier' },
  { id: 'state', header: 'State', cell: item => <StatusIndicator state={item.state}>{item.label}</StatusIndicator> },
];

function Picked() {
  const [picked, setPicked] = useState<Service[]>([services[2]]);
  return (
    <Kind
      code="M6 + M11 · Raised row"
      title="Picked for an action"
      question="Which of these will the action apply to?"
      readout={
        <>
          <span className={styles['readout-value']}>{picked.length}</span> picked for Restart
        </>
      }
    >
      <Table
        variant="embedded"
        items={services}
        columnDefinitions={columns}
        trackBy="name"
        selectionType="multi"
        selectedItems={picked}
        onSelectionChange={event => setPicked(event.detail.selectedItems)}
        ariaLabels={{
          tableLabel: 'Services',
          allItemsSelectionLabel: () => 'Pick every service',
          itemSelectionLabel: (_, item) => `Pick ${item.name}`,
        }}
      />
      <div>
        <Button disabled={picked.length === 0}>Restart {picked.length || ''}</Button>
      </div>
    </Kind>
  );
}

interface Plan {
  name: string;
  nodes: string;
  price: string;
}

const plans: Plan[] = [
  { name: 'Small', nodes: '2 nodes', price: '$40 a month' },
  { name: 'Standard', nodes: '8 nodes', price: '$150 a month' },
  { name: 'Large', nodes: '20 nodes', price: '$360 a month' },
];

function CardsCompared() {
  const [single, setSingle] = useState<Plan[]>([plans[1]]);
  const [multi, setMulti] = useState<Plan[]>([plans[0], plans[2]]);
  const definition = {
    header: (item: Plan) => item.name,
    sections: [
      { id: 'nodes', content: (item: Plan) => item.nodes },
      { id: 'price', content: (item: Plan) => item.price },
    ],
  };
  return (
    <SpaceBetween size="xl">
      <Cards
        items={plans}
        trackBy="name"
        selectionType="single"
        selectedItems={single}
        onSelectionChange={event => setSingle(event.detail.selectedItems)}
        cardDefinition={definition}
        cardsPerRow={[{ cards: 1 }, { minWidth: 480, cards: 3 }]}
        ariaLabels={{ selectionGroupLabel: 'Plan', itemSelectionLabel: (_, item) => item.name }}
        header={<Header variant="h3">Choose one plan</Header>}
      />
      <Cards
        items={plans}
        trackBy="name"
        selectionType="multi"
        selectedItems={multi}
        onSelectionChange={event => setMulti(event.detail.selectedItems)}
        cardDefinition={definition}
        cardsPerRow={[{ cards: 1 }, { minWidth: 480, cards: 3 }]}
        ariaLabels={{
          selectionGroupLabel: 'Plans to compare',
          itemSelectionLabel: (_, item) => `Compare ${item.name}`,
        }}
        header={<Header variant="h3">Pick plans to compare</Header>}
      />
    </SpaceBetween>
  );
}

function TabsCompared() {
  const [tab, setTab] = useState('services');
  const [follow, setFollow] = useState(true);
  return (
    <SpaceBetween size="l">
      <Tabs
        activeTabId={tab}
        onChange={event => setTab(event.detail.activeTabId)}
        ariaLabel="North annex"
        tabs={[
          { id: 'services', label: 'Services', content: 'Seven services, five running.' },
          {
            id: 'logs',
            label: 'Logs',
            content: (
              <Toggle checked={follow} onChange={event => setFollow(event.detail.checked)}>
                Follow new lines
              </Toggle>
            ),
          },
        ]}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        The open tab is one of a set; the toggle inside the Logs tab is on or off. Each keeps its own mark.
      </Box>
    </SpaceBetween>
  );
}

function Page() {
  return (
    <>
      <Prose>
        <p>
          &quot;Selected&quot; means four different things in an interface, and Ordinate draws each with its own mark. A
          reader can tell from the drawing alone whether something is the one showing, switched on, the place they are,
          or picked for an action. The four are never mixed (P4).
        </p>
      </Prose>

      <DocSection id="four-kinds" number={1} title="The four kinds">
        <div className={styles['quad-frame']}>
          <div className={styles.quad}>
            <OneOfASet />
            <OnOff />
            <YouAreHere />
            <Picked />
          </div>
        </div>
      </DocSection>

      <DocSection id="one-of-a-set" number={2} title="One of a set">
        <Split
          text={
            <>
              <p>
                When exactly one item of a group is showing or chosen, it carries ink crop marks: closed into a frame
                with heavier corners on cards and tiles, open corners only on short items in a row. The others keep
                faint marks in their kind&apos;s color, so the set still reads as a set.
              </p>
              <p>
                In tabs, segmented controls and pagination the marks slide to the next choice, quickly and slowing as
                they land. With reduced motion they move at once.
              </p>
              <p>
                Cards with <code>selectionType=&quot;multi&quot;</code> pick items for an action, so each picked card
                also shows its checked key.
              </p>
            </>
          }
        >
          <Figure code="M5" caption="Single and multiple selection in Cards. Click a card's control to choose.">
            <CardsCompared />
          </Figure>
        </Split>
      </DocSection>

      <DocSection id="on-off" number={3} title="On or off">
        <Split
          text={
            <>
              <p>
                A setting that is either on or off fills with ink while it is on: the track of a Toggle, the body of a
                pressed ToggleButton, the square of a checked Checkbox. Text and icons on the ink turn to paper.
              </p>
              <p>
                Ink fill never marks a choice among options. When the choice is &quot;which one&quot;, use crop marks,
                even if there are only two options.
              </p>
            </>
          }
        >
          <Figure code="M5 · M10" caption="A tab is one of a set; the toggle inside it is on or off.">
            <TabsCompared />
          </Figure>
        </Split>
      </DocSection>

      <DocSection id="you-are-here" number={4} title="You are here">
        <Prose>
          <p>
            Navigation marks the page, heading or node the reader is on with the position rule: a short heavy ink rule
            on the leading edge. It moves with the reader, not with a click on a control. SideNavigation sets{' '}
            <code>aria-current=&quot;page&quot;</code>, and AnchorNavigation and TreeView set <code>aria-current</code>{' '}
            on the current item, so screen readers hear the same thing the rule shows.
          </p>
          <p>
            &quot;On this sheet&quot;, at the side of this page, is drawn the same way: scroll and the rule follows the
            section you are reading.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="picked" number={5} title="Picked for an action">
        <Prose>
          <p>
            Rows of a table picked for an action are drawn with three marks at once, because picking is the strongest
            kind of selection: the row&apos;s checked key, a raised background, and the position rule on its leading
            edge. The action that will use them sits above the table and says how many it will act on.
          </p>
        </Prose>
        <Notes
          items={[
            <>
              Use <code>selectionType=&quot;multi&quot;</code> when the action can apply to several rows, and{' '}
              <code>single</code> when it applies to one. Single selection draws a radio button in place of the key.
            </>,
            <>Name the action and the count together, such as &quot;Restart 2&quot;, so the result is clear.</>,
            <>
              Disable the action while nothing is picked, and keep the reason visible. See{' '}
              <a href={href('/components/table')}>Table</a>.
            </>,
          ]}
        />
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'selection',
  title: 'Selection',
  summary: 'The four kinds of selection, one of a set, on or off, you are here and picked, and the mark for each.',
  order: 3,
  keywords: ['selected', 'active', 'current', 'checked', 'pressed', 'crop marks', 'ink fill', 'position rule'],
  Page,
};

export default doc;
