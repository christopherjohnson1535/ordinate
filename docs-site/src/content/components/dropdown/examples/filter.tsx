// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Box from '@ordinate/components/box';
import Button, { ButtonProps } from '@ordinate/components/button';
import Checkbox from '@ordinate/components/checkbox';
import Dropdown from '@ordinate/components/dropdown';
import SpaceBetween from '@ordinate/components/space-between';

const zones = ['us-mountain-1a', 'us-mountain-1b', 'us-mountain-1c', 'us-coast-2a'];

export default function Filter() {
  const triggerRef = useRef<ButtonProps.Ref>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(['us-mountain-1a']);
  const [applied, setApplied] = useState<string[]>(['us-mountain-1a']);

  const toggle = () => {
    setDraft(applied);
    setOpen(current => !current);
  };

  return (
    <SpaceBetween size="m">
      <Dropdown
        open={open}
        ariaRole="dialog"
        ariaLabel="Filter by zone"
        minWidth="medium"
        onOutsideClick={() => setOpen(false)}
        onEscape={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        trigger={
          <Button ref={triggerRef} iconName="filter" ariaExpanded={open} ariaHaspopup="dialog" onClick={toggle}>
            Zones
          </Button>
        }
        header={
          <Box padding="s" variant="strong">
            Zones
          </Box>
        }
        content={
          <Box padding="s">
            <SpaceBetween size="xs">
              {zones.map(zone => (
                <Checkbox
                  key={zone}
                  checked={draft.includes(zone)}
                  onChange={event =>
                    setDraft(current =>
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
          <Box padding="s" float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setDraft([])}>
                Clear
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setApplied(draft);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </SpaceBetween>
          </Box>
        }
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Showing nodes in {applied.length ? applied.join(', ') : 'no zones'}.
      </Box>
    </SpaceBetween>
  );
}
