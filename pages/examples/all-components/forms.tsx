// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AttributeEditor from '~components/attribute-editor';
import Autosuggest from '~components/autosuggest';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import CodeEditor, { CodeEditorProps } from '~components/code-editor';
import ControlGroup from '~components/control-group';
import Form from '~components/form';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import PromptInput from '~components/prompt-input';
import RadioButton from '~components/radio-button';
import RadioGroup from '~components/radio-group';
import Select, { SelectProps } from '~components/select';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';
import TagEditor, { TagEditorProps } from '~components/tag-editor';
import Textarea from '~components/textarea';
import Tiles from '~components/tiles';
import Toggle from '~components/toggle';

import { Cell, Group, Readout } from './specimen';

const zones: SelectProps.Options = [
  { label: 'us-mountain-1a', value: 'us-mountain-1a', description: 'Denver' },
  { label: 'us-mountain-1b', value: 'us-mountain-1b', description: 'Denver' },
  { label: 'us-coast-2a', value: 'us-coast-2a', description: 'Portland' },
];

const units: SelectProps.Options = [
  { label: 'GiB', value: 'GiB' },
  { label: 'TiB', value: 'TiB' },
];

interface Variable {
  name: string;
  value: string;
}

function AttributeEditorSpecimen() {
  const [items, setItems] = useState<Variable[]>([
    { name: 'REGION', value: 'us-mountain-1' },
    { name: 'LOG_LEVEL', value: 'info' },
  ]);
  const update = (index: number, change: Partial<Variable>) =>
    setItems(current => current.map((item, i) => (i === index ? { ...item, ...change } : item)));
  return (
    <AttributeEditor<Variable>
      items={items}
      addButtonText="Add variable"
      removeButtonText="Remove"
      onAddButtonClick={() => setItems(current => [...current, { name: '', value: '' }])}
      onRemoveButtonClick={event => setItems(current => current.filter((_, i) => i !== event.detail.itemIndex))}
      empty="No environment variables."
      definition={[
        {
          label: 'Name',
          control: (item, index) => (
            <Input value={item.name} onChange={event => update(index, { name: event.detail.value })} />
          ),
        },
        {
          label: 'Value',
          control: (item, index) => (
            <Input value={item.value} onChange={event => update(index, { value: event.detail.value })} />
          ),
        },
      ]}
    />
  );
}

function AutosuggestSpecimen() {
  const [value, setValue] = useState('');
  return (
    <FormField label="Bike brand" description="Start typing; pick a suggestion or keep your own.">
      <Autosuggest
        value={value}
        onChange={event => setValue(event.detail.value)}
        options={[
          { value: 'Brompton' },
          { value: 'Dawes' },
          { value: 'Pashley' },
          { value: 'Raleigh' },
          { value: 'Surly' },
        ]}
        placeholder="Brompton, Dawes, Pashley…"
        enteredTextLabel={text => `Use "${text}"`}
        empty="No brands match"
      />
    </FormField>
  );
}

function CheckboxSpecimen() {
  const [lights, setLights] = useState(true);
  const [mudguards, setMudguards] = useState(false);
  return (
    <SpaceBetween size="xs">
      <Checkbox checked={lights} onChange={event => setLights(event.detail.checked)} description="Front and rear, USB">
        Fit lights
      </Checkbox>
      <Checkbox checked={mudguards} onChange={event => setMudguards(event.detail.checked)}>
        Fit mudguards
      </Checkbox>
    </SpaceBetween>
  );
}

const pipeline = `service: atrium-api
image: api:v7
nodes:
  min: 4
  max: 8   # keep headroom for month-end reports
rollout:
  maxUnavailable: 0
  maxSurge: 1
`;

