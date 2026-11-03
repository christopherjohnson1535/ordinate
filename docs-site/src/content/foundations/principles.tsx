// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '@ordinate/components/badge';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Checkbox from '@ordinate/components/checkbox';
import ColumnLayout from '@ordinate/components/column-layout';
import Container from '@ordinate/components/container';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import Modal from '@ordinate/components/modal';
import Pagination from '@ordinate/components/pagination';
import RadioGroup from '@ordinate/components/radio-group';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';
import Tabs from '@ordinate/components/tabs';
import Toggle from '@ordinate/components/toggle';

import { href } from '../../app/router';
import { DocSection, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { Figure, Split } from './shared/figure';

import styles from './principles.module.scss';

const principles = [
  ['p1', 'P1', 'Familiar first', 'Controls keep their recognizable shape. The drawing goes around them.'],
  ['p2', 'P2', 'Paper and ink', 'Words, values and actions in ink. Gray for help and for what is unavailable.'],
  ['p3', 'P3', 'Lines before boxes', 'Group with construction lines and space. Only lifted things get a box.'],
  ['p4', 'P4', 'One mark, one meaning', 'Each mark says one thing, everywhere it appears.'],
  ['p5', 'P5', 'Color means something', 'Kind colors say what a section holds; status colors say how it is.'],
  ['p6', 'P6', 'Soft and spacious', 'Hairlines and generous gaps. Weight only for what is chosen, on or current.'],
] as const;

function FamiliarControls() {
  const [name, setName] = useState('north-annex-web');
  const [zone, setZone] = useState('a');
  const [public_, setPublic] = useState(false);
  const [logs, setLogs] = useState(true);
  return (
    <SpaceBetween size="m">
      <FormField label="Service name" description="Lowercase letters, numbers and hyphens.">
        <Input value={name} onChange={event => setName(event.detail.value)} />
      </FormField>
      <FormField label="Zone">
        <RadioGroup
          value={zone}
          onChange={event => setZone(event.detail.value)}
          direction="horizontal"
          items={[
            { value: 'a', label: 'us-mountain-1a' },
            { value: 'b', label: 'us-mountain-1b' },
          ]}
        />
      </FormField>
      <FormField label="Access">
        <SpaceBetween size="xs">
          <Toggle checked={public_} onChange={event => setPublic(event.detail.checked)}>
            Public endpoint
          </Toggle>
          <Checkbox checked={logs} onChange={event => setLogs(event.detail.checked)}>
            Keep request logs
          </Checkbox>
        </SpaceBetween>
      </FormField>
    </SpaceBetween>
  );
}

function PaperAndInk() {
  return (
    <SpaceBetween size="l">
      <KeyValuePairs
        columns={2}
        items={[
          { label: 'Image', value: 'web:v2' },
          { label: 'Nodes', value: '8 of 12' },
          { label: 'Owner', value: 'Dana Ruiz' },
          { label: 'Region', value: 'us-mountain-1' },
        ]}
      />
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <Button variant="primary">Deploy</Button>
        <Button disabled={true}>Roll back</Button>
        <Box color="text-body-secondary" fontSize="body-s">
          Nothing to roll back to yet.
        </Box>
      </SpaceBetween>
    </SpaceBetween>
  );
}

function LinesBeforeBoxes() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Container
        kind="resource"
        reference="R1"
        heading="vault-store"
        description="Object storage for the north annex."
        measure="2 nodes"
        actions={<Button onClick={() => setOpen(true)}>Resize</Button>}
      >
        Grouped by a construction line and the margin. Nothing here is lifted, so nothing has a box.
      </Container>
      <Modal
        visible={open}
        onDismiss={() => setOpen(false)}
        kind="resource"
        reference="R1"
        header="Resize vault-store"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Resize
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        A modal is lifted off the drawing for a moment, so it is a plate: a hairline ink edge and a hard 4 px offset,
        over a paper veil.
      </Modal>
    </>
  );
}

