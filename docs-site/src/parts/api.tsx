// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Badge from '@ordinate/components/badge';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';
import Table from '@ordinate/components/table';
import TextFilter from '@ordinate/components/text-filter';

import {
  Definition,
  DefinitionEvent,
  DefinitionFunction,
  DefinitionProperty,
  DefinitionRegion,
} from '../registry/types';
import { Markdown } from './markdown';

import styles from './api.module.scss';

function Description({ source }: { source?: string }) {
  return <div className={styles.description}>{source ? <Markdown source={source} /> : null}</div>;
}

const valueLimit = 10;

function Values({ values }: { values: ReadonlyArray<string> }) {
  const [all, setAll] = useState(false);
  const shown = all ? values : values.slice(0, valueLimit);
  return (
    <ul className={styles.values} aria-label="Values">
      {shown.map(value => (
        <li key={value}>
          <code>{/^\d/.test(value) ? value : `'${value}'`}</code>
        </li>
      ))}
      {values.length > valueLimit && (
        <li>
          <Button variant="link" onClick={() => setAll(current => !current)}>
            {all ? 'Show fewer' : `${values.length - valueLimit} more`}
          </Button>
        </li>
      )}
    </ul>
  );
}

/** The left column of a property row: its name, flags, type, allowed values and default. */
function PropertySignature({ property }: { property: DefinitionProperty }) {
  return (
    <div className={styles.signature}>
      <Name name={property.name} optional={property.optional} deprecated={isDeprecated(property.description)} />
      <code className={styles['type-name']}>{property.type}</code>
      {property.values && property.values.length > 0 && <Values values={property.values} />}
      {property.defaultValue && (
        <span className={styles.default}>
          <span className={styles['default-label']}>Default</span> <code>{property.defaultValue}</code>
        </span>
      )}
    </div>
  );
}

function Name({ name, optional, deprecated }: { name: string; optional?: boolean; deprecated?: boolean }) {
  return (
    <span className={styles.name}>
      <code>{name}</code>
      {optional === false && <Badge tone="note">Required</Badge>}
      {deprecated && <Badge tone="medium">Deprecated</Badge>}
    </span>
  );
}

const matches = (filter: string, ...texts: Array<string | undefined>) =>
  !filter || texts.some(text => text?.toLowerCase().includes(filter.toLowerCase()));

const isDeprecated = (description?: string) => /^deprecated\b/i.test(description ?? '');

function PropertiesTable({ properties, filter }: { properties: ReadonlyArray<DefinitionProperty>; filter: string }) {
  const items = properties.filter(property => matches(filter, property.name, property.description, property.type));
  return (
    <Table
      variant="embedded"
      wrapLines={true}
      caption="Properties"
      trackBy="name"
      items={items}
      ariaLabels={{ tableLabel: 'Properties' }}
      empty={<Box color="text-body-secondary">No property matches the filter.</Box>}
      columnDefinitions={[
        {
          id: 'name',
          header: 'Name and type',
          cell: property => <PropertySignature property={property} />,
          width: '36%',
        },
        { id: 'description', header: 'Description', cell: property => <Description source={property.description} /> },
      ]}
    />
  );
}

function RegionsTable({ regions, filter }: { regions: ReadonlyArray<DefinitionRegion>; filter: string }) {
  const items = regions.filter(region => matches(filter, region.name, region.description));
  return (
    <Table
      variant="embedded"
      wrapLines={true}
      caption="Regions"
      trackBy="name"
      items={items}
      ariaLabels={{ tableLabel: 'Regions' }}
      empty={<Box color="text-body-secondary">No region matches the filter.</Box>}
      columnDefinitions={[
        {
          id: 'name',
          header: 'Name',
          cell: region => (
            <span className={styles.name}>
              <code>{region.name}</code>
              {region.isDefault && <Badge tone="neutral">Default</Badge>}
            </span>
          ),
          width: '36%',
        },
        { id: 'description', header: 'Description', cell: region => <Description source={region.description} /> },
      ]}
    />
  );
}

