// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ActionCard from '@ordinate/components/action-card';
import Alert from '@ordinate/components/alert';
import AnchorNavigation from '@ordinate/components/anchor-navigation';
import Badge from '@ordinate/components/badge';
import Box from '@ordinate/components/box';
import BreadcrumbGroup from '@ordinate/components/breadcrumb-group';
import Button from '@ordinate/components/button';
import ButtonDropdown from '@ordinate/components/button-dropdown';
import Checkbox from '@ordinate/components/checkbox';
import ColumnLayout from '@ordinate/components/column-layout';
import Container from '@ordinate/components/container';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import Link from '@ordinate/components/link';
import Modal from '@ordinate/components/modal';
import Popover from '@ordinate/components/popover';
import ProgressBar from '@ordinate/components/progress-bar';
import SegmentedControl from '@ordinate/components/segmented-control';
import SideNavigation from '@ordinate/components/side-navigation';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';
import Tabs from '@ordinate/components/tabs';
import Textarea from '@ordinate/components/textarea';
import Tiles from '@ordinate/components/tiles';
import Toggle from '@ordinate/components/toggle';
import ToggleButton from '@ordinate/components/toggle-button';

import { href } from '../../app/router';
import { DocSection, Prose, SubHeading } from '../../parts/prose';
import { componentDocs } from '../../registry/components';
import { GuideDoc } from '../../registry/guides';
import { Mark, marks } from '../../registry/marks';
import { MarkId } from '../../registry/types';
import { Facts, Figure, Split } from './shared/figure';

import styles from './marks.module.scss';

const stay = (event: CustomEvent) => event.preventDefault();

