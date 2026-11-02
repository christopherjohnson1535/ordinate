// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import FormField from '~components/form-field';

import styles from './styles.module.scss';

const hosts: AutosuggestProps.Options = [
  { value: 'east-1.example.com', label: 'east-1', description: 'Virginia', labelTag: 'primary' },
  { value: 'east-2.example.com', label: 'east-2', description: 'Ohio', disabled: true },
  { value: 'west-1.example.com', label: 'west-1', description: 'Oregon', tags: ['GPU', 'Low carbon'] },
  { value: 'north-1.example.com', label: 'north-1', description: 'Stockholm' },
];

const grouped: AutosuggestProps.Options = [
  {
    label: 'Recent',
    options: [
      { value: 'deploy staging', iconName: 'history' },
      { value: 'restart worker', iconName: 'history' },
    ],
  },
  {
    label: 'Commands',
    options: [
      { value: 'deploy production', iconName: 'terminal' },
      { value: 'rollback', iconName: 'terminal' },
      { value: 'scale workers', iconName: 'terminal' },
    ],
  },
];

const cities = ['Amsterdam', 'Athens', 'Berlin', 'Bern', 'Brussels', 'Dublin', 'Lisbon', 'London', 'Madrid', 'Oslo'];

function useValue(initial = '') {
  const [value, setValue] = useState(initial);
  return { value, onChange: (event: { detail: AutosuggestProps.ChangeDetail }) => setValue(event.detail.value) };
}

function AsyncAutosuggest() {
  const input = useValue();
  const [status, setStatus] = useState<AutosuggestProps.StatusType>('pending');
  const [options, setOptions] = useState<AutosuggestProps.Option[]>([]);

  return (
    <Autosuggest
      {...input}
      options={options}
      filteringType="manual"
      placeholder="Find a city"
      statusType={status}
      loadingText="Looking up cities"
      finishedText="End of results"
      empty="No cities found"
      onLoadItems={event => {
        const text = event.detail.filteringText.toLowerCase();
        setStatus('loading');
        setTimeout(() => {
          setOptions(cities.filter(city => city.toLowerCase().includes(text)).map(city => ({ value: city })));
          setStatus('finished');
        }, 700);
      }}
    />
  );
}

export default function AutosuggestPermutations() {
  return (
    <article className={styles.page}>
      <h1>Autosuggest</h1>
      <div className={styles.grid}>
        <FormField label="Host" description="Type to filter. The typed text can be used as is.">
          <Autosuggest {...useValue()} options={hosts} placeholder="Find a host" />
        </FormField>
        <FormField label="Host, with a value">
          <Autosuggest {...useValue('west')} options={hosts} placeholder="Find a host" />
        </FormField>
        <FormField label="Command" description="Groups and icons, suggestions only.">
          <Autosuggest
            {...useValue()}
            options={grouped}
            placeholder="Run a command"
            hideEnteredTextOption={true}
            empty="No commands"
          />
        </FormField>
        <FormField label="City" description="Loaded as you type.">
          <AsyncAutosuggest />
        </FormField>
        <FormField label="Host" errorText="Enter a host name.">
          <Autosuggest {...useValue()} options={hosts} placeholder="Find a host" />
        </FormField>
        <FormField label="Host" warningText="This host is being retired.">
          <Autosuggest {...useValue('east-2.example.com')} options={hosts} />
        </FormField>
        <FormField label="Host, read-only">
          <Autosuggest {...useValue('east-1.example.com')} options={hosts} readOnly={true} />
        </FormField>
        <FormField label="Host, disabled">
          <Autosuggest {...useValue()} options={hosts} placeholder="Find a host" disabled={true} />
        </FormField>
        <FormField label="Host, failed to load">
          <Autosuggest
            {...useValue()}
            options={[]}
            placeholder="Find a host"
            statusType="error"
            errorText="Could not load hosts."
            recoveryText="Retry"
          />
        </FormField>
      </div>
    </article>
  );
}