function EventsTable({ events, filter }: { events: ReadonlyArray<DefinitionEvent>; filter: string }) {
  const items = events.filter(event => matches(filter, event.name, event.description, event.detailType));
  return (
    <Table
      variant="embedded"
      wrapLines={true}
      caption="Events"
      trackBy="name"
      items={items}
      ariaLabels={{ tableLabel: 'Events' }}
      empty={<Box color="text-body-secondary">No event matches the filter.</Box>}
      columnDefinitions={[
        {
          id: 'name',
          header: 'Name and detail',
          cell: event => (
            <div className={styles.signature}>
              <Name name={event.name} />
              {event.detailType && event.detailType !== 'null' && (
                <code className={styles['type-name']}>{event.detailType}</code>
              )}
              {event.cancelable && <Badge tone="neutral">Cancelable</Badge>}
            </div>
          ),
          width: '36%',
        },
        { id: 'description', header: 'Description', cell: event => <Description source={event.description} /> },
      ]}
    />
  );
}

const signatureOf = (fn: DefinitionFunction) =>
  `${fn.name}(${fn.parameters.map(parameter => `${parameter.name}: ${parameter.type}`).join(', ')}): ${fn.returnType}`;

function FunctionsTable({ functions, filter }: { functions: ReadonlyArray<DefinitionFunction>; filter: string }) {
  const items = functions.filter(fn => matches(filter, fn.name, fn.description));
  return (
    <Table
      variant="embedded"
      wrapLines={true}
      caption="Ref functions"
      trackBy="name"
      items={items}
      ariaLabels={{ tableLabel: 'Ref functions' }}
      empty={<Box color="text-body-secondary">No function matches the filter.</Box>}
      columnDefinitions={[
        {
          id: 'signature',
          header: 'Signature',
          cell: fn => <code className={styles['type-name']}>{signatureOf(fn)}</code>,
          width: '36%',
        },
        { id: 'description', header: 'Description', cell: fn => <Description source={fn.description} /> },
      ]}
    />
  );
}

/** Loads a definition once per page. `undefined` while loading, `null` when there is none. */
export function useDefinition(load: () => Promise<Definition | null>, key: string) {
  // The loaded definition is kept with the key it belongs to, so a page never shows another's.
  const [loaded, setLoaded] = useState<{ key: string; definition: Definition | null } | null>(null);
  useEffect(() => {
    let current = true;
    load().then(
      definition => current && setLoaded({ key, definition }),
      () => current && setLoaded({ key, definition: null })
    );
    return () => {
      current = false;
    };
    // The loader changes identity on every render; the key says when it is really another one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return loaded?.key === key ? loaded.definition : undefined;
}

/**
 * The API of a component, drawn as schedules: properties, regions (props that take content),
 * events and the functions reachable through a ref. A filter narrows all four at once.
 */
export function ApiReference({ definition, name }: { definition: Definition; name: string }) {
  const [filter, setFilter] = useState('');
  const count =
    definition.properties.length + definition.regions.length + definition.events.length + definition.functions.length;
  const shown = [
    definition.properties.filter(p => matches(filter, p.name, p.description, p.type)).length,
    definition.regions.filter(r => matches(filter, r.name, r.description)).length,
    definition.events.filter(e => matches(filter, e.name, e.description, e.detailType)).length,
    definition.functions.filter(f => matches(filter, f.name, f.description)).length,
  ].reduce((a, b) => a + b, 0);

  return (
    <SpaceBetween size="xl">
      <TextFilter
        filteringText={filter}
        filteringPlaceholder={`Find in the ${count} entries of ${name}`}
        filteringAriaLabel={`Find a property, region, event or function of ${name}`}
        filteringClearAriaLabel="Clear"
        countText={filter ? `${shown} of ${count}` : undefined}
        onChange={event => setFilter(event.detail.filteringText)}
      />
      {definition.properties.length > 0 && <PropertiesTable properties={definition.properties} filter={filter} />}
      {definition.regions.length > 0 && <RegionsTable regions={definition.regions} filter={filter} />}
      {definition.events.length > 0 && <EventsTable events={definition.events} filter={filter} />}
      {definition.functions.length > 0 && <FunctionsTable functions={definition.functions} filter={filter} />}
    </SpaceBetween>
  );
}