/** A small drawing of each mark for the legend, made with the same tokens as the components. */
function Glyph({ id }: { id: MarkId }) {
  switch (id) {
    case 'M1':
      return (
        <span className={styles.glyph}>
          <span className={styles['glyph-line']} />
        </span>
      );
    case 'M2':
      return (
        <span className={styles.glyph}>
          <span className={styles['glyph-line']} />
          <span className={styles['glyph-tick']} style={{ insetInlineStart: 2, insetBlockStart: 13 }} />
          <span className={styles['glyph-tick']} style={{ insetInlineEnd: 2, insetBlockStart: 13 }} />
        </span>
      );
    case 'M5':
      return (
        <span className={styles.glyph}>
          <svg className={styles['glyph-crop']} viewBox="0 0 28 24" fill="none" stroke="currentColor" aria-hidden>
            <path d="M1 7V1h6M21 1h6v6M27 17v6h-6M7 23H1v-6" strokeWidth="1.5" />
          </svg>
        </span>
      );
    case 'M6':
      return (
        <span className={styles['glyph-key']}>
          <span className={styles['key-all']} />
          <span className={styles['key-some']} />
          <span />
        </span>
      );
    case 'M8':
      return <span className={styles['glyph-ref']}>R2</span>;
    case 'M9':
      return <span className={styles['glyph-plate']} />;
    case 'M10':
      return <span className={styles['glyph-ink']} />;
    case 'M11':
      return <span className={styles['glyph-rule']} />;
    case 'M12':
      return <span className={styles['glyph-hatch']} />;
    case 'M13':
      return <span className={styles['glyph-offset']} />;
    case 'M4':
      return (
        <span className={styles['glyph-margin']}>
          <span />
          <span />
          <span />
        </span>
      );
    case 'M3':
      return (
        <svg width="40" height="14" viewBox="0 0 40 14" fill="none" stroke="currentColor" aria-hidden>
          <path d="M1 3v8M39 3v8M1 7h12M27 7h12M-2 10l6-6M36 10l6-6" strokeWidth="1" />
          <text x="20" y="10" fontSize="8" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="monospace">
            8
          </text>
        </svg>
      );
    case 'M7':
      return (
        <svg width="40" height="14" viewBox="0 0 40 14" fill="none" stroke="currentColor" aria-hidden>
          <circle cx="3" cy="7" r="2" fill="currentColor" stroke="none" />
          <path d="M3 7h33M31 3l5 4-5 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

function M1Figure() {
  return (
    <ColumnLayout columns={2} minColumnWidth={220}>
      <Container kind="configuration" reference="C1" heading="Environment" description="Read by every node.">
        LOG_LEVEL is info.
      </Container>
      <Container kind="policy" reference="P1" heading="Retention" description="Applies to every bucket.">
        Keep logs for 30 days.
      </Container>
    </ColumnLayout>
  );
}

function M2Figure() {
  return (
    <div className={styles['demo-row']}>
      <div className={styles['demo-cell']}>
        <div className={styles['hash-demo']} aria-hidden="true">
          <span className={`${styles['hash-line']} ${styles['hash-line-top']}`} />
          <span className={`${styles['hash-line']} ${styles['hash-line-side']}`} />
          <span className={`${styles['hash-tick']} ${styles['hash-start']}`} />
          <span className={`${styles['hash-tick']} ${styles['hash-end']}`} />
          <span className={`${styles['hash-tick']} ${styles['hash-meet']}`} />
          <span className={`${styles['hash-tick']} ${styles['hash-foot']}`} />
          <span className={styles['hash-callout']}>Lines meet</span>
        </div>
        <p className={styles['demo-label']}>A section&apos;s frame, enlarged</p>
      </div>
      <div className={styles['demo-wide']}>
        <Container kind="resource" heading="Nodes" measure="12 nodes">
          The ticks close the top line, the margin line and the dimension line.
        </Container>
        <p className={styles['demo-label']}>In a Container</p>
      </div>
    </div>
  );
}

function M3Figure() {
  const [note, setNote] = useState('Restart after the 02:00 backup.');
  return (
    <SpaceBetween size="l">
      <Container heading="Deployments" measure="7 services">
        The count of what the section holds, lettered on the dimension line.
      </Container>
      <ProgressBar label="Rolling out web:v2" value={60} additionalInfo="3 of 5 replicas ready." />
      <FormField label="Maintenance note" characterCountText={`${200 - note.length} characters left`}>
        <Textarea value={note} rows={2} onChange={event => setNote(event.detail.value)} />
      </FormField>
    </SpaceBetween>
  );
}

function M4Figure() {
  const [owner, setOwner] = useState('Dana Ruiz');
  return (
    <SpaceBetween size="l">
      <KeyValuePairs
        items={[
          { label: 'Region', value: 'us-mountain-1' },
          { label: 'Image', value: 'web:v2' },
        ]}
      />
      <FormField label="Owner" description="Paged when an alarm opens.">
        <Input value={owner} onChange={event => setOwner(event.detail.value)} />
      </FormField>
      <Alert type="caution" header="One alarm open">
        vault-store has failed its health check three times.
      </Alert>
    </SpaceBetween>
  );
}

function M5Figure() {
  const [plan, setPlan] = useState('standard');
  const [range, setRange] = useState('week');
  return (
    <SpaceBetween size="l">
      <Tiles
        value={plan}
        onChange={event => setPlan(event.detail.value)}
        ariaLabel="Plan"
        columns={3}
        items={[
          { value: 'small', label: 'Small', description: '2 nodes' },
          { value: 'standard', label: 'Standard', description: '8 nodes' },
          { value: 'large', label: 'Large', description: '20 nodes' },
        ]}
      />
      <SegmentedControl
        label="Usage over"
        selectedId={range}
        onChange={event => setRange(event.detail.selectedId)}
        options={[
          { id: 'day', text: 'Day' },
          { id: 'week', text: 'Week' },
          { id: 'month', text: 'Month' },
        ]}
      />
    </SpaceBetween>
  );
}

function M6Figure() {
  const [checked, setChecked] = useState([true, false, true]);
  const all = checked.every(Boolean);
  const some = checked.some(Boolean) && !all;
  const zones = ['us-mountain-1a', 'us-mountain-1b', 'us-mountain-1c'];
  return (
    <ColumnLayout columns={2} minColumnWidth={220}>
      <SpaceBetween size="xs">
        <Checkbox
          checked={all}
          indeterminate={some}
          onChange={event => setChecked(checked.map(() => event.detail.checked))}
        >
          All zones
        </Checkbox>
        {zones.map((zone, index) => (
          <Box key={zone} padding={{ left: 'l' }}>
            <Checkbox
              checked={checked[index]}
              onChange={event => setChecked(checked.map((value, i) => (i === index ? event.detail.checked : value)))}
            >
              {zone}
            </Checkbox>
          </Box>
        ))}
      </SpaceBetween>
      <SpaceBetween size="xs">
        <Badge tone="critical">Critical</Badge>
        <Badge tone="medium">Medium</Badge>
        <Badge tone="low">Low</Badge>
        <Badge tone="complete">Verified</Badge>
      </SpaceBetween>
    </ColumnLayout>
  );
}

function M7Figure() {
  return (
    <SpaceBetween size="l">
      <BreadcrumbGroup
        onFollow={stay}
        items={[
          { text: 'Projects', href: '#projects' },
          { text: 'North annex', href: '#north-annex' },
          { text: 'Services', href: '#services' },
        ]}
      />
      <SpaceBetween direction="horizontal" size="l" alignItems="center">
        <Button href="#/foundations/selection" onClick={event => event.preventDefault()}>
          Open the log
        </Button>
        <Link href="https://example.com" external={true}>
          Status page
        </Link>
        <Box>
          Memory:{' '}
          <Popover header="Memory" content="512 MiB of 2 GiB in use across 12 nodes." position="right">
            512 MiB
          </Popover>
        </Box>
      </SpaceBetween>
    </SpaceBetween>
  );
}

function M8Figure() {
  const [tab, setTab] = useState('nodes');
  return (
    <SpaceBetween size="l">
      <ColumnLayout columns={3} minColumnWidth={140}>
        <Container kind="configuration" reference="C3" heading="Ports" />
        <Container kind="resource" reference="R2" heading="Volumes" />
        <Container kind="policy" reference="P1" heading="Access" />
      </ColumnLayout>
      <Tabs
        kind="resource"
        activeTabId={tab}
        onChange={event => setTab(event.detail.activeTabId)}
        ariaLabel="Resources"
        tabs={[
          { id: 'nodes', label: 'Nodes', reference: 'R1' },
          { id: 'volumes', label: 'Volumes', reference: 'R2' },
        ]}
      />
    </SpaceBetween>
  );
}

function M9Figure() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles['plate-veil']}>
      <SpaceBetween size="l" alignItems="center">
        <div className={styles['plate-sample']}>
          <span className={styles['plate-title']}>Delete vault-store?</span>
          <Box color="text-body-secondary" fontSize="body-s">
            A plate lies over a paper veil, so the page recedes without going dark.
          </Box>
        </div>
        <SpaceBetween direction="horizontal" size="s">
          <Button onClick={() => setOpen(true)}>Open a modal</Button>
          <ButtonDropdown
            items={[
              { id: 'restart', text: 'Restart' },
              { id: 'scale', text: 'Scale' },
              { id: 'delete', text: 'Delete', disabled: true, disabledReason: 'Stop the service first.' },
            ]}
          >
            Open a menu
          </ButtonDropdown>
        </SpaceBetween>
      </SpaceBetween>
      <Modal
        visible={open}
        onDismiss={() => setOpen(false)}
        kind="resource"
        reference="R2"
        header="Delete vault-store?"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        The two nodes and their volumes are removed. Snapshots are kept for 30 days.
      </Modal>
    </div>
  );
}

