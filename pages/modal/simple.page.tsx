// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Modal, { ModalProps } from '~components/modal';

export default function ModalSimple() {
  const [visible, setVisible] = useState(false);
  const [lastReason, setLastReason] = useState<ModalProps.DismissReason>();

  return (
    <article>
      <h1>Modal</h1>
      <Button formAction="none" onClick={() => setVisible(true)}>
        Delete project
      </Button>
      {lastReason && <p>Last dismissed by: {lastReason}</p>}
      <Modal
        visible={visible}
        header="Delete north-annex?"
        onDismiss={event => {
          setLastReason(event.detail.reason);
          setVisible(false);
        }}
        footer={
          <>
            <Button variant="link" formAction="none" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button variant="destructive" formAction="none" onClick={() => setVisible(false)}>
              Delete project
            </Button>
          </>
        }
      >
        This removes the project, its 12 nodes and all stored logs. You cannot undo this.
      </Modal>
    </article>
  );
}
