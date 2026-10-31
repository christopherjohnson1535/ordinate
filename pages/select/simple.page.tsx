// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import Select, { SelectProps } from '~components/select';

import styles from './styles.module.scss';

const regions: SelectProps.Options = [
  { value: 'us-east', label: 'US East', description: 'Virginia', labelTag: '6 zones' },
  { value: 'us-west', label: 'US West', description: 'Oregon', labelTag: '4 zones' },
  { value: 'eu-central', label: 'EU Central', description: 'Frankfurt', disabled: true },
  { value: 'eu-north', label: 'EU North', description: 'Stockholm', tags: ['Low carbon', 'GPU'] },
  { value: 'ap-south', label: 'AP South', description: 'Mumbai' },
];

const grouped: SelectProps.Options = [
  {
    label: 'Compute',
    options: [
      { value: 'vm', label: 'Virtual machine', iconName: 'menu' },
      { value: 'container', label: 'Container', iconName: 'copy' },
    ],
  },
  {
    label: 'Storage',
    description: 'Not available on the free plan',
    disabled: true,
    options: [
      { value: 'block', label: 'Block volume' },
      { value: 'object', label: 'Object bucket' },
    ],
  },
  { value: 'network', label: 'Network', iconName: 'external' },
];

const many: SelectProps.Options = Array.from({ length: 40 }, (_, index) => ({
  value: `node-${index + 1}`,
  label: `node-${String(index + 1).padStart(2, '0')}`,
}));

function useSelection(initial: SelectProps.Option | null = null) {
  const [selectedOption, setSelectedOption] = useState(initial);
  return {
    selectedOption,
    onChange: (event: { detail: SelectProps.ChangeDetail }) => setSelectedOption(event.detail.selectedOption),
  };
}

function AsyncSelect() {
  const [status, setStatus] = useState<SelectProps.StatusType>('pending');
  const [options, setOptions] = useState<SelectProps.Option[]>([]);
  const [fail, setFail] = useState(true);
  const selection = useSelection();

  const load = (firstPage: boolean) => {
    setStatus('loading');
    setTimeout(() => {
      if (fail) {
        setFail(false);
        setStatus('error');
        return;
      }
      const start = firstPage ? 0 : options.length;
      const page = many.slice(start, start + 15) as SelectProps.Option[];
      const next = firstPage ? page : [...options, ...page];
      setOptions(next);
      setStatus(next.length >= many.length ? 'finished' : 'pending');
    }, 800);
  };

  return (
    <Select
      {...selection}
      options={options}
      placeholder="Choose a node"
      statusType={status}
      loadingText="Loading nodes"
      errorText="Could not load nodes."
      recoveryText="Retry"
      errorIconAriaLabel="Error"
      finishedText="All nodes loaded"
      onLoadItems={event => {
        if (event.detail.firstPage && options.length > 0) {
          return;
        }
        load(event.detail.firstPage && !event.detail.samePage);
      }}
    />
  );
}

export default function SelectSimple() {
  return (
    <article className={styles.page}>
      <h1>Select</h1>
      <div className={styles.grid}>
        <FormField label="Region" description="Where the nodes run.">
          <Select {...useSelection()} options={regions} placeholder="Choose a region" />
        </FormField>
        <FormField label="Region, selected">
          <Select {...useSelection(regions[3])} options={regions} />
        </FormField>
        <FormField label="Resource type" description="Groups, icons and a disabled group.">
          <Select {...useSelection()} options={grouped} placeholder="Choose a type" />
        </FormField>
        <FormField label="Node" description="Filtered as you type.">
          <Select
            {...useSelection()}
            options={many}
            placeholder="Choose a node"
            filteringType="auto"
            filteringPlaceholder="Find a node"
            filteringAriaLabel="Find a node"
            noMatch="No matching nodes"
          />
        </FormField>
        <FormField label="Node, loaded in pages" description="Fails once, then loads 15 at a time.">
          <AsyncSelect />
        </FormField>
        <FormField label="Region" errorText="Choose a region.">
          <Select {...useSelection()} options={regions} placeholder="Choose a region" />
        </FormField>
        <FormField label="Region, read-only">
          <Select {...useSelection(regions[0])} options={regions} readOnly={true} />
        </FormField>
        <FormField label="Region, disabled">
          <Select {...useSelection()} options={regions} placeholder="Choose a region" disabled={true} />
        </FormField>
        <FormField label="Backup vault">
          <Select {...useSelection()} options={[]} placeholder="Choose a vault" empty="No vaults in this region" />
        </FormField>
      </div>
      <div className={styles.bottom}>
        <FormField label="Near the bottom" description="Opens above when there is no room below.">
          <Select {...useSelection()} options={many} placeholder="Choose a node" />
        </FormField>
      </div>
    </article>
  );
}
