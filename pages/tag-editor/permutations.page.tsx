// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TagEditor, { TagEditorProps } from '~components/tag-editor';

import styles from '../attribute-editor/styles.module.scss';

const knownValues: Record<string, string[]> = {
  team: ['platform', 'payments', 'data', 'search'],
  stage: ['alpha', 'beta', 'gamma', 'prod'],
  'cost-center': ['4410', '4420', '5100'],
  owner: ['ops@example.com', 'sre@example.com'],
};

const delay = <T,>(value: T, ms = 400) => new Promise<T>(resolve => setTimeout(() => resolve(value), ms));

const keysRequest = (key: string) => delay(Object.keys(knownValues).filter(known => known.includes(key)));
const valuesRequest = (key: string, value: string) =>
  delay((knownValues[key] ?? []).filter(known => known.includes(value)));

function Editor({ initial, ...rest }: Partial<TagEditorProps> & { initial: TagEditorProps.Tag[] }) {
  const [tags, setTags] = useState(initial);
  const [valid, setValid] = useState<boolean | null>(null);
  return (
    <div className={styles.section}>
      <TagEditor
        {...rest}
        tags={tags}
        onChange={event => {
          setTags(event.detail.tags);
          setValid(event.detail.valid);
        }}
        keysRequest={keysRequest}
        valuesRequest={valuesRequest}
      />
      {valid !== null && <small>{valid ? 'Ready to save.' : 'Fix the tags before saving.'}</small>}
    </div>
  );
}

export default function TagEditorPermutations() {
  return (
    <article className={styles.page}>
      <h1>Tag editor</h1>
      <section className={styles.section}>
        <h2>Existing and new tags, limit of 6</h2>
        <Editor
          tagLimit={6}
          initial={[
            { key: 'team', value: 'platform', existing: true },
            { key: 'cost-center', value: '4410', existing: true, markedForRemoval: true },
            { key: 'stage', value: 'beta', existing: false },
            { key: 'stage', value: '', existing: false },
            { key: 'owner#', value: 'ops@example.com', existing: false },
          ]}
        />
      </section>
      <div className={styles.columns}>
        <section className={styles.section}>
          <h2>Over the limit</h2>
          <Editor
            tagLimit={2}
            initial={[
              { key: 'team', value: 'data', existing: true },
              { key: 'stage', value: 'prod', existing: true },
              { key: 'owner', value: '', existing: false },
            ]}
          />
        </section>
        <section className={styles.section}>
          <h2>Narrow container</h2>
          <div className={styles.narrow}>
            <Editor initial={[{ key: 'team', value: 'search', existing: true }]} />
          </div>
        </section>
        <section className={styles.section}>
          <h2>No tags</h2>
          <Editor initial={[]} />
        </section>
        <section className={styles.section}>
          <h2>Loading</h2>
          <Editor initial={[]} loading={true} />
        </section>
      </div>
    </article>
  );
}
