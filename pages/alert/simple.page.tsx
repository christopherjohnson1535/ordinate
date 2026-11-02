// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Alert, { AlertProps } from '~components/alert';
import Button from '~components/button';

import styles from './styles.module.scss';

const types: AlertProps.Type[] = ['note', 'complete', 'caution', 'fault'];

const copy: Record<AlertProps.Type, { header: string; content: string }> = {
  note: { header: 'Maintenance window', content: 'Updates to north-annex run on Sunday at 02:00 UTC.' },
  complete: { header: 'Backup complete', content: 'All 12 nodes were backed up in 4 minutes.' },
  caution: { header: 'Certificate expires soon', content: 'The certificate for api.north-annex expires in 6 days.' },
  fault: { header: 'Deployment failed', content: 'Two nodes did not respond within 30 seconds.' },
};

export default function AlertSimple() {
  const [dismissed, setDismissed] = useState<AlertProps.Type[]>([]);
  const focusRef = useRef<AlertProps.Ref>(null);

  return (
    <article className={styles.page}>
      <h1>Alert</h1>

      <section className={styles.section}>
        <h2>Types</h2>
        {types.map(type => (
          <Alert key={type} type={type} header={copy[type].header}>
            {copy[type].content}
          </Alert>
        ))}
      </section>

      <section className={styles.section}>
        <h2>Header only and content only</h2>
        <Alert type="complete" header="Changes saved" />
        <Alert type="note">You are viewing the 2026.1 revision of this project.</Alert>
      </section>

      <section className={styles.section}>
        <h2>Action and dismiss</h2>
        <div className={styles.row}>
          <Button formAction="none" onClick={() => setDismissed([])}>
            Show all
          </Button>
          <Button formAction="none" onClick={() => focusRef.current?.focus()}>
            Focus the fault
          </Button>
        </div>
        {types
          .filter(type => !dismissed.includes(type))
          .map(type => (
            <Alert
              key={type}
              ref={type === 'fault' ? focusRef : undefined}
              type={type}
              header={copy[type].header}
              statusIconAriaLabel={type}
              dismissible={true}
              onDismiss={() => setDismissed(current => [...current, type])}
              action={type === 'fault' || type === 'caution' ? <Button formAction="none">Retry</Button> : undefined}
            >
              {copy[type].content}
            </Alert>
          ))}
      </section>

      <section className={styles.section}>
        <h2>Long content</h2>
        <div className={styles.narrow}>
          <Alert
            type="caution"
            header="Some nodes are running an old agent"
            dismissible={true}
            action={<Button formAction="none">Update agents</Button>}
          >
            Nodes north-annex-04, north-annex-07 and north-annex-11 are on agent 3.2. Version 3.2 stops receiving
            security fixes at the end of the month.
          </Alert>
        </div>
      </section>
    </article>
  );
}
