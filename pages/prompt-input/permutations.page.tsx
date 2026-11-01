// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import FormField from '~components/form-field';
import PromptInput, { PromptInputProps } from '~components/prompt-input';
import TokenGroup from '~components/token-group';

import styles from '../form-controls.module.scss';

function Controlled({ initial = '', ...rest }: Partial<PromptInputProps> & { initial?: string }) {
  const [value, setValue] = useState(initial);
  return <PromptInput {...rest} value={value} onChange={event => setValue(event.detail.value)} />;
}

function Chat() {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState<string[]>([]);
  const [files, setFiles] = useState(['capacity-plan.pdf', 'metrics.csv']);
  return (
    <FormField label="Assistant" description="Enter sends, Shift+Enter adds a line.">
      <div className={styles.stack}>
        {sent.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
        <PromptInput
          value={value}
          onChange={event => setValue(event.detail.value)}
          onAction={event => {
            setSent([...sent, event.detail.value]);
            setValue('');
          }}
          disableActionButton={value.trim() === ''}
          placeholder="Ask about your resources"
          maxRows={6}
          secondaryContent={
            files.length > 0 && (
              <TokenGroup
                items={files.map(file => ({ label: file, iconName: 'file' as const }))}
                onDismiss={event => setFiles(files.filter((_, index) => index !== event.detail.itemIndex))}
              />
            )
          }
          secondaryActions={
            <>
              <Button variant="icon" iconName="upload" ariaLabel="Attach a file" />
              <Button variant="icon" iconName="microphone" ariaLabel="Dictate" />
            </>
          }
        />
      </div>
    </FormField>
  );
}

export default function PromptInputPermutations() {
  return (
    <article className={styles.page}>
      <h1>Prompt input</h1>
      <div className={styles.form}>
        <Chat />
        <FormField label="Default">
          <Controlled placeholder="Ask a question" />
        </FormField>
        <FormField label="Grows to three lines, then scrolls">
          <Controlled
            initial={'Summarise the incidents from last week.\nGroup them by service.\nList the owners.\nAdd links.'}
          />
        </FormField>
        <FormField label="Three to five lines">
          <Controlled minRows={3} maxRows={5} placeholder="Describe the change" actionButtonIconName="arrow-up" />
        </FormField>
        <FormField label="Toolbar without paddings">
          <Controlled
            placeholder="Run a command"
            disableSecondaryActionsPaddings={true}
            secondaryActions={<Button variant="link">Choose a model</Button>}
          />
        </FormField>
        <FormField label="Invalid" errorText="The prompt is longer than 4,000 characters.">
          <Controlled initial="A very long prompt" />
        </FormField>
        <FormField label="Warning" warningText="This prompt mentions a production account.">
          <Controlled initial="Restart prod-db-1" />
        </FormField>
        <FormField label="Read-only">
          <Controlled initial="Generated from the template." readOnly={true} />
        </FormField>
        <FormField label="Disabled">
          <Controlled placeholder="Available after sign-in" disabled={true} />
        </FormField>
      </div>
    </article>
  );
}