function M10Figure() {
  const [on, setOn] = useState(true);
  const [pinned, setPinned] = useState(true);
  const [checked, setChecked] = useState(true);
  return (
    <SpaceBetween direction="horizontal" size="xl" alignItems="center">
      <Toggle checked={on} onChange={event => setOn(event.detail.checked)}>
        Public endpoint
      </Toggle>
      <ToggleButton
        pressed={pinned}
        onChange={event => setPinned(event.detail.pressed)}
        iconName="star"
        pressedIconName="star-solid"
      >
        Pinned
      </ToggleButton>
      <Checkbox checked={checked} onChange={event => setChecked(event.detail.checked)}>
        Keep logs
      </Checkbox>
    </SpaceBetween>
  );
}

function M11Figure() {
  const [page, setPage] = useState('#/services');
  const [anchor, setAnchor] = useState('#site');
  return (
    <ColumnLayout columns={2} minColumnWidth={220}>
      <SideNavigation
        header={{ text: 'North annex', href: '#/' }}
        activeHref={page}
        onFollow={event => {
          event.preventDefault();
          setPage(event.detail.href);
        }}
        items={[
          { type: 'link', text: 'Overview', href: '#/overview' },
          { type: 'link', text: 'Services', href: '#/services' },
          { type: 'link', text: 'Deployments', href: '#/deployments' },
        ]}
      />
      <AnchorNavigation
        activeHref={anchor}
        onFollow={event => {
          event.preventDefault();
          setAnchor(event.detail.href);
        }}
        anchors={[
          { text: 'Scope of work', href: '#scope', level: 1 },
          { text: 'Site and access', href: '#site', level: 1 },
          { text: 'Deliveries', href: '#deliveries', level: 2 },
        ]}
      />
    </ColumnLayout>
  );
}