function CodeEditorSpecimen() {
  const [value, setValue] = useState(pipeline);
  const [preferences, setPreferences] = useState<CodeEditorProps.Preferences>({ wrapLines: true, theme: 'auto' });
  return (
    <CodeEditor
      ariaLabel="Service definition for atrium-api"
      language="yaml"
      value={value}
      onChange={event => setValue(event.detail.value)}
      preferences={preferences}
      onPreferencesChange={event => setPreferences(event.detail)}
      editorContentHeight={200}
    />
  );
}

function ControlGroupSpecimen() {
  const [size, setSize] = useState('500');
  const [unit, setUnit] = useState<SelectProps.Option | null>(units[0]);
  return (
    <FormField label="Volume size" description="A number and its unit, side by side.">
      <ControlGroup>
        <Input type="number" inputMode="numeric" value={size} onChange={event => setSize(event.detail.value)} />
        <Select
          selectedOption={unit}
          onChange={event => setUnit(event.detail.selectedOption)}
          options={units}
          ariaLabel="Size unit"
        />
      </ControlGroup>
    </FormField>
  );
}

function FormSpecimen() {
  const [name, setName] = useState('Hut No. 3');
  const [saved, setSaved] = useState(false);
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <Form
        header={<Header headingTagOverride="h4">Project details</Header>}
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link" onClick={() => setSaved(false)}>
              Cancel
            </Button>
            <Button variant="primary">Save</Button>
          </SpaceBetween>
        }
      >
        <FormField label="Project name">
          <Input value={name} onChange={event => setName(event.detail.value)} />
        </FormField>
      </Form>
      {saved && <Readout>Saved {name}</Readout>}
    </form>
  );
}

function FormFieldSpecimen() {
  const [email, setEmail] = useState('dana@annex');
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return (
    <FormField
      label="Contact email"
      description="Where we send the quote."
      constraintText="We never share it."
      errorText={valid ? undefined : 'Enter an email address like name@example.com.'}
    >
      <Input type="email" value={email} onChange={event => setEmail(event.detail.value)} />
    </FormField>
  );
}

function InputSpecimen() {
  const [value, setValue] = useState('north-annex-web');
  return (
    <FormField label="Service name">
      <Input value={value} onChange={event => setValue(event.detail.value)} />
    </FormField>
  );
}

function MultiselectSpecimen() {
  const [selected, setSelected] = useState<MultiselectProps.Options>([zones[0], zones[2]]);
  return (
    <FormField label="Zones">
      <Multiselect
        selectedOptions={selected}
        onChange={event => setSelected(event.detail.selectedOptions)}
        options={zones}
        placeholder="Choose zones"
      />
    </FormField>
  );
}

function PromptInputSpecimen() {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  return (
    <FormField label="Ask the workshop" description="Enter sends, Shift+Enter adds a line.">
      <PromptInput
        value={value}
        onChange={event => setValue(event.detail.value)}
        onAction={event => {
          setSent(event.detail.value);
          setValue('');
        }}
        placeholder="Can you fit a dynamo hub by Friday?"
        actionButtonIconName="send"
        actionButtonAriaLabel="Send"
      />
      {sent && <Readout>Sent: {sent}</Readout>}
    </FormField>
  );
}

function RadioButtonSpecimen() {
  const [value, setValue] = useState('collect');
  return (
    <div role="radiogroup" aria-label="Handover">
      <SpaceBetween size="xs">
        <RadioButton name="handover" value="collect" checked={value === 'collect'} onSelect={() => setValue('collect')}>
          Collect from the shop
        </RadioButton>
        <RadioButton name="handover" value="deliver" checked={value === 'deliver'} onSelect={() => setValue('deliver')}>
          Deliver to my door
        </RadioButton>
      </SpaceBetween>
    </div>
  );
}

function RadioGroupSpecimen() {
  const [value, setValue] = useState('standard');
  return (
    <FormField label="Service level">
      <RadioGroup
        value={value}
        onChange={event => setValue(event.detail.value)}
        items={[
          { value: 'standard', label: 'Standard', description: 'Ready in three days' },
          { value: 'same-day', label: 'Same day', description: 'Drop off before ten' },
        ]}
      />
    </FormField>
  );
}

