// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import Modal from '@ordinate/components/modal';
import SpaceBetween from '@ordinate/components/space-between';

export default function Form() {
  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState('Sun 02:00');
  const [draft, setDraft] = useState(start);

  const open = () => {
    setDraft(start);
    setVisible(true);
  };

  return (
    <SpaceBetween size="m" alignItems="center">
      <Button onClick={open}>Edit maintenance window</Button>
      <Box color="text-body-secondary" fontSize="body-s">
        Maintenance starts {start}, us-mountain-1 time.
      </Box>
      <Modal
        visible={visible}
        kind="configuration"
        reference="C2"
        header="Maintenance window"
        onDismiss={() => setVisible(false)}
        footer={
          <>
            <Button variant="link" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setStart(draft);
                setVisible(false);
              }}
            >
              Save window
            </Button>
          </>
        }
      >
        <FormField label="Start" description="Nodes restart one zone at a time from this hour, for up to two hours.">
          <Input value={draft} onChange={event => setDraft(event.detail.value)} />
        </FormField>
      </Modal>
    </SpaceBetween>
  );
}