function M12Figure() {
  const [range, setRange] = useState('day');
  return (
    <SpaceBetween size="l">
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <Button disabled={true}>Roll back</Button>
        <Box color="text-body-secondary" fontSize="body-s">
          Nothing to roll back to: web:v2 is the first release.
        </Box>
      </SpaceBetween>
      <SegmentedControl
        label="Range"
        selectedId={range}
        onChange={event => setRange(event.detail.selectedId)}
        options={[
          { id: 'day', text: 'Day' },
          { id: 'week', text: 'Week' },
          { id: 'year', text: 'Year', disabled: true },
        ]}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        A year of usage is not kept on the free plan.
      </Box>
    </SpaceBetween>
  );
}

function M13Figure() {
  return (
    <SpaceBetween size="l">
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <Button variant="primary">Deploy</Button>
        <Button>Restart</Button>
        <Button variant="link">View log</Button>
        <Button variant="icon" iconName="copy" ariaLabel="Copy the service ID" />
      </SpaceBetween>
      <Box color="text-body-secondary" fontSize="body-s">
        Press and hold a button: it moves onto its offset. Link and icon buttons lie flat.
      </Box>
      <ActionCard header="Open the north annex" description="Seven services, five running." onClick={() => {}} />
    </SpaceBetween>
  );
}

interface MarkEntry {
  figure: React.ReactNode;
  caption: string;
  layout?: 'padded' | 'centered' | 'flush';
  drawnBy: React.ReactNode;
  text: React.ReactNode;
}

