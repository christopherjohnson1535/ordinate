// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import { matchesPropertyFilterQuery } from '~components/property-filter/utils';
import Select, { SelectProps } from '~components/select';

import styles from './styles.module.scss';

interface Instance {
  name: string;
  state: string;
  type: string;
  zone: string;
  cpus: number;
}

const instances: Instance[] = [
  { name: 'web-frontend-01', state: 'running', type: 'standard.large', zone: 'north-1a', cpus: 4 },
  { name: 'web-frontend-02', state: 'running', type: 'standard.large', zone: 'north-1b', cpus: 4 },
  { name: 'api-gateway', state: 'running', type: 'compute.xlarge', zone: 'north-1a', cpus: 8 },
  { name: 'billing-worker', state: 'stopped', type: 'standard.medium', zone: 'west-2a', cpus: 2 },
  { name: 'search-indexer', state: 'pending', type: 'memory.xlarge', zone: 'west-2b', cpus: 8 },
  { name: 'metrics-collector', state: 'running', type: 'standard.small', zone: 'north-1a', cpus: 1 },
  { name: 'mail-relay', state: 'stopping', type: 'standard.small', zone: 'west-2a', cpus: 1 },
  { name: 'cache-primary', state: 'running', type: 'memory.large', zone: 'north-1b', cpus: 4 },
];

const properties: PropertyFilterProps.FilteringProperty[] = [
  { key: 'name', propertyLabel: 'Name', groupValuesLabel: 'Name values', operators: [':', '!:', '^', '!='] },
  { key: 'state', propertyLabel: 'State', groupValuesLabel: 'State values', operators: ['!='] },
  { key: 'type', propertyLabel: 'Instance type', operators: ['!=', ':', '^'] },
  { key: 'zone', propertyLabel: 'Zone', operators: ['!='], group: 'Placement' },
  { key: 'cpus', propertyLabel: 'vCPUs', operators: ['!=', '>', '<', '>=', '<='], group: 'Capacity' },
];

const stateLabels: Record<string, string> = {
  running: 'Running',
  stopped: 'Stopped',
  pending: 'Pending',
  stopping: 'Stopping',
};

const options: PropertyFilterProps.FilteringOption[] = instances.flatMap(instance => [
  { propertyKey: 'name', value: instance.name },
  { propertyKey: 'state', value: instance.state, label: stateLabels[instance.state] },
  { propertyKey: 'type', value: instance.type },
  { propertyKey: 'zone', value: instance.zone },
  { propertyKey: 'cpus', value: String(instance.cpus) },
]);

const empty: PropertyFilterProps.Query = { tokens: [], operation: 'and' };

const someTokens: PropertyFilterProps.Query = {
  tokens: [
    { propertyKey: 'state', operator: '=', value: 'running' },
    { propertyKey: 'zone', operator: '!=', value: 'west-2a' },
    { operator: ':', value: 'web' },
  ],
  operation: 'and',
};

const manyTokens: PropertyFilterProps.Query = {
  tokens: [
    { propertyKey: 'state', operator: '=', value: 'running' },
    { propertyKey: 'cpus', operator: '>=', value: '4' },
    { propertyKey: 'type', operator: '^', value: 'standard' },
    { propertyKey: 'name', operator: '!:', value: 'cache' },
    { propertyKey: 'zone', operator: '=', value: 'north-1a' },
    { operator: '!:', value: 'legacy' },
  ],
  operation: 'or',
};

function useQuery(initial: PropertyFilterProps.Query = empty) {
  const [query, setQuery] = useState(initial);
  return { query, onChange: (event: { detail: PropertyFilterProps.Query }) => setQuery(event.detail) };
}

function Example(props: Partial<PropertyFilterProps> & { initial?: PropertyFilterProps.Query }) {
  const { initial, ...rest } = props;
  return (
    <PropertyFilter
      {...useQuery(initial)}
      filteringProperties={properties}
      filteringOptions={options}
      filteringAriaLabel="Find instances"
      {...rest}
    />
  );
}

function FilteredInstances() {
  const { query, onChange } = useQuery(someTokens);
  const matches = instances.filter(instance =>
    matchesPropertyFilterQuery(instance as unknown as Record<string, unknown>, query, properties)
  );
  return (
    <div className={styles.stack}>
      <PropertyFilter
        query={query}
        onChange={onChange}
        filteringProperties={properties}
        filteringOptions={options}
        filteringPlaceholder="Find instances"
        filteringAriaLabel="Find instances"
        countText={`${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">State</th>
            <th scope="col">Type</th>
            <th scope="col">Zone</th>
            <th scope="col">vCPUs</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(instance => (
            <tr key={instance.name}>
              <td>{instance.name}</td>
              <td>{stateLabels[instance.state]}</td>
              <td>{instance.type}</td>
              <td>{instance.zone}</td>
              <td>{instance.cpus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AsyncExample() {
  const [status, setStatus] = useState<PropertyFilterProps.StatusType>('pending');
  const [loaded, setLoaded] = useState<PropertyFilterProps.FilteringOption[]>([]);
  return (
    <Example
      filteringOptions={loaded}
      filteringStatusType={status}
      filteringLoadingText="Loading values"
      filteringErrorText="Could not load values."
      filteringRecoveryText="Retry"
      filteringFinishedText="End of results"
      onLoadItems={event => {
        const { filteringProperty, filteringText } = event.detail;
        setStatus('loading');
        setTimeout(() => {
          const text = filteringText.toLowerCase();
          setLoaded(
            options.filter(
              option =>
                (!filteringProperty || option.propertyKey === filteringProperty.key) &&
                option.value.toLowerCase().includes(text)
            )
          );
          setStatus('finished');
        }, 700);
      }}
    />
  );
}

const savedFilters: SelectProps.Option[] = [
  { value: 'all', label: 'All instances' },
  { value: 'mine', label: 'My instances' },
];

function CustomControlExample() {
  const [saved, setSaved] = useState<SelectProps.Option | null>(savedFilters[0]);
  return (
    <Example
      initial={someTokens}
      customControl={
        <Select
          ariaLabel="Saved filters"
          options={savedFilters}
          selectedOption={saved}
          onChange={event => setSaved(event.detail.selectedOption)}
        />
      }
      customFilterActions={<Button>Save filter set</Button>}
    />
  );
}

export default function PropertyFilterPermutations() {
  return (
    <article className={styles.page}>
      <h1>Property filter</h1>
      <section className={styles.section}>
        <h2>Filtering a list</h2>
        <p className={styles.note}>
          Type “State”, then an operator, then a value. Enter adds the filter; free text matches any property.
        </p>
        <FilteredInstances />
      </section>
      <section className={styles.section}>
        <h2>Empty</h2>
        <div className={styles.stack}>
          <Example />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Or, with a token limit</h2>
        <div className={styles.stack}>
          <Example initial={manyTokens} tokenLimit={3} countText="5 matches" />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Hidden operations, no free text</h2>
        <div className={styles.stack}>
          <Example initial={someTokens} hideOperations={true} disableFreeTextFiltering={true} />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Custom control and actions</h2>
        <div className={styles.stack}>
          <CustomControlExample />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Values loaded on demand</h2>
        <div className={styles.stack}>
          <AsyncExample />
        </div>
      </section>
      <section className={styles.section}>
        <h2>In a clipped container</h2>
        <div className={styles.clipped}>
          <Example initial={someTokens} expandToViewport={true} />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Disabled</h2>
        <div className={styles.stack}>
          <Example initial={someTokens} disabled={true} />
        </div>
      </section>
    </article>
  );
}
