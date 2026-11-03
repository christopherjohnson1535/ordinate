// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Dialog from '@ordinate/components/dialog';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function Inline() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('north-annex');
  const [draft, setDraft] = useState(name);

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <Box variant="strong">{name}</Box>
        <Button
          disabled={open}
          onClick={() => {
            setDraft(name);
            setOpen(true);
          }}
        >
          Rename project
        </Button>
      </SpaceBetween>
      {open && (
        <Dialog
          header="Rename project"
          onDismiss={() => setOpen(false)}
          footer={
            <>
              <Button variant="link" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setName(draft);
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </>
          }
        >
          <FormField label="Project name" description="Lowercase letters, digits and hyphens.">
            <Input value={draft} onChange={event => setDraft(event.detail.value)} />
          </FormField>
        </Dialog>
      )}
    </SpaceBetween>
  );
}
