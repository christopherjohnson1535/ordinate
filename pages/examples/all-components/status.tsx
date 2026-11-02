// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '~components/alert';
import Badge from '~components/badge';
import Box from '~components/box';
import Button from '~components/button';
import ErrorBoundary from '~components/error-boundary';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import LiveRegion from '~components/live-region';
import Measure from '~components/measure';
import ProgressBar from '~components/progress-bar';
import Skeleton from '~components/skeleton';
import SpaceBetween from '~components/space-between';
import Spinner from '~components/spinner';
import Stamp from '~components/stamp';
import StatusIndicator from '~components/status-indicator';

import { Cell, Group, Row } from './specimen';

function AlertSpecimen() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Alert
      type="caution"
      header="Brake pads on order"
      dismissible={true}
      onDismiss={() => setVisible(false)}
      action={<Button>Notify me</Button>}
    >
      Shimano B05S pads arrive on Thursday. Disc brake jobs booked before then may wait a day.
    </Alert>
  ) : (
    <Button onClick={() => setVisible(true)}>Show the alert again</Button>
  );
}

// Only the button breaks it, so the page loads without an error in the console.
function Ticket({ broken }: { broken: boolean }) {
  if (broken) {
    throw new Error('The ticket could not be read.');
  }
  return <Box>Ticket 2041: town bike, rear brake, ready at 16:00.</Box>;
}

function ErrorBoundarySpecimen() {
  const [broken, setBroken] = useState(false);
  const [attempt, setAttempt] = useState(0);
  return (
    <SpaceBetween size="s">
      <ErrorBoundary key={attempt} feedbackHref="#feedback">
        <Ticket broken={broken} />
      </ErrorBoundary>
      <Button
        onClick={() => {
          setAttempt(current => current + 1);
          setBroken(current => !current);
        }}
      >
        {broken ? 'Mend the ticket' : 'Break the ticket'}
      </Button>
    </SpaceBetween>
  );
}

function FlashbarSpecimen() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const messages: FlashbarProps.MessageDefinition[] = [
    {
      id: 'vault-store',
      type: 'error',
      header: 'vault-store failed its health check.',
      content: 'Check the logs before you redeploy it.',
      dismissible: true,
      onDismiss: () => setDismissed(current => [...current, 'vault-store']),
    },
    {
      id: 'web-v2',
      type: 'in-progress',
      loading: true,
      content: 'web:v2 is rolling out to gallery-east.',
    },
  ];
  return (
    <SpaceBetween size="xs">
      <Flashbar items={messages.filter(message => !dismissed.includes(message.id!))} />
      {dismissed.length > 0 && <Button onClick={() => setDismissed([])}>Show the notes again</Button>}
    </SpaceBetween>
  );
}

function LiveRegionSpecimen() {
  const [queue, setQueue] = useState(7);
  return (
    <SpaceBetween size="xs">
      <Button onClick={() => setQueue(current => current + 1)}>Add a bike to the queue</Button>
      <LiveRegion>
        <Box>{queue} bikes in the queue.</Box>
      </LiveRegion>
    </SpaceBetween>
  );
}

export default function StatusGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Status and feedback">
      <Cell name="Alert">
        <AlertSpecimen />
      </Cell>
      <Cell name="Badge">
        <Row>
          <Badge>Draft</Badge>
          <Badge tone="note">New</Badge>
          <Badge tone="complete">Ready</Badge>
          <Badge tone="fault">Overdue</Badge>
          <Badge tone="high">High</Badge>
        </Row>
      </Cell>
      <Cell name="ErrorBoundary" note="Break the ticket to see the fallback.">
        <ErrorBoundarySpecimen />
      </Cell>
      <Cell name="Flashbar">
        <FlashbarSpecimen />
      </Cell>
      <Cell name="LiveRegion" note="Screen readers announce the new count.">
        <LiveRegionSpecimen />
      </Cell>
      <Cell name="Measure">
        <Measure
          label="Slowest 5% of requests"
          value={182}
          unit="ms"
          max={250}
          limit={200}
          limitLabel="target 200 ms"
        />
      </Cell>
      <Cell name="ProgressBar">
        <ProgressBar value={60} label="web:v2 is rolling out" additionalInfo="3 of 5 replicas are ready." />
      </Cell>
      <Cell name="Skeleton">
        <Skeleton variant="text" lines={3} loadingText="Loading the repair history" />
      </Cell>
      <Cell name="Spinner">
        <Row>
          <Spinner />
          <span>Checking parts in stock</span>
        </Row>
      </Cell>
      <Cell name="Stamp">
        <Row>
          <Stamp type="success">Approved</Stamp>
          <Stamp type="draft" size="small">
            Draft
          </Stamp>
          <Stamp type="error" size="small" rotation="none">
            Failed
          </Stamp>
        </Row>
      </Cell>
      <Cell name="StatusIndicator">
        <SpaceBetween size="xxs">
          <StatusIndicator state="complete">Running</StatusIndicator>
          <StatusIndicator state="underway">Starting</StatusIndicator>
          <StatusIndicator state="caution">Expiring in 3 days</StatusIndicator>
          <StatusIndicator state="fault">Failed</StatusIndicator>
          <StatusIndicator state="halted">Stopped</StatusIndicator>
        </SpaceBetween>
      </Cell>
    </Group>
  );
}
