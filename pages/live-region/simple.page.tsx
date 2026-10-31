// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import FormField from '~components/form-field';
import Input from '~components/input';
import LiveRegion from '~components/live-region';
import StatusIndicator from '~components/status-indicator';

import styles from './styles.module.scss';

const nodes = Array.from({ length: 24 }, (_, index) => `north-annex-${String(index + 1).padStart(2, '0')}`);

export default function LiveRegionSimple() {
  const [filter, setFilter] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');

  const matches = nodes.filter(node => node.includes(filter.trim()));

  return (
    <article className={styles.page}>
      <h1>Live region</h1>

      <section className={styles.section}>
        <h2>Polite, visible</h2>
        <FormField label="Filter nodes">
          <Input value={filter} onChange={event => setFilter(event.detail.value)} />
        </FormField>
        <LiveRegion>
          {matches.length} {matches.length === 1 ? 'match' : 'matches'}
        </LiveRegion>
      </section>

      <section className={styles.section}>
        <h2>Inline status</h2>
        <div className={styles.row}>
          <Button formAction="none" onClick={() => setSaveState('saving')}>
            Start saving
          </Button>
          <Button formAction="none" onClick={() => setSaveState('saved')}>
            Finish
          </Button>
          <Button formAction="none" onClick={() => setSaveState('failed')}>
            Fail
          </Button>
        </div>
        <p>
          Draft:{' '}
          <LiveRegion tagName="span">
            {saveState === 'idle' && 'Not saved'}
            {saveState === 'saving' && <StatusIndicator type="loading">Saving</StatusIndicator>}
            {saveState === 'saved' && <StatusIndicator type="success">Saved</StatusIndicator>}
            {saveState === 'failed' && <StatusIndicator type="error">Save failed</StatusIndicator>}
          </LiveRegion>
        </p>
      </section>

      <section className={styles.section}>
        <h2>Assertive, hidden</h2>
        <p>Nothing is shown below. A screen reader announces the save result right away.</p>
        <LiveRegion assertive={true} hidden={true}>
          {saveState === 'failed' ? 'The draft could not be saved.' : ''}
        </LiveRegion>
      </section>
    </article>
  );
}
