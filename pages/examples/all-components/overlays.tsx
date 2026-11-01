// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import Dialog from '~components/dialog';
import Dropdown from '~components/dropdown';
import FormField from '~components/form-field';
import Input from '~components/input';
import Link from '~components/link';
import Modal from '~components/modal';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import Tooltip from '~components/tooltip';

import { stayOnPage } from './samples';
import { Cell, Group, Readout, Row } from './specimen';

function DialogSpecimen() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('north-annex');
  return (
    <SpaceBetween size="s">
      <Button onClick={() => setOpen(true)} disabled={open}>
        Rename project
      </Button>
      {open && (
        <Dialog
          header="Rename project"
          onDismiss={() => setOpen(false)}
          footer={
            <>
              <Button variant="link" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Save
              </Button>
            </>
          }
        >
          <FormField label="New project name" description="Lowercase letters, digits and hyphens.">
            <Input value={name} onChange={event => setName(event.detail.value)} />
          </FormField>
        </Dialog>
      )}
    </SpaceBetween>
  );
}

const zones = ['us-mountain-1a', 'us-mountain-1b', 'us-coast-2a'];

function DropdownSpecimen() {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>(['us-mountain-1a']);
  const close = () => setOpen(false);
  return (
    <>
      <Dropdown
        open={open}
        ariaRole="dialog"
        ariaLabel="Filter by zone"
        onOutsideClick={close}
        onEscape={close}
        trigger={
          <Button iconName="filter" ariaExpanded={open} ariaHaspopup="dialog" onClick={() => setOpen(!open)}>
            Zones
          </Button>
        }
        content={
          <Box padding="s">
            <SpaceBetween size="xs">
              {zones.map(zone => (
                <Checkbox
                  key={zone}
                  checked={checked.includes(zone)}
                  onChange={event =>
                    setChecked(current =>
                      event.detail.checked ? [...current, zone] : current.filter(item => item !== zone)
                    )
                  }
                >
                  {zone}
                </Checkbox>
              ))}
            </SpaceBetween>
          </Box>
        }
        footer={
          <Box padding="s">
            <Button variant="primary" onClick={close}>
              Apply
            </Button>
          </Box>
        }
      />
      <Readout>Showing {checked.join(', ') || 'no zones'}</Readout>
    </>
  );
}

function ModalSpecimen() {
  const [visible, setVisible] = useState(false);
  const [restarted, setRestarted] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>Restart vault-store</Button>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        header="Restart vault-store?"
        footer={
          <>
            <Button variant="link" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setRestarted(true);
                setVisible(false);
              }}
            >
              Restart
            </Button>
          </>
        }
      >
        Both nodes restart one at a time. Requests go to the other node while each one restarts.
      </Modal>
      {restarted && <Readout>vault-store is restarting.</Readout>}
    </>
  );
}

export default function OverlaysGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Overlays">
      <Cell name="Dialog" note="Opens in place, next to what it belongs to.">
        <DialogSpecimen />
      </Cell>
      <Cell name="Dropdown">
        <DropdownSpecimen />
      </Cell>
      <Cell name="Modal">
        <ModalSpecimen />
      </Cell>
      <Cell name="Popover">
        <Box>
          North Annex uses{' '}
          <Popover
            header="Memory"
            content={
              <>
                512 MiB of 2 GiB in use across 12 nodes.{' '}
                <Link href="#memory" onFollow={stayOnPage}>
                  Change limits
                </Link>
              </>
            }
          >
            512 MiB of memory
          </Popover>{' '}
          today.
        </Box>
      </Cell>
      <Cell name="Tooltip">
        <Row>
          <Tooltip content="Copy the node ID">
            <Button variant="icon" iconName="copy" ariaLabel="Copy" />
          </Tooltip>
          <Tooltip content="Remove this node. Running jobs move to other nodes first.">
            <Button variant="icon" iconName="close" ariaLabel="Remove" />
          </Tooltip>
          <span>Availability:</span>
          <Tooltip content="Three of four zones">
            <Box variant="strong">75%</Box>
          </Tooltip>
        </Row>
      </Cell>
    </Group>
  );
}
