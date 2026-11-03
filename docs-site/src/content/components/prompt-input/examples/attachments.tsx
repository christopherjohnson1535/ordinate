// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import FormField from '@ordinate/components/form-field';
import PromptInput from '@ordinate/components/prompt-input';
import SpaceBetween from '@ordinate/components/space-between';
import TokenGroup from '@ordinate/components/token-group';

const sampleFiles = ['north-annex-site-plan.pdf', 'load-schedule.csv', 'survey-notes.txt'];

export default function Attachments() {
  const [value, setValue] = useState('Check the load schedule against the site plan.');
  const [files, setFiles] = useState(sampleFiles.slice(0, 2));
  const [status, setStatus] = useState('Nothing sent yet.');

  const attachNext = () => {
    const next = sampleFiles.find(file => !files.includes(file));
    if (next) {
      setFiles([...files, next]);
    }
  };

  return (
    <SpaceBetween size="m">
      <FormField label="Ask about the drawings" stretch={true}>
        <PromptInput
          value={value}
          onChange={event => setValue(event.detail.value)}
          onAction={event => {
            setStatus(`Sent "${event.detail.value}" with ${files.length} files.`);
            setValue('');
            setFiles([]);
          }}
          disableActionButton={value.trim() === ''}
          placeholder="What should the assistant check?"
          secondaryContent={
            files.length > 0 && (
              <TokenGroup
                items={files.map(file => ({ label: file, iconName: 'file' as const, dismissLabel: `Remove ${file}` }))}
                onDismiss={event => setFiles(files.filter((_, index) => index !== event.detail.itemIndex))}
              />
            )
          }
          secondaryActions={
            <SpaceBetween direction="horizontal" size="xxs">
              <Button
                variant="icon"
                iconName="upload"
                ariaLabel="Attach a file"
                disabled={files.length === sampleFiles.length}
                onClick={attachNext}
              />
              <Button variant="icon" iconName="microphone" ariaLabel="Dictate" />
            </SpaceBetween>
          }
        />
      </FormField>
      <Box color="text-body-secondary" fontSize="body-s">
        {status}
      </Box>
    </SpaceBetween>
  );
}
