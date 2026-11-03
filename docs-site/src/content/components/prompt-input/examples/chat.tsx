// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Box from '@ordinate/components/box';
import FormField from '@ordinate/components/form-field';
import PromptInput from '@ordinate/components/prompt-input';
import SpaceBetween from '@ordinate/components/space-between';

interface Message {
  from: 'you' | 'assistant';
  text: string;
}

export default function Chat() {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    if (!replying) {
      return;
    }
    const timer = window.setTimeout(() => {
      setMessages(current => [
        ...current,
        { from: 'assistant', text: 'atrium-api runs 6 nodes in us-mountain-1. CPU peaked at 64% yesterday.' },
      ]);
      setReplying(false);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [replying]);

  return (
    <SpaceBetween size="m">
      <div aria-live="polite">
        <SpaceBetween size="xs">
          {messages.map((message, index) => (
            <Box key={index} color={message.from === 'you' ? undefined : 'text-body-secondary'}>
              <strong>{message.from === 'you' ? 'You' : 'Assistant'}:</strong> {message.text}
            </Box>
          ))}
          {replying && <Box color="text-status-inactive">The assistant is replying…</Box>}
        </SpaceBetween>
      </div>
      <FormField label="Ask the assistant" description="Enter sends, Shift+Enter adds a line." stretch={true}>
        <PromptInput
          value={value}
          onChange={event => setValue(event.detail.value)}
          onAction={event => {
            setMessages(current => [...current, { from: 'you', text: event.detail.value }]);
            setValue('');
            setReplying(true);
          }}
          disableActionButton={value.trim() === '' || replying}
          placeholder="How busy was atrium-api yesterday?"
          maxRows={6}
        />
      </FormField>
    </SpaceBetween>
  );
}