const entries: Record<MarkId, MarkEntry> = {
  M1: {
    figure: <M1Figure />,
    caption: 'Two Containers: a construction line opens each one and runs past both ends, in its kind color.',
    drawnBy: 'Container, Table, Cards, ExpandableSection, Tabs, Form, Alert, Skeleton',
    text: (
      <p>
        A thin line, held back to a faint strength, that runs a little past the ends of what it groups. It opens every
        section along the top, and a second one stands between a heading column and its content. It replaces the box a
        section would otherwise need.
      </p>
    ),
  },
  M2: {
    figure: <M2Figure />,
    caption: 'A 45° tick wherever a construction or dimension line ends or meets another.',
    drawnBy: 'Container, Form, Modal, Table, Wizard, SideNavigation, DimensionLine ends',
    text: (
      <p>
        A short 45° tick, the size of <code>size-hash-mark</code>, where a line stops or crosses another. It makes a
        faint line read as deliberate and finished. It is pure drawing and is hidden from screen readers.
      </p>
    ),
  },
  M3: {
    figure: <M3Figure />,
    caption: 'A count on a section, progress filling with ink, and the characters left under a field.',
    drawnBy: 'Container measure, Table and Cards counts, ProgressBar, FormField character count, Measure',
    text: (
      <p>
        A rule with an extension tick and hash mark at each end, with a measure lettered in the middle. It says how
        much: a count, progress, a limit or a range. The line breaks around its label, so the label is real text and
        needs no background.
      </p>
    ),
  },
  M4: {
    figure: <M4Figure />,
    caption: 'KeyValuePairs, FormField and Alert all set their label in a margin against a construction line.',
    drawnBy: 'Container, KeyValuePairs, FormField, Alert, Flashbar, HelpPanel',
    text: (
      <p>
        A label column set against a faint vertical construction line, with the content to its right. A details page and
        its edit form share the column width, <code>size-margin-column</code>, so they line up. Below 560 px a form
        field stacks its label above the control.
      </p>
    ),
  },
  M5: {
    figure: <M5Figure />,
    caption: 'Tiles and a segmented control: open crop marks on each option, closed ink marks on the chosen one.',
    drawnBy: 'Cards, ItemCard, Tiles, ActionCard, Tabs, SegmentedControl, Pagination, calendar days, FileDropzone',
    text: (
      <p>
        Marks at the four corners of a card or option, standing where a border&apos;s corners would be. On their own
        they say &quot;one of a set&quot;. Closed into an ink frame with heavier corners, they mark the one chosen. In a
        row of short items the marks slide to the next choice.
      </p>
    ),
  },
  M6: {
    figure: <M6Figure />,
    caption: 'A parent checkbox half-filled while some zones are chosen; badges keyed by solid, half and open squares.',
    drawnBy: 'Checkbox, Badge, Flashbar (collapsed), CopyToClipboard stamp',
    text: (
      <p>
        A small square, like the key beside a legend entry. Solid means all, half means some, open means none. In ink it
        is a checkbox; in a status color it keys a badge, and the fill tells the severity apart without the color.
      </p>
    ),
  },
  M7: {
    figure: <M7Figure />,
    caption: 'Breadcrumbs joined by leaders, a button and an external link that go somewhere, a popover tied by a dot.',
    drawnBy: 'Button with href, Link (external), BreadcrumbGroup, ButtonDropdown, ActionCard, Popover, Hotspot',
    text: (
      <p>
        A line with an arrowhead means &quot;this goes somewhere else&quot;. A line from a dot ties a note to its
        subject, as a popover is tied to the word that opened it. Leaders turn round in right-to-left pages.
      </p>
    ),
  },
  M8: {
    figure: <M8Figure />,
    caption: 'References in each kind color: C for configuration, R for resource, P for policy.',
    drawnBy: 'Container, Table, Cards, ItemCard, Tabs, Modal, Drawer, Form, Wizard (S1, S2 …)',
    text: (
      <p>
        A short code set in mono, such as C3, R2 or P1, in the color of the kind it names. The letter repeats the
        color&apos;s meaning, so the kind never rests on color alone. Other parts of a page can point back to a section
        by its reference.
      </p>
    ),
  },
  M9: {
    figure: <M9Figure />,
    caption: 'A plate drawn on the veil, and a real Modal and menu to open.',
    layout: 'flush',
    drawnBy: 'Modal, Dialog, Popover, ButtonDropdown menus, Select and Autosuggest lists, DatePicker',
    text: (
      <>
        <p>
          A sheet lifted off the drawing for a while. It is the only thing that gets a full box. Plates fade and rise 4
          px as they open; a modal lays its plate over a light paper veil so the page recedes without going dark.
        </p>
        <p>Open the modal or the menu beside this text to see a plate rise.</p>
      </>
    ),
  },
  M10: {
    figure: <M10Figure />,
    caption: 'A toggle, a toggle button and a checkbox, each filled with ink while it is on.',
    layout: 'centered',
    drawnBy: 'Toggle, ToggleButton, Checkbox',
    text: (
      <p>
        A solid ink surface means &quot;on&quot;. Text and marks on it turn to paper. It is used only for things that
        are on or off, never for a choice among options.
      </p>
    ),
  },
  M11: {
    figure: <M11Figure />,
    caption: 'The current page in SideNavigation and the current heading in AnchorNavigation.',
    drawnBy: 'SideNavigation, AnchorNavigation, TreeView, picked Table rows',
    text: (
      <p>
        A short heavy ink rule on the leading edge of an item: &quot;you are here&quot;. It marks the page, heading or
        node the reader is on. Screen readers hear it as the current item.
      </p>
    ),
  },
  M12: {
    figure: <M12Figure />,
    caption: 'A disabled button and a disabled segment, hatched, each with its reason in words beside it.',
    drawnBy: 'Button, Input, Checkbox, RadioButton, Toggle, SegmentedControl, Tiles, Token, calendar days',
    text: (
      <p>
        Fine 45° lines over a dimmed control: not available. The hatch never stands alone. Write the reason next to it,
        because a reader cannot ask a hatched button why.
      </p>
    ),
  },
  M13: {
    figure: <M13Figure />,
    caption: 'Pressable buttons stand on a 2 px offset; link and icon buttons and cards do not.',
    drawnBy: 'Button, ButtonDropdown, ToggleButton (2 px); every plate (4 px)',
    text: (
      <>
        <p>
          A hard, unblurred ink offset down and to the end means &quot;an object above the sheet&quot;. A pressable
          button stands <code>size-offset-control</code> (2 px) off it and presses flat onto it. Plates stand on{' '}
          <code>size-offset-plate</code> (4 px).
        </p>
        <p>Cards, tokens and link buttons never get an offset, so toolbars and grids stay light.</p>
      </>
    ),
  },
};

function usedBy(id: MarkId) {
  return componentDocs.filter(doc => doc.marks?.includes(id));
}

