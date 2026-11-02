// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Modal, { ModalProps } from '~components/modal';

import styles from './styles.module.scss';

type Example = 'default' | 'no-dismiss' | 'no-paddings' | 'top' | 'small' | 'large';

export default function ModalSimple() {
  const [open, setOpen] = useState<Example | null>(null);
  const [lastReason, setLastReason] = useState<ModalProps.DismissReason>();
  const [lines, setLines] = useState(3);

  const close = () => setOpen(null);
  const onDismiss: ModalProps['onDismiss'] = event => {
    setLastReason(event.detail.reason);
    close();
  };
  const deleteFooter = (
    <>
      <Button variant="link" formAction="none" onClick={close}>
        Cancel
      </Button>
      <Button variant="destructive" formAction="none" onClick={close}>
        Delete project
      </Button>
    </>
  );

  return (
    <article className={styles.page}>
      <h1>Modal</h1>
      <div className={styles.row}>
        <Button formAction="none" onClick={() => setOpen('default')}>
          Default
        </Button>
        <Button formAction="none" onClick={() => setOpen('no-dismiss')}>
          Without close button
        </Button>
        <Button formAction="none" onClick={() => setOpen('no-paddings')}>
          Without content padding
        </Button>
        <Button formAction="none" onClick={() => setOpen('top')}>
          Top, growing content
        </Button>
        <Button formAction="none" onClick={() => setOpen('small')}>
          Small
        </Button>
        <Button formAction="none" onClick={() => setOpen('large')}>
          Large
        </Button>
      </div>
      {lastReason && <p>Last dismissed by: {lastReason}</p>}

      <Modal visible={open === 'default'} header="Delete north-annex?" onDismiss={onDismiss} footer={deleteFooter}>
        This removes the project, its 12 nodes and all stored logs. You cannot undo this.
      </Modal>

      <Modal
        visible={open === 'no-dismiss'}
        header="Delete north-annex?"
        hideDismissButton={true}
        onDismiss={onDismiss}
        footer={deleteFooter}
      >
        There is no close button. Use Cancel, press Escape or click outside the modal.
      </Modal>

      <Modal
        visible={open === 'no-paddings'}
        header="Nodes"
        disableContentPaddings={true}
        onDismiss={onDismiss}
        footer={
          <Button variant="primary" formAction="none" onClick={close}>
            Done
          </Button>
        }
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Node</th>
              <th scope="col">Zone</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {['na-01', 'na-02', 'na-03'].map(node => (
              <tr key={node}>
                <td>{node}</td>
                <td>us-mountain-1a</td>
                <td>Running</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>

      <Modal
        visible={open === 'top'}
        header="Build log"
        position="top"
        onDismiss={onDismiss}
        footer={
          <>
            <Button formAction="none" onClick={() => setLines(Math.max(1, lines - 3))}>
              Fewer lines
            </Button>
            <Button formAction="none" iconName="add" onClick={() => setLines(lines + 3)}>
              More lines
            </Button>
          </>
        }
      >
        <p>The top edge stays put while the content grows or shrinks.</p>
        <ol>
          {Array.from({ length: lines }, (_, index) => (
            <li key={index}>Step {index + 1} finished.</li>
          ))}
        </ol>
      </Modal>

      <Modal visible={open === 'small'} size="small" header="Rename project" onDismiss={onDismiss}>
        A small modal for short questions.
      </Modal>

      <Modal visible={open === 'large'} size="large" header="Project settings" onDismiss={onDismiss}>
        A large modal for longer forms.
      </Modal>
    </article>
  );
}
