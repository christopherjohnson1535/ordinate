// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';
import Toggle from '@ordinate/components/toggle';

export default function ModeAndDensity() {
  const [dark, setDark] = useState(true);
  const [compact, setCompact] = useState(false);
  const [name, setName] = useState('vault-store');

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="l">
        <Toggle checked={dark} onChange={event => setDark(event.detail.checked)}>
          Dark mode
        </Toggle>
        <Toggle checked={compact} onChange={event => setCompact(event.detail.checked)}>
          Compact density
        </Toggle>
      </SpaceBetween>
      <StyleScope mode={dark ? 'dark' : 'light'} density={compact ? 'compact' : 'comfortable'} revision="2026.2">
        <Box padding="l">
          <SpaceBetween size="m">
            <FormField label="Service name" description="Lowercase letters, numbers and hyphens.">
              <Input value={name} onChange={event => setName(event.detail.value)} />
            </FormField>
            <Button variant="primary">Rename service</Button>
          </SpaceBetween>
        </Box>
      </StyleScope>
    </SpaceBetween>
  );
}
