// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Calendar from '~components/calendar';
import DateInput from '~components/date-input';
import DatePicker from '~components/date-picker';
import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import FileDropzone from '~components/file-dropzone';
import FileInput from '~components/file-input';
import FileTokenGroup, { FileTokenGroupProps } from '~components/file-token-group';
import FileUpload from '~components/file-upload';
import FormField from '~components/form-field';
import Icon from '~components/icon';
import TimeInput from '~components/time-input';

import { Cell, Group, Readout } from './specimen';

// Fixed dates keep the screenshots the same from one day to the next.
const lastModified = new Date(2026, 9, 28, 16, 40).getTime();

const sitePlan = new File(['site plan'.repeat(240_000)], 'site-plan-rev-2.pdf', {
  type: 'application/pdf',
  lastModified,
});
const elevation = new File(['elevation'.repeat(52_000)], 'south-elevation.dwg', {
  type: 'application/acad',
  lastModified,
});

const relativeOptions: DateRangePickerProps.RelativeOption[] = [
  { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
  { key: 'previous-6-hours', amount: 6, unit: 'hour', type: 'relative' },
  { key: 'previous-7-days', amount: 7, unit: 'day', type: 'relative' },
];

const isValidRange = (range: DateRangePickerProps.Value | null): DateRangePickerProps.ValidationResult =>
  range ? { valid: true } : { valid: false, errorMessage: 'Choose a range.' };

function CalendarSpecimen() {
  const [value, setValue] = useState('2026-11-14');
  return (
    <>
      <Calendar value={value} onChange={event => setValue(event.detail.value)} ariaLabel="Site visit" />
      <Readout>Site visit on {value}</Readout>
    </>
  );
}

function DateInputSpecimen() {
  const [value, setValue] = useState('2026/11/14');
  return (
    <FormField label="Tender closes" constraintText="YYYY/MM/DD">
      <DateInput value={value} onChange={event => setValue(event.detail.value)} placeholder="YYYY/MM/DD" />
    </FormField>
  );
}

function DatePickerSpecimen() {
  const [value, setValue] = useState('2026-11-06');
  return (
    <FormField label="Collection date" constraintText="YYYY/MM/DD">
      <DatePicker
        value={value}
        onChange={event => setValue(event.detail.value)}
        placeholder="YYYY/MM/DD"
        openCalendarAriaLabel="Choose a collection date"
        isDateEnabled={date => date.getDay() !== 1}
        dateDisabledReason={() => 'The workshop is closed on Mondays.'}
      />
    </FormField>
  );
}

function DateRangePickerSpecimen() {
  const [value, setValue] = useState<DateRangePickerProps.Value | null>({
    type: 'relative',
    key: 'previous-6-hours',
    amount: 6,
    unit: 'hour',
  });
  return (
    <FormField label="Log window">
      <DateRangePicker
        value={value}
        onChange={event => setValue(event.detail.value)}
        relativeOptions={relativeOptions}
        isValidRange={isValidRange}
        placeholder="Filter by a date and time range"
      />
    </FormField>
  );
}

function TimeInputSpecimen() {
  const [value, setValue] = useState('09:30');
  return (
    <FormField label="Drop-off time" constraintText="24-hour clock, hh:mm">
      <TimeInput value={value} onChange={event => setValue(event.detail.value)} format="hh:mm" placeholder="hh:mm" />
    </FormField>
  );
}

function FileDropzoneSpecimen() {
  const [dropped, setDropped] = useState<File[]>([]);
  return (
    <>
      <FileDropzone onChange={event => setDropped(event.detail.value)}>
        <Icon name="upload" size="medium" />
        <Box variant="strong">Drop drawings here</Box>
        <Box variant="small" color="text-body-secondary">
          PDF or DWG, up to 10 MB each
        </Box>
      </FileDropzone>
      <Readout>{dropped.length > 0 ? dropped.map(file => file.name).join(', ') : 'Nothing dropped yet'}</Readout>
    </>
  );
}

function FileInputSpecimen() {
  const [value, setValue] = useState<ReadonlyArray<File>>([]);
  return (
    <FormField label="Photo of the damage">
      <FileInput value={value} onChange={event => setValue(event.detail.value)} accept="image/*">
        Choose a photo
      </FileInput>
      <Readout>{value.length > 0 ? value.map(file => file.name).join(', ') : 'No photo chosen'}</Readout>
    </FormField>
  );
}

function FileTokenGroupSpecimen() {
  const [items, setItems] = useState<FileTokenGroupProps.Item[]>([
    { file: sitePlan },
    { file: elevation, warningText: 'Converted to PDF on upload.' },
  ]);
  return (
    <FileTokenGroup
      items={items}
      showFileSize={true}
      showFileLastModified={true}
      ariaLabel="Drawings"
      onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.fileIndex))}
    />
  );
}

function FileUploadSpecimen() {
  const [value, setValue] = useState<ReadonlyArray<File>>([sitePlan]);
  return (
    <FormField label="Tender drawings" description="Attach every sheet of the set.">
      <FileUpload
        value={value}
        onChange={event => setValue(event.detail.value)}
        multiple={true}
        accept=".pdf,.dwg"
        showFileSize={true}
        constraintText="PDF or DWG, up to 10 MB each"
        i18nStrings={{ uploadButtonText: 'Choose files' }}
      />
    </FormField>
  );
}

export default function DatesAndFilesGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Dates and files">
      <Cell name="Calendar">
        <CalendarSpecimen />
      </Cell>
      <Cell name="DateInput">
        <DateInputSpecimen />
      </Cell>
      <Cell name="DatePicker" note="Mondays are closed.">
        <DatePickerSpecimen />
      </Cell>
      <Cell name="DateRangePicker">
        <DateRangePickerSpecimen />
      </Cell>
      <Cell name="TimeInput">
        <TimeInputSpecimen />
      </Cell>
      <Cell name="FileDropzone">
        <FileDropzoneSpecimen />
      </Cell>
      <Cell name="FileInput">
        <FileInputSpecimen />
      </Cell>
      <Cell name="FileTokenGroup">
        <FileTokenGroupSpecimen />
      </Cell>
      <Cell name="FileUpload">
        <FileUploadSpecimen />
      </Cell>
    </Group>
  );
}
