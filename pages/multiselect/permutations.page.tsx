// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import Multiselect, { MultiselectProps } from '~components/multiselect';

import styles from './styles.module.scss';

const regions: MultiselectProps.Options = [
  { value: 'us-east', label: 'US East', description: 'Virginia', labelTag: '6 zones' },
  { value: 'us-west', label: 'US West', description: 'Oregon', labelTag: '4 zones' },
  { value: 'eu-central', label: 'EU Central', description: 'Frankfurt', disabled: true },
  { value: 'eu-north', label: 'EU North', description: 'Stockholm', tags: ['Low carbon', 'GPU'] },
  { value: 'ap-south', label: 'AP South', description: 'Mumbai' },
  { value: 'ap-east', label: 'AP East', description: 'Hong Kong' },
];

const grouped: MultiselectProps.Options = [
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
  { value: 'network', label: 'Network', iconName: 'open-outside' },
];

const many: MultiselectProps.Option[] = Array.from({ length: 40 }, (_, index) => ({
  value: `node-${index + 1}`,
  label: `node-${String(index + 1).padStart(2, '0')}`,
}));

function useSelection(initial: ReadonlyArray<MultiselectProps.Option> = []) {
  const [selectedOptions, setSelectedOptions] = useState(initial);
  return {
    selectedOptions,
    onChange: (event: { detail: MultiselectProps.ChangeDetail }) => setSelectedOptions(event.detail.selectedOptions),
  };
}

function AsyncMultiselect() {
  const [status, setStatus] = useState<MultiselectProps.StatusType>('pending');
  const [options, setOptions] = useState<MultiselectProps.Option[]>([]);
  const selection = useSelection();

  const load = (firstPage: boolean) => {
    setStatus('loading');
    setTimeout(() => {
      const start = firstPage ? 0 : options.length;
      const next = [...(firstPage ? [] : options), ...many.slice(start, start + 15)];
      setOptions(next);
      setStatus(next.length >= many.length ? 'finished' : 'pending');
    }, 800);
  };

  return (
    <Multiselect
      {...selection}
      options={options}
      placeholder="Choose nodes"
      statusType={status}
      loadingText="Loading nodes"
      finishedText="All nodes loaded"
      onLoadItems={event => {
        if (event.detail.firstPage && options.length > 0) {
          return;
        }
        load(event.detail.firstPage);
      }}
    />
  );
}

export default function MultiselectPermutations() {
  return (
    <article className={styles.page}>
      <h1>Multiselect</h1>
      <div className={styles.grid}>
        <FormField label="Regions" description="Where the nodes run.">
          <Multiselect {...useSelection()} options={regions} placeholder="Choose regions" />
        </FormField>
        <FormField label="Regions, selected" description="Tokens below the trigger.">
          <Multiselect {...useSelection([regions[0], regions[3]])} options={regions} placeholder="Choose regions" />
        </FormField>
        <FormField label="Resource types" description="Groups, icons and Select all.">
          <Multiselect
            {...useSelection([{ value: 'vm' }])}
            options={grouped}
            placeholder="Choose types"
            enableSelectAll={true}
          />
        </FormField>
        <FormField label="Nodes" description="Filtered, with a token limit of 3.">
          <Multiselect
            {...useSelection(many.slice(0, 6))}
            options={many}
            placeholder="Choose nodes"
            filteringType="auto"
            filteringPlaceholder="Find a node"
            filteringAriaLabel="Find a node"
            noMatch="No matching nodes"
            tokenLimit={3}
            enableSelectAll={true}
          />
        </FormField>
        <FormField label="Nodes, loaded in pages" description="Loads 15 at a time.">
          <AsyncMultiselect />
        </FormField>
        <FormField label="Regions, closes on choice">
          <Multiselect {...useSelection()} options={regions} placeholder="Choose regions" keepOpen={false} />
        </FormField>
        <FormField label="Regions" errorText="Choose at least two regions.">
          <Multiselect {...useSelection([regions[1]])} options={regions} placeholder="Choose regions" />
        </FormField>
        <FormField label="Regions" warningText="EU Central is in maintenance.">
          <Multiselect {...useSelection([{ value: 'eu-central' }])} options={regions} placeholder="Choose regions" />
        </FormField>
        <FormField label="Regions, read-only">
          <Multiselect {...useSelection([regions[0], regions[1]])} options={regions} readOnly={true} />
        </FormField>
        <FormField label="Regions, disabled">
          <Multiselect {...useSelection([regions[0]])} options={regions} disabled={true} />
        </FormField>
        <FormField label="Regions, tokens hidden">
          <Multiselect {...useSelection([regions[0], regions[1]])} options={regions} hideTokens={true} />
        </FormField>
        <FormField label="Backup vaults">
          <Multiselect {...useSelection()} options={[]} placeholder="Choose vaults" empty="No vaults in this region" />
        </FormField>
      </div>
    </article>
  );
}
