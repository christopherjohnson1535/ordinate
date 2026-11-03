// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Journey from '@ordinate/components/journey';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';
import Tiles from '@ordinate/components/tiles';

export default function Labels() {
  const [length, setLength] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);
  const [step, setStep] = useState('Step 1');
  const [done, setDone] = useState(false);

  return (
    <StyleScope styleName="editorial">
      <SpaceBetween size="m">
        <Journey
          headingLevel={3}
          finishButtonText="See matching pieces"
          i18nStrings={{
            backButton: 'Previous',
            continueButton: 'Next question',
            questionCounterText: (number, count) => `${number} / ${count}`,
          }}
          onNavigate={({ detail }) => setStep(`Step ${detail.requestedStepIndex + 1}, by ${detail.reason}`)}
          onFinish={() => setDone(true)}
          steps={[
            {
              id: 'length',
              question: 'How long do you have to read?',
              content: (
                <Tiles
                  value={length}
                  onChange={event => setLength(event.detail.value)}
                  items={[
                    { value: 'short', label: 'A cup of tea', description: 'Under ten minutes.' },
                    { value: 'long', label: 'A slow evening', description: 'Essays of an hour or more.' },
                  ]}
                />
              ),
            },
            {
              id: 'format',
              question: 'What would you like to read?',
              content: (
                <Tiles
                  value={format}
                  onChange={event => setFormat(event.detail.value)}
                  items={[
                    { value: 'essays', label: 'Essays' },
                    { value: 'notes', label: 'Field notes' },
                    { value: 'recipes', label: 'Recipes' },
                  ]}
                />
              ),
            },
          ]}
        />
        <Box color="text-body-secondary" fontSize="body-s">
          {done ? 'Finished.' : step}
        </Box>
      </SpaceBetween>
    </StyleScope>
  );
}
