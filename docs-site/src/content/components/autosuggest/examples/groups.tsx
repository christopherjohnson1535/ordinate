// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Autosuggest, { AutosuggestProps } from '@ordinate/components/autosuggest';
import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';

const commands: AutosuggestProps.Options = [
  {
    label: 'Recent',
    options: [
      { value: 'deploy survey-api', iconName: 'history' },
      { value: 'restart survey-worker', iconName: 'history' },
    ],
  },
  {
    label: 'Commands',
    options: [
      { value: 'deploy', description: 'Roll out the latest image', iconName: 'terminal' },
      { value: 'rollback', description: 'Go back to the last good image', iconName: 'terminal' },
      { value: 'scale', description: 'Change the number of nodes', iconName: 'terminal', labelTag: 'admin' },
      { value: 'delete', description: 'Only owners can delete', iconName: 'terminal', disabled: true },
    ],
  },
];

export default function Groups() {
  const [value, setValue] = useState('');
  const [ran, setRan] = useState('');

  return (
    <SpaceBetween size="s">
      <Autosuggest
        ariaLabel="Run a command"
        placeholder="Run a command"
        value={value}
        options={commands}
        hideEnteredTextOption={true}
        empty="No commands match"
        onChange={event => setValue(event.detail.value)}
        onSelect={event => {
          setRan(event.detail.value);
          setValue('');
        }}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {ran ? `Ran: ${ran}` : 'Choose a command from the list.'}
      </Box>
    </SpaceBetween>
  );
}
