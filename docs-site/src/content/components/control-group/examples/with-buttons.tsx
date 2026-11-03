// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import ControlGroup from '@ordinate/components/control-group';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import Select, { SelectProps } from '@ordinate/components/select';
import SpaceBetween from '@ordinate/components/space-between';

const protocols: SelectProps.Options = [
  { value: 'https', label: 'https://' },
  { value: 'http', label: 'http://' },
];

export default function WithButtons() {
  const [protocol, setProtocol] = useState<SelectProps.Option | null>(protocols[0]);
  const [host, setHost] = useState('api.north-annex.example.com');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('Nothing run yet.');

  return (
    <SpaceBetween size="l">
      <FormField label="Health check URL">
        <ControlGroup>
          <Select
            options={protocols}
            selectedOption={protocol}
            ariaLabel="Protocol"
            onChange={event => setProtocol(event.detail.selectedOption)}
          />
          <Input value={host} onChange={event => setHost(event.detail.value)} />
          <Button
            formAction="none"
            variant="icon"
            iconName="copy"
            ariaLabel="Copy URL"
            onClick={() => setResult(`Copied ${protocol?.label ?? ''}${host}.`)}
          />
        </ControlGroup>
      </FormField>
      <ControlGroup ariaLabel="Search logs">
        <Input
          type="search"
          ariaLabel="Query"
          placeholder="Search survey-api logs"
          value={query}
          onChange={event => setQuery(event.detail.value)}
        />
        <Button formAction="none" variant="primary" onClick={() => setResult(`Searched for "${query}".`)}>
          Search
        </Button>
      </ControlGroup>
      <Box color="text-body-secondary" fontSize="body-s">
        {result}
      </Box>
    </SpaceBetween>
  );
}
