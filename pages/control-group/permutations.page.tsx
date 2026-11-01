// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Autosuggest from '~components/autosuggest';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ControlGroup from '~components/control-group';
import FormField from '~components/form-field';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';

import styles from '../form-controls.module.scss';

const units: SelectProps.Option[] = [
  { value: 'gib', label: 'GiB' },
  { value: 'tib', label: 'TiB' },
];

const protocols: SelectProps.Option[] = [
  { value: 'https', label: 'https://' },
  { value: 'http', label: 'http://' },
];

function useText(initial = '') {
  const [value, setValue] = useState(initial);
  return { value, onChange: (event: { detail: { value: string } }) => setValue(event.detail.value) };
}

function useOption(initial: SelectProps.Option) {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(initial);
  return {
    selectedOption,
    onChange: (event: { detail: SelectProps.ChangeDetail }) => setSelectedOption(event.detail.selectedOption),
  };
}

export default function ControlGroupPermutations() {
  const size = useText('100');
  const sizeUnit = useOption(units[0]);
  const url = useText('console.example.com');
  const protocol = useOption(protocols[0]);
  const search = useText();
  const host = useText();
  const invalidSize = useText('-4');
  const invalidUnit = useOption(units[1]);

  return (
    <article className={styles.page}>
      <h1>Control group</h1>
      <div className={styles.form}>
        <FormField label="Volume size" description="An input joined to a select.">
          <ControlGroup>
            <Input {...size} type="number" inputMode="numeric" />
            <Select {...sizeUnit} options={units} ariaLabel="Unit" />
          </ControlGroup>
        </FormField>
        <FormField label="Endpoint" description="A select, an input and a button.">
          <ControlGroup>
            <Select {...protocol} options={protocols} ariaLabel="Protocol" />
            <Input {...url} />
            <Button iconName="copy" variant="icon" ariaLabel="Copy endpoint" />
          </ControlGroup>
        </FormField>
        <ControlGroup ariaLabel="Search logs">
          <Input {...search} type="search" placeholder="Search logs" ariaLabel="Query" />
          <Button variant="primary">Search</Button>
        </ControlGroup>
        <FormField label="Host" description="An autosuggest with a button dropdown.">
          <ControlGroup>
            <Autosuggest
              {...host}
              options={[{ value: 'east-1.example.com' }, { value: 'west-1.example.com' }]}
              placeholder="Find a host"
            />
            <ButtonDropdown
              items={[
                { id: 'ping', text: 'Ping' },
                { id: 'trace', text: 'Trace route' },
              ]}
            >
              Actions
            </ButtonDropdown>
          </ControlGroup>
        </FormField>
        <FormField label="Volume size" errorText="Enter a size greater than zero.">
          <ControlGroup>
            <Input {...invalidSize} type="number" />
            <Select {...invalidUnit} options={units} ariaLabel="Unit" />
          </ControlGroup>
        </FormField>
        <FormField label="Volume size, disabled">
          <ControlGroup>
            <Input value="100" disabled={true} />
            <Select selectedOption={units[0]} options={units} ariaLabel="Unit" disabled={true} />
            <Button disabled={true}>Resize</Button>
          </ControlGroup>
        </FormField>
        <ControlGroup ariaLabel="Zoom">
          <Button iconName="zoom-out" variant="icon" ariaLabel="Zoom out" />
          <Button>100%</Button>
          <Button iconName="zoom-in" variant="icon" ariaLabel="Zoom in" />
        </ControlGroup>
      </div>
    </article>
  );
}