function SelectSpecimen() {
  const [zone, setZone] = useState<SelectProps.Option | null>(zones[0]);
  return (
    <FormField label="Zone">
      <Select selectedOption={zone} onChange={event => setZone(event.detail.selectedOption)} options={zones} />
    </FormField>
  );
}

function SliderSpecimen() {
  const [nodes, setNodes] = useState(6);
  return (
    <FormField label="Nodes for atrium-api" description={`${nodes} of 12`}>
      <Slider
        value={nodes}
        min={0}
        max={12}
        step={1}
        tickMarks={true}
        onChange={event => setNodes(event.detail.value)}
      />
    </FormField>
  );
}

function TagEditorSpecimen() {
  const [tags, setTags] = useState<ReadonlyArray<TagEditorProps.Tag>>([
    { key: 'team', value: 'drafting', existing: true },
    { key: 'cost-centre', value: 'annex-04', existing: true },
  ]);
  return (
    <TagEditor
      tags={tags}
      onChange={event => setTags(event.detail.tags)}
      i18nStrings={{ keyHeader: 'Key', valueHeader: 'Value', addButton: 'Add tag', removeButton: 'Remove' }}
    />
  );
}

function TextareaSpecimen() {
  const [value, setValue] = useState('Rear brake squeals in the wet. Pads replaced in March.');
  return (
    <FormField label="What needs fixing?">
      <Textarea value={value} rows={3} onChange={event => setValue(event.detail.value)} />
    </FormField>
  );
}

function TilesSpecimen() {
  const [value, setValue] = useState<string | null>('book');
  return (
    <FormField label="How would you like to drop off your bike?">
      <Tiles
        value={value}
        onChange={event => setValue(event.detail.value)}
        columns={2}
        items={[
          { value: 'walk-in', label: 'Walk in', description: 'Any time we are open.' },
          { value: 'book', label: 'Book a slot', description: 'Pick a time online.' },
        ]}
      />
    </FormField>
  );
}

function ToggleSpecimen() {
  const [checked, setChecked] = useState(true);
  return (
    <Toggle
      checked={checked}
      onChange={event => setChecked(event.detail.checked)}
      description="Text me when it is ready"
    >
      Repair updates by text
    </Toggle>
  );
}

export default function FormsGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Forms">
      <Cell name="AttributeEditor" wide={true}>
        <AttributeEditorSpecimen />
      </Cell>
      <Cell name="Autosuggest">
        <AutosuggestSpecimen />
      </Cell>
      <Cell name="Checkbox">
        <CheckboxSpecimen />
      </Cell>
      <Cell name="CodeEditor" wide={true}>
        <CodeEditorSpecimen />
      </Cell>
      <Cell name="ControlGroup">
        <ControlGroupSpecimen />
      </Cell>
      <Cell name="Form">
        <FormSpecimen />
      </Cell>
      <Cell name="FormField">
        <FormFieldSpecimen />
      </Cell>
      <Cell name="Input">
        <InputSpecimen />
      </Cell>
      <Cell name="Multiselect">
        <MultiselectSpecimen />
      </Cell>
      <Cell name="PromptInput">
        <PromptInputSpecimen />
      </Cell>
      <Cell name="RadioButton">
        <RadioButtonSpecimen />
      </Cell>
      <Cell name="RadioGroup">
        <RadioGroupSpecimen />
      </Cell>
      <Cell name="Select">
        <SelectSpecimen />
      </Cell>
      <Cell name="Slider">
        <SliderSpecimen />
      </Cell>
      <Cell name="TagEditor" wide={true}>
        <TagEditorSpecimen />
      </Cell>
      <Cell name="Textarea">
        <TextareaSpecimen />
      </Cell>
      <Cell name="Tiles">
        <TilesSpecimen />
      </Cell>
      <Cell name="Toggle">
        <ToggleSpecimen />
      </Cell>
    </Group>
  );
}