function MarkSection({ mark }: { mark: Mark }) {
  const entry = entries[mark.id];
  const pages = usedBy(mark.id);
  return (
    <div className={styles.entry}>
      <SubHeading id={mark.id.toLowerCase()}>{`${mark.id} ${mark.name}`}</SubHeading>
      <Split
        text={
          <>
            {entry.text}
            <Facts
              items={[
                ['Means', mark.meaning],
                ['Drawn by', entry.drawnBy],
                [
                  'Pages',
                  pages.length ? (
                    <ul className={styles['used-by']}>
                      {pages.map(doc => (
                        <li key={doc.folder}>
                          <a href={href(`/components/${doc.folder}`)}>{doc.name}</a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'None list it yet.'
                  ),
                ],
              ]}
            />
          </>
        }
      >
        <Figure code={mark.id} caption={entry.caption} layout={entry.layout}>
          {entry.figure}
        </Figure>
      </Split>
    </div>
  );
}

const groupsOfMarks: ReadonlyArray<{ id: string; title: string; description: string; ids: MarkId[] }> = [
  {
    id: 'lines',
    title: 'Lines and measures',
    description: 'How the sheet is grouped and measured, without boxes.',
    ids: ['M1', 'M2', 'M3', 'M4'],
  },
  {
    id: 'choices',
    title: 'Sets, keys and references',
    description: 'Which one, how many and what kind.',
    ids: ['M5', 'M6', 'M7', 'M8'],
  },
  {
    id: 'states',
    title: 'Lifted, on, here and unavailable',
    description: 'The marks that say what state a thing is in.',
    ids: ['M9', 'M10', 'M11', 'M12', 'M13'],
  },
];

function Page() {
  const byId = new Map(marks.map(mark => [mark.id, mark]));
  return (
    <>
      <Prose>
        <p>
          Ordinate draws its interface with thirteen marks borrowed from technical drawing. Each mark has one meaning,
          and keeps it in every component (P4). Every component page lists the marks it draws, linked to their entry
          here.
        </p>
      </Prose>

      <ul className={styles.legend} aria-label="Key to the marks">
        {marks.map(mark => (
          <li key={mark.id} className={styles['legend-item']}>
            <a className={styles['legend-link']} href={href('/foundations/marks', mark.id.toLowerCase())}>
              <span className={styles['legend-glyph']} aria-hidden="true">
                <Glyph id={mark.id} />
              </span>
              <span className={styles['legend-head']}>
                <span className={styles['legend-code']}>{mark.id}</span>
                <span className={styles['legend-name']}>{mark.name}</span>
              </span>
              <span className={styles['legend-meaning']}>{mark.meaning}</span>
            </a>
          </li>
        ))}
      </ul>

      {groupsOfMarks.map((group, index) => (
        <DocSection key={group.id} id={group.id} number={index + 1} title={group.title} description={group.description}>
          {group.ids.map(id => {
            const mark = byId.get(id);
            return mark ? <MarkSection key={id} mark={mark} /> : null;
          })}
        </DocSection>
      ))}

      <DocSection id="status-marks" number={4} title="Marks that carry status">
        <Prose>
          <p>
            Status is not a mark of its own. It colors a mark that is already there: the icon of a StatusIndicator, the
            key square of a Badge, the construction line of an Alert. The words stay in ink, and the icon&apos;s shape
            tells the states apart without the color.
          </p>
        </Prose>
        <Figure code="M6 · M1" caption="StatusIndicator icons, Badge keys and an Alert's line take the status color.">
          <SpaceBetween size="l">
            <SpaceBetween direction="horizontal" size="l">
              <StatusIndicator state="complete">Running</StatusIndicator>
              <StatusIndicator state="underway">Deploying</StatusIndicator>
              <StatusIndicator state="caution">Degraded</StatusIndicator>
              <StatusIndicator state="fault">Failed</StatusIndicator>
              <StatusIndicator state="halted">Stopped</StatusIndicator>
            </SpaceBetween>
            <Alert type="note" header="Maintenance on Sunday">
              The north annex is read-only from 02:00 to 03:00.
            </Alert>
          </SpaceBetween>
        </Figure>
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'marks',
  title: 'Marks',
  summary: 'The thirteen drawing marks, M1 to M13: what each one means and which components draw it.',
  order: 2,
  keywords: [
    'construction line',
    'hash mark',
    'dimension line',
    'margin',
    'crop marks',
    'key square',
    'leader',
    'reference',
    'plate',
    'ink fill',
    'position rule',
    'hatch',
    'offset',
  ],
  Page,
};

export default doc;
