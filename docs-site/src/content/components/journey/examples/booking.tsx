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

export default function Booking() {
  const [dropOff, setDropOff] = useState<string | null>('book');
  const [fault, setFault] = useState('');
  const [time, setTime] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  if (booked) {
    return (
      <StyleScope styleName="shopfront">
        <SpaceBetween size="m">
          <Box variant="h2">Booked. We will text you the day before.</Box>
          <Button onClick={() => setBooked(false)}>Book another repair</Button>
        </SpaceBetween>
      </StyleScope>
    );
  }

  return (
    <StyleScope styleName="shopfront">
      <Journey
        finishButtonText="Book the repair"
        onFinish={() => setBooked(true)}
        steps={[
          {
            id: 'how',
            question: 'How would you like to drop off your bike?',
            content: (
              <Tiles
                value={dropOff}
                onChange={event => setDropOff(event.detail.value)}
                items={[
                  { value: 'walk-in', label: 'Walk in', description: 'Any time we are open.' },
                  { value: 'book', label: 'Book a slot', description: 'Pick a time online.' },
                ]}
              />
            ),
          },
          {
            id: 'what',
            question: 'What needs fixing?',
            description: 'A few words are enough. We check everything when you bring it in.',
            isOptional: true,
            content: (
              <FormField label="What needs fixing">
                <Input value={fault} onChange={event => setFault(event.detail.value)} />
              </FormField>
            ),
          },
          {
            id: 'when',
            question: 'When suits you?',
            content: (
              <Tiles
                value={time}
                onChange={event => setTime(event.detail.value)}
                items={[
                  { value: 'morning', label: 'Morning', description: 'Ready the same day.' },
                  { value: 'afternoon', label: 'Afternoon', description: 'Ready the next day.' },
                ]}
              />
            ),
          },
        ]}
      />
    </StyleScope>
  );
}
