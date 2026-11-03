// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Autosuggest, { AutosuggestProps } from '@ordinate/components/autosuggest';
import FormField from '@ordinate/components/form-field';

const people = ['Dana Ruiz', 'Amir Haddad', 'Mei Tanaka', 'Jonas Berg', 'Priya Nair', 'Tomás Ortega', 'Ines Duarte'];

// Stands in for a request to a directory service.
function findPeople(text: string): Promise<string[]> {
  return new Promise(resolve =>
    window.setTimeout(() => resolve(people.filter(name => name.toLowerCase().includes(text.toLowerCase()))), 700)
  );
}

export default function Async() {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<AutosuggestProps.Option[]>([]);
  const [status, setStatus] = useState<AutosuggestProps.StatusType>('pending');
  const latest = useRef('');

  return (
    <FormField label="Reviewer" description="Searches the directory as you type.">
      <Autosuggest
        value={value}
        options={options}
        filteringType="manual"
        hideEnteredTextOption={true}
        statusType={status}
        loadingText="Searching the directory"
        finishedText="End of results"
        empty="No one by that name"
        placeholder="Find a person"
        onChange={event => setValue(event.detail.value)}
        onLoadItems={event => {
          const text = event.detail.filteringText;
          latest.current = text;
          setStatus('loading');
          findPeople(text).then(names => {
            // Keeps only the answer to the newest request.
            if (latest.current === text) {
              setOptions(names.map(name => ({ value: name })));
              setStatus('finished');
            }
          });
        }}
      />
    </FormField>
  );
}
