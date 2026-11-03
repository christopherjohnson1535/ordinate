// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import Journey from '@ordinate/components/journey';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';
import Tiles from '@ordinate/components/tiles';

export default function Validation() {
  const [index, setIndex] = useState(0);
  const [room, setRoom] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ room?: string; email?: string }>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const finish = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: 'Enter an email address, such as dana@example.com.' });
      return;
    }
    setErrors({});
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  };

  if (sent) {
    return (
      <StyleScope styleName="studio">
        <SpaceBetween size="m">
          <Box variant="h2">Thank you. We will write to {email} within two working days.</Box>
          <Button
            onClick={() => {
              setSent(false);
              setIndex(0);
            }}
          >
            Start again
          </Button>
        </SpaceBetween>
      </StyleScope>
    );
  }

  return (
    <StyleScope styleName="studio">
      <Journey
        activeStepIndex={index}
        isLoading={sending}
        finishButtonText="Send my request"
        onNavigate={({ detail }) => {
          if (detail.reason === 'next' && !room) {
            setErrors({ room: 'Choose the room you have in mind.' });
            return;
          }
          setErrors({});
          setIndex(detail.requestedStepIndex);
        }}
        onFinish={finish}
        steps={[
          {
            id: 'room',
            question: 'What would you like to change?',
            description: 'Pick the closest. We can talk through the details later.',
            errorText: errors.room,
            content: (
              <Tiles
                value={room}
                onChange={event => setRoom(event.detail.value)}
                items={[
                  { value: 'kitchen', label: 'A kitchen', description: 'Layout, cabinets, worktops.' },
                  { value: 'bathroom', label: 'A bathroom', description: 'Tiling, fittings, light.' },
                  { value: 'home', label: 'The whole home', description: 'Rooms, flow and storage.' },
                ]}
              />
            ),
          },
          {
            id: 'contact',
            question: 'Where can we reach you?',
            description: 'We reply within two working days.',
            content: (
              <FormField label="Email" errorText={errors.email}>
                <Input type="email" value={email} onChange={event => setEmail(event.detail.value)} />
              </FormField>
            ),
          },
        ]}
      />
    </StyleScope>
  );
}
