// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import CopyToClipboard from '~components/copy-to-clipboard';
import Link from '~components/link';
import SegmentedControl from '~components/segmented-control';
import ToggleButton from '~components/toggle-button';

import { stayOnPage } from './samples';
import { Cell, Group, Readout, Row } from './specimen';

function ButtonDropdownSpecimen() {
  const [last, setLast] = useState<string | null>(null);
  return (
    <>
      <ButtonDropdown
        items={[
          { id: 'restart', text: 'Restart' },
          { id: 'scale', text: 'Change node count' },
          { id: 'delete', text: 'Delete', disabled: true, disabledReason: 'Stop the service first.' },
        ]}
        onItemClick={event => setLast(event.detail.id)}
      >
        Service actions
      </ButtonDropdown>
      <Readout>Last chosen: {last ?? 'nothing yet'}</Readout>
    </>
  );
}

function ButtonGroupSpecimen() {
  const [zoom, setZoom] = useState(100);
  const [grid, setGrid] = useState(true);
  const items: ButtonGroupProps.ItemOrGroup[] = [
    {
      type: 'group',
      text: 'Zoom',
      items: [
        { type: 'icon-button', id: 'zoom-out', text: 'Zoom out', iconName: 'zoom-out', disabled: zoom <= 25 },
        { type: 'icon-button', id: 'zoom-in', text: 'Zoom in', iconName: 'zoom-in', disabled: zoom >= 400 },
      ],
    },
    {
      type: 'icon-toggle-button',
      id: 'grid',
      text: 'Show grid',
      iconName: 'grid-view',
      pressedIconName: 'grid-view',
      pressed: grid,
    },
    { type: 'icon-button', id: 'copy', text: 'Copy link to sheet', iconName: 'copy', popoverFeedback: 'Link copied' },
  ];
  return (
    <>
      <ButtonGroup
        ariaLabel="Drawing tools"
        items={items}
        onItemClick={event => {
          const { id, pressed } = event.detail;
          if (id === 'zoom-in') {
            setZoom(current => current * 2);
          } else if (id === 'zoom-out') {
            setZoom(current => current / 2);
          } else if (id === 'grid') {
            setGrid(Boolean(pressed));
          }
        }}
      />
      <Readout>
        Plan at {zoom}%, grid {grid ? 'on' : 'off'}
      </Readout>
    </>
  );
}

function SegmentedControlSpecimen() {
  const [period, setPeriod] = useState('week');
  return (
    <SegmentedControl
      label="Bookings shown"
      selectedId={period}
      onChange={event => setPeriod(event.detail.selectedId)}
      options={[
        { id: 'day', text: 'Day' },
        { id: 'week', text: 'Week' },
        { id: 'month', text: 'Month' },
      ]}
    />
  );
}

function ToggleButtonSpecimen() {
  const [pinned, setPinned] = useState(false);
  const [favorite, setFavorite] = useState(true);
  return (
    <Row>
      <ToggleButton pressed={pinned} onChange={event => setPinned(event.detail.pressed)}>
        Pin to the board
      </ToggleButton>
      <ToggleButton
        variant="icon"
        iconName="star"
        pressedIconName="star-filled"
        ariaLabel="Favorite this bike"
        pressed={favorite}
        onChange={event => setFavorite(event.detail.pressed)}
      />
    </Row>
  );
}

export default function ActionsGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Actions">
      <Cell name="Button">
        <Row>
          <Button variant="primary">Book a repair</Button>
          <Button>See prices</Button>
          <Button variant="link">Not now</Button>
          <Button iconName="refresh" variant="icon" ariaLabel="Refresh the queue" />
          <Button loading={true} loadingText="Saving">
            Save
          </Button>
        </Row>
      </Cell>
      <Cell name="ButtonDropdown">
        <ButtonDropdownSpecimen />
      </Cell>
      <Cell name="ButtonGroup">
        <ButtonGroupSpecimen />
      </Cell>
      <Cell name="CopyToClipboard">
        <Row>
          <CopyToClipboard
            textToCopy="na-01-7f3c"
            variant="inline"
            copyButtonAriaLabel="Copy node ID"
            copySuccessText="Node ID copied"
          />
          <CopyToClipboard textToCopy="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5" copyButtonText="Copy public key" />
        </Row>
      </Cell>
      <Cell name="Link">
        <Row>
          <Link href="#prices" onFollow={stayOnPage}>
            Repair prices
          </Link>
          <Link href="https://example.com/guides" external={true}>
            Repair guides
          </Link>
          <Link variant="info" onFollow={stayOnPage}>
            Info
          </Link>
        </Row>
      </Cell>
      <Cell name="SegmentedControl">
        <SegmentedControlSpecimen />
      </Cell>
      <Cell name="ToggleButton">
        <ToggleButtonSpecimen />
      </Cell>
    </Group>
  );
}
