// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useState } from 'react';

import Box from '@ordinate/components/box';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import RadioButton from '@ordinate/components/radio-button';
import SpaceBetween from '@ordinate/components/space-between';

export default function WithFields() {
  const [source, setSource] = useState('latest');
  const [snapshot, setSnapshot] = useState('snap-north-annex-2026-10-28');
  const headingId = useId();

  return (
    <SpaceBetween size="s">
      <Box variant="h4" tagOverride="h3" id={headingId}>
        Restore from
      </Box>
      <div role="radiogroup" aria-labelledby={headingId}>
        <SpaceBetween size="s">
          <RadioButton
            name="restore-source"
            value="latest"
            checked={source === 'latest'}
            onSelect={() => setSource('latest')}
            description="Taken at 02:00 today."
          >
            Latest backup
          </RadioButton>
          <RadioButton
            name="restore-source"
            value="snapshot"
            checked={source === 'snapshot'}
            onSelect={() => setSource('snapshot')}
            description="Any snapshot from the last 30 days."
          >
            A named snapshot
          </RadioButton>
          {source === 'snapshot' && (
            <Box padding={{ left: 'xl' }}>
              <FormField label="Snapshot ID" layout="stacked">
                <Input value={snapshot} onChange={event => setSnapshot(event.detail.value)} />
              </FormField>
            </Box>
          )}
        </SpaceBetween>
      </div>
    </SpaceBetween>
  );
}
