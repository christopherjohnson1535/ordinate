// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AttributeEditor, { AttributeEditorProps } from '~components/attribute-editor';
import Input from '~components/input';
import Link from '~components/link';
import Select, { SelectProps } from '~components/select';

import styles from './styles.module.scss';

interface Variable {
  name: string;
  value: string;
  managed?: boolean;
}

interface PortRule {
  protocol: SelectProps.Option | null;
  port: string;
  description: string;
}

const protocols: SelectProps.Option[] = [
  { value: 'tcp', label: 'TCP' },
  { value: 'udp', label: 'UDP' },
];

function useRows<T>(initial: T[], blank: T) {
  const [items, setItems] = useState(initial);
  return {
    items,
    update: (index: number, change: Partial<T>) =>
      setItems(items.map((item, i) => (i === index ? { ...item, ...change } : item))),
    onAddButtonClick: () => setItems([...items, blank]),
    onRemoveButtonClick: (event: { detail: AttributeEditorProps.RemoveButtonClickDetail }) =>
      setItems(items.filter((_, index) => index !== event.detail.itemIndex)),
  };
}

const variableLimit = 4;

function Variables({ initial }: { initial: Variable[] }) {
  const { items, update, ...handlers } = useRows<Variable>(initial, { name: '', value: '' });
  const remaining = variableLimit - items.length;
  return (
    <AttributeEditor<Variable>
      {...handlers}
      items={items}
      definition={[
        {
          label: 'Name',
          control: (item, index) => (
            <Input
              value={item.name}
              placeholder="VARIABLE_NAME"
              readOnly={item.managed}
              onChange={event => update(index, { name: event.detail.value })}
            />
          ),
          errorText: item => (/^[A-Z0-9_]*$/.test(item.name) ? undefined : 'Use capital letters, digits and _.'),
        },
        {
          label: 'Value',
          info: <Link variant="info">Info</Link>,
          control: (item, index) => (
            <Input value={item.value} onChange={event => update(index, { value: event.detail.value })} />
          ),
          warningText: item => (item.value.startsWith('http://') ? 'Prefer https:// for URLs.' : undefined),
        },
      ]}
      addButtonText="Add variable"
      removeButtonAriaLabel={item => `Remove variable ${item.name}`}
      isItemRemovable={item => !item.managed}
      disableAddButton={remaining <= 0}
      additionalInfo={
        remaining > 0 ? `You can add ${remaining} more.` : `You have reached the limit of ${variableLimit} variables.`
      }
      empty="No environment variables."
    />
  );
}

function PortRules() {
  const { items, update, ...handlers } = useRows<PortRule>(
    [
      { protocol: protocols[0], port: '443', description: 'Public HTTPS' },
      { protocol: protocols[1], port: '53', description: '' },
    ],
    { protocol: null, port: '', description: '' }
  );
  return (
    <AttributeEditor<PortRule>
      {...handlers}
      items={items}
      definition={[
        {
          label: 'Protocol',
          control: (item, index) => (
            <Select
              selectedOption={item.protocol}
              options={protocols}
              placeholder="Choose"
              onChange={event => update(index, { protocol: event.detail.selectedOption })}
            />
          ),
        },
        {
          label: 'Port',
          control: (item, index) => (
            <Input
              value={item.port}
              inputMode="numeric"
              onChange={event => update(index, { port: event.detail.value })}
            />
          ),
          errorText: item => (item.port === '' || /^\d+$/.test(item.port) ? undefined : 'Enter a number.'),
          constraintText: () => '1 to 65535',
        },
        {
          label: 'Description',
          control: (item, index) => (
            <Input value={item.description} onChange={event => update(index, { description: event.detail.value })} />
          ),
        },
      ]}
      gridLayout={[{ rows: [[1, 1], [1]] }, { breakpoint: 'xs', rows: [[1, 1, 2]] }]}
      addButtonText="Add rule"
    />
  );
}

export default function AttributeEditorPermutations() {
  return (
    <article className={styles.page}>
      <h1>Attribute editor</h1>
      <section className={styles.section}>
        <h2>Columns, with a managed row and a limit</h2>
        <Variables
          initial={[
            { name: 'REGION', value: 'east-1', managed: true },
            { name: 'CALLBACK_URL', value: 'http://example.com/hook' },
            { name: 'log level', value: 'debug' },
          ]}
        />
      </section>
      <section className={styles.section}>
        <h2>Custom grid layout</h2>
        <PortRules />
      </section>
      <div className={styles.columns}>
        <section className={styles.section}>
          <h2>Narrow container</h2>
          <div className={styles.narrow}>
            <Variables
              initial={[
                { name: 'STAGE', value: 'beta' },
                { name: '', value: '' },
              ]}
            />
          </div>
        </section>
        <section className={styles.section}>
          <h2>Empty</h2>
          <Variables initial={[]} />
        </section>
      </div>
    </article>
  );
}
