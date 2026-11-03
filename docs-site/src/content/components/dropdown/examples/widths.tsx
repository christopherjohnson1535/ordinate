// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Dropdown, { DropdownProps } from '@ordinate/components/dropdown';
import SpaceBetween from '@ordinate/components/space-between';

function NoteDropdown({ label, maxWidth }: { label: string; maxWidth: DropdownProps.MaxWidth }) {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown
      open={open}
      maxWidth={maxWidth}
      ariaLabel={`${label} note`}
      onOutsideClick={() => setOpen(false)}
      onEscape={() => setOpen(false)}
      trigger={
        <Button iconName="chevron-down" iconAlign="right" ariaExpanded={open} onClick={() => setOpen(!open)}>
          {label}
        </Button>
      }
      content={
        <Box padding="s">
          Nodes in this project restart one zone at a time during the weekly maintenance window, so at least three zones
          keep serving traffic.
        </Box>
      }
    />
  );
}

export default function Widths() {
  return (
    <SpaceBetween direction="horizontal" size="s">
      <NoteDropdown label="Small" maxWidth="small" />
      <NoteDropdown label="Medium" maxWidth="medium" />
      <NoteDropdown label="Large" maxWidth="large" />
    </SpaceBetween>
  );
}