function OneMark() {
  const [range, setRange] = useState('week');
  const [page, setPage] = useState(3);
  const [tab, setTab] = useState('services');
  return (
    <SpaceBetween size="l">
      <Tabs
        activeTabId={tab}
        onChange={event => setTab(event.detail.activeTabId)}
        ariaLabel="North annex"
        tabs={[
          { id: 'services', label: 'Services' },
          { id: 'deployments', label: 'Deployments' },
          { id: 'logs', label: 'Logs' },
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
      <Pagination
        currentPageIndex={page}
        pagesCount={12}
        onChange={event => setPage(event.detail.currentPageIndex)}
        ariaLabels={{ pageLabel: number => `Page ${number}` }}
      />
    </SpaceBetween>
  );
}

function ColorMeans() {
  return (
    <SpaceBetween size="l">
      <ColumnLayout columns={3} minColumnWidth={140}>
        <Container kind="configuration" reference="C1" heading="Settings" />
        <Container kind="resource" reference="R1" heading="Nodes" />
        <Container kind="policy" reference="P1" heading="Retention" />
      </ColumnLayout>
      <SpaceBetween direction="horizontal" size="l">
        <StatusIndicator state="complete">Running</StatusIndicator>
        <StatusIndicator state="caution">1 alarm</StatusIndicator>
        <StatusIndicator state="fault">Failed</StatusIndicator>
        <Badge tone="note">Standard</Badge>
      </SpaceBetween>
    </SpaceBetween>
  );
}

function SoftAndSpacious() {
  const [on, setOn] = useState(true);
  const [chosen, setChosen] = useState('weekly');
  return (
    <SpaceBetween size="xl">
      <Toggle checked={on} onChange={event => setOn(event.detail.checked)}>
        Nightly snapshots
      </Toggle>
      <SegmentedControl
        label="Schedule"
        selectedId={chosen}
        onChange={event => setChosen(event.detail.selectedId)}
        options={[
          { id: 'daily', text: 'Daily' },
          { id: 'weekly', text: 'Weekly' },
          { id: 'monthly', text: 'Monthly' },
        ]}
      />
    </SpaceBetween>
  );
}

const illustrations: Record<string, { body: React.ReactNode; caption: string; text: React.ReactNode }> = {
  p1: {
    body: <FamiliarControls />,
    caption: 'A text field, radio buttons, a toggle and a checkbox, each in its usual shape.',
    text: (
      <>
        <p>
          A checkbox is still a square with a tick, a radio button a ring with a dot, a field a box you type into.
          People should never have to learn a control to use it.
        </p>
        <p>
          The drawing goes around the controls instead: the label column against a construction line, the ink baseline
          under a field, crop marks around a chosen segment.
        </p>
      </>
    ),
  },
  p2: {
    body: <PaperAndInk />,
    caption: 'Values and the main action in ink; the reason a button is unavailable in gray, in words.',
    text: (
      <>
        <p>
          The sheet is white, or chalk on dark paper in dark mode. Everything a person reads for its meaning or acts on
          is in ink: values, headings, links, buttons.
        </p>
        <p>
          Gray is kept for help text, labels that sit beside a value and things that cannot be used now. A disabled
          button is hatched as well as dimmed, and its reason is written next to it.
        </p>
      </>
    ),
  },
  p3: {
    body: <LinesBeforeBoxes />,
    caption: 'Open Resize: the section is lines and margin; the modal is a plate.',
    text: (
      <>
        <p>
          Sections are grouped by a construction line along the top and a margin for the heading, never by a box drawn
          around them. Cards are held by crop marks at their corners.
        </p>
        <p>
          A box means the thing is lifted off the drawing for a while: a modal, a popover, a menu. That box is a plate,
          with its own offset.
        </p>
      </>
    ),
  },
  p4: {
    body: <OneMark />,
    caption: 'Tabs, a segmented control and pagination share one mark: crop marks around the chosen one.',
    text: (
      <>
        <p>
          Every mark in the drawing has one meaning, and keeps it in every component. Crop marks always mean "one of a
          set". A leader always goes somewhere else. An ink fill always means "on".
        </p>
        <p>
          So once someone has read a mark in one place, they can read it everywhere. See{' '}
          <a href={href('/foundations/marks')}>Marks</a> for all thirteen.
        </p>
      </>
    ),
  },
  p5: {
    body: <ColorMeans />,
    caption: 'Kind colors on the construction lines and references; status colors on the marks only.',
    text: (
      <>
        <p>
          A section&apos;s kind color says what it holds: configuration in blue, resources in teal, policy in plum.
          Status colors say how something is. Nothing is colored for decoration.
        </p>
        <p>
          Color goes on marks and keys, never on whole surfaces, and never alone: a reference letter, an icon shape or a
          word always says the same thing. See <a href={href('/foundations/color')}>Color</a>.
        </p>
      </>
    ),
  },
  p6: {
    body: <SoftAndSpacious />,
    caption: 'The toggle is on, so it is filled with ink; the chosen segment takes heavier marks.',
    text: (
      <>
        <p>
          Lines are hairlines. Space does most of the grouping, and gaps are generous so a dense console still reads
          calmly.
        </p>
        <p>
          Heavy weight is saved for what is chosen, on or current: the ink of an enabled toggle, the closed marks of a
          chosen card, the position rule beside the page you are on.
        </p>
      </>
    ),
  },
};

function Page() {
  return (
    <>
      <Prose>
        <p>
          Six principles decide how every part of Ordinate is drawn. They are in order: when two of them pull apart, the
          earlier one wins. A control stays familiar (P1) even if a purer drawing would make it look like a diagram.
        </p>
      </Prose>

      <div>
        <p className={styles.order}>Earlier wins</p>
        <ol className={styles.scale} aria-label="The principles in order">
          {principles.map(([id, code, name, rule]) => (
            <li key={id} className={styles.step}>
              <a className={styles['step-link']} href={href('/foundations/principles', id)}>
                <span className={styles['step-code']}>{code}</span>
                <span className={styles['step-name']}>{name}</span>
                <span className={styles['step-rule']}>{rule}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      {principles.map(([id, code, name], index) => {
        const illustration = illustrations[id];
        return (
          <DocSection key={id} id={id} number={index + 1} title={`${code} ${name}`}>
            <Split text={illustration.text}>
              <Figure code={code} caption={illustration.caption}>
                {illustration.body}
              </Figure>
            </Split>
          </DocSection>
        );
      })}
    </>
  );
}

const doc: GuideDoc = {
  slug: 'principles',
  title: 'Principles',
  summary: 'The six rules, in order, that decide how every part of Ordinate is drawn.',
  order: 1,
  keywords: ['design language', 'DL-1', 'paper and ink', 'lines before boxes', 'familiar first'],
  Page,
};

export default doc;
