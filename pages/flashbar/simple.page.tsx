// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import ProgressBar from '~components/progress-bar';

import styles from './styles.module.scss';

type SampleType = FlashbarProps.Type | 'underway';

const samples: Record<SampleType, { header: string; content: string }> = {
  fault: { header: 'Deployment failed', content: 'Two nodes did not respond within 30 seconds.' },
  caution: { header: 'Certificate expires soon', content: 'The certificate for api.north-annex expires in 6 days.' },
  complete: { header: 'Backup complete', content: 'All 12 nodes of north-annex were backed up in 4 minutes.' },
  note: { header: 'Maintenance window', content: 'Updates run on Sunday at 02:00 UTC.' },
  underway: { header: 'Creating instance', content: 'north-annex-13 is starting.' },
};

const types = Object.keys(samples) as SampleType[];

function toItem(type: SampleType): FlashbarProps.MessageDefinition {
  return type === 'underway' ? { type: 'note', loading: true, ...samples.underway } : { type, ...samples[type] };
}

let nextId = 0;

interface Entry {
  id: string;
  type: SampleType;
}

function makeItem(type: SampleType): Entry {
  return { id: `item-${nextId++}`, type };
}

function StackDemo() {
  const [entries, setEntries] = useState(() =>
    (['fault', 'caution', 'complete', 'underway', 'fault'] as const).map(type => makeItem(type))
  );
  const add = (type: SampleType) => setEntries(current => [makeItem(type), ...current]);
  const items: FlashbarProps.MessageDefinition[] = entries.map(({ id, type }) => ({
    id,
    ...toItem(type),
    dismissible: true,
    onDismiss: () => setEntries(current => current.filter(entry => entry.id !== id)),
  }));

  return (
    <>
      <div className={styles.row}>
        {types.map(type => (
          <Button key={type} formAction="none" onClick={() => add(type)}>
            Add {type}
          </Button>
        ))}
      </div>
      <Flashbar items={items} stackItems={true} />
    </>
  );
}

export default function FlashbarSimple() {
  const [progress, setProgress] = useState(40);
  const finished = progress >= 100;

  return (
    <article className={styles.page}>
      <h1>Flashbar</h1>

      <section className={styles.section}>
        <h2>Types</h2>
        <Flashbar items={types.map(toItem)} />
      </section>

      <section className={styles.section}>
        <h2>Actions, dismiss and header only</h2>
        <Flashbar
          items={[
            {
              type: 'fault',
              ...samples.fault,
              action: <Button formAction="none">Retry</Button>,
              dismissible: true,
              ariaRole: 'alert',
            },
            { type: 'complete', header: 'Changes saved', dismissible: true },
            { type: 'note', content: 'You are viewing revision 2026.1 of this project.' },
          ]}
        />
      </section>

      <section className={styles.section}>
        <h2>Loading and progress</h2>
        <div className={styles.row}>
          <Button formAction="none" onClick={() => setProgress(value => Math.min(100, value + 20))}>
            Advance
          </Button>
          <Button formAction="none" onClick={() => setProgress(0)}>
            Reset
          </Button>
        </div>
        <Flashbar
          items={[
            {
              id: 'upload',
              type: finished ? 'complete' : 'note',
              loading: !finished,
              header: finished ? 'Upload complete' : 'Uploading backup',
              content: (
                <ProgressBar
                  variant="flash"
                  value={progress}
                  label="north-annex.tar"
                  additionalInfo={finished ? undefined : 'About 2 minutes left'}
                  status={finished ? 'complete' : 'underway'}
                  resultText="Uploaded 4.2 GB"
                />
              ),
            },
          ]}
        />
      </section>

      <section className={styles.section}>
        <h2>Stacked</h2>
        <StackDemo />
      </section>

      <section className={styles.section}>
        <h2>Narrow, as in a margin column</h2>
        <div className={styles.narrow}>
          <Flashbar
            items={[
              {
                type: 'caution',
                header: 'Some nodes are running an old agent',
                content: 'Nodes north-annex-04, north-annex-07 and north-annex-11 are on agent 3.2.',
                action: <Button formAction="none">Update agents</Button>,
                dismissible: true,
              },
            ]}
          />
        </div>
      </section>
    </article>
  );
}
