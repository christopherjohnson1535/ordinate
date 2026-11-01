// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Dialog, { DialogProps } from '~components/dialog';
import FormField from '~components/form-field';
import Input from '~components/input';

import styles from './styles.module.scss';

export default function DialogSimple() {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('north-annex');
  const [lastReason, setLastReason] = useState<DialogProps.DismissReason>();

  const onDismiss: DialogProps['onDismiss'] = event => {
    setLastReason(event.detail.reason);
    setOpen(false);
  };

  return (
    <article className={styles.page}>
      <h1>Dialog</h1>

      <section className={styles.section}>
        <h2>Inline, next to the content it belongs to</h2>
        <div className={styles.row}>
          <Button formAction="none" onClick={() => setOpen(true)} disabled={open}>
            Rename project
          </Button>
          {lastReason && <span>Last dismissed by: {lastReason}</span>}
        </div>
        {open && (
          <Dialog
            header="Rename project"
            onDismiss={onDismiss}
            footer={
              <>
                <Button variant="link" formAction="none" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" formAction="none" onClick={() => setOpen(false)}>
                  Save
                </Button>
              </>
            }
          >
            <FormField label="Project name" description="Lowercase letters, digits and hyphens.">
              <Input value={name} onChange={event => setName(event.detail.value)} />
            </FormField>
          </Dialog>
        )}
      </section>

      <section className={styles.section}>
        <h2>Without a header or footer</h2>
        <Dialog ariaLabel="Tip">The tip moves focus to itself when it appears, and Escape closes it.</Dialog>
      </section>

      <section className={styles.panel}>
        <h2>In a side panel</h2>
        <Dialog header="Node na-03 restarted" footer={<Button formAction="none">View log</Button>}>
          The node restarted at 14:02 after a kernel update. All jobs resumed.
        </Dialog>
      </section>
    </article>
  );
}
