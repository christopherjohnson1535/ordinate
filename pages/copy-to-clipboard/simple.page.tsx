// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CopyToClipboard from '~components/copy-to-clipboard';
import KeyValuePairs from '~components/key-value-pairs';

import styles from './styles.module.scss';

const nodeId = 'node-7f3a-91c2-4be0';
const key = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG8x2mQe9u7Lr0pV4kBd3sYwq';

export default function CopyToClipboardSimple() {
  return (
    <article className={styles.page}>
      <h1>Copy to clipboard</h1>

      <section className={styles.section}>
        <h2>Variants</h2>
        <div className={styles.row}>
          <CopyToClipboard textToCopy={nodeId} />
          <CopyToClipboard textToCopy={nodeId} variant="icon" copyButtonAriaLabel="Copy node ID" />
          <CopyToClipboard textToCopy={nodeId} variant="inline" copyButtonAriaLabel="Copy node ID" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Custom texts</h2>
        <div className={styles.row}>
          <CopyToClipboard textToCopy={key} copyButtonText="Copy public key" copySuccessText="Public key copied" />
          <CopyToClipboard
            textToCopy={key}
            variant="inline"
            textToDisplay="ssh-ed25519 AAAAC3…Ywq"
            copyButtonAriaLabel="Copy public key"
            copySuccessText="Public key copied"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Disabled</h2>
        <div className={styles.row}>
          <CopyToClipboard textToCopy={nodeId} disabled={true} />
          <CopyToClipboard textToCopy={nodeId} disabled={true} disabledReason="You need read access to copy this ID." />
          <CopyToClipboard
            textToCopy={nodeId}
            variant="icon"
            disabled={true}
            disabledReason="You need read access to copy this ID."
          />
          <CopyToClipboard textToCopy={nodeId} variant="inline" disabled={true} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>In running text</h2>
        <p>
          The node <CopyToClipboard textToCopy={nodeId} variant="inline" copyButtonAriaLabel="Copy node ID" /> joined
          the north annex cluster this morning.
        </p>
      </section>

      <section className={styles.section}>
        <h2>In key-value pairs</h2>
        <KeyValuePairs
          columns={2}
          items={[
            {
              label: 'Node ID',
              value: <CopyToClipboard textToCopy={nodeId} variant="inline" copyButtonAriaLabel="Copy node ID" />,
            },
            {
              label: 'Public key',
              value: (
                <CopyToClipboard
                  textToCopy={key}
                  variant="inline"
                  textToDisplay="ssh-ed25519 AAAAC3…Ywq"
                  copyButtonAriaLabel="Copy public key"
                />
              ),
            },
          ]}
        />
      </section>

      <section className={styles.section}>
        <h2>In a container that clips overflow</h2>
        <div className={styles.clipped}>
          <CopyToClipboard textToCopy={nodeId} variant="icon" copyButtonAriaLabel="Copy (clipped)" />
          <CopyToClipboard
            textToCopy={nodeId}
            variant="icon"
            copyButtonAriaLabel="Copy (portal)"
            popoverRenderWithPortal={true}
          />
        </div>
      </section>
    </article>
  );
}
