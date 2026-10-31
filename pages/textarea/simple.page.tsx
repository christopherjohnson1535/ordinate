// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import Textarea from '~components/textarea';

import styles from '../form-controls.module.scss';

const limit = 200;

export default function TextareaSimple() {
  const [notes, setNotes] = useState('Rotate the access keys every month.');
  const [summary, setSummary] = useState('');
  const [script, setScript] = useState('#!/bin/sh\necho "starting"');
  const [lastKey, setLastKey] = useState('');

  return (
    <article className={styles.page}>
      <h1>Textarea</h1>
      <form className={styles.form} onSubmit={event => event.preventDefault()}>
        <FormField
          label="Notes"
          description="Shown to everyone on the project."
          constraintText={`${notes.length} of ${limit} characters.`}
          errorText={notes.length > limit ? `Shorten the notes to ${limit} characters or fewer.` : undefined}
        >
          <Textarea value={notes} onChange={event => setNotes(event.detail.value)} />
        </FormField>
        <FormField label="Change summary" errorText={summary ? undefined : 'Enter a summary.'}>
          <Textarea
            value={summary}
            placeholder="What changed and why"
            onChange={event => setSummary(event.detail.value)}
          />
        </FormField>
        <FormField
          label="Startup script"
          description="Press Ctrl+Enter to save."
          constraintText={lastKey && `Last shortcut: ${lastKey}`}
        >
          <Textarea
            value={script}
            rows={6}
            spellcheck={false}
            disableBrowserAutocorrect={true}
            onChange={event => setScript(event.detail.value)}
            onKeyDown={event => {
              if (event.detail.key === 'Enter' && event.detail.ctrlKey) {
                event.preventDefault();
                setLastKey('Ctrl+Enter');
              }
            }}
          />
        </FormField>
        <FormField label="Reviewer comment" constraintText="Unusually long for a comment.">
          <Textarea value="This looks fine, but check the retry limit." warning={true} resize="none" />
        </FormField>
        <FormField label="Audit log" description="Written by the system.">
          <Textarea value="Created by ops on 2026-10-31." readOnly={true} />
        </FormField>
        <FormField label="Billing notes">
          <Textarea value="" placeholder="Not available on the free plan" disabled={true} />
        </FormField>
      </form>
    </article>
  );
}
