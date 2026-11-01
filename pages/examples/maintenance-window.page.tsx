// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '~components/alert';
import Button from '~components/button';
import Container from '~components/container';
import ControlGroup from '~components/control-group';
import DatePicker from '~components/date-picker';
import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import FileUpload from '~components/file-upload';
import Form from '~components/form';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import TagEditor, { TagEditorProps } from '~components/tag-editor';
import TimeInput from '~components/time-input';

const units: SelectProps.Option[] = [
  { value: 'minutes', label: 'minutes' },
  { value: 'hours', label: 'hours' },
];

const relativeOptions: DateRangePickerProps.RelativeOption[] = [
  { key: 'next-7-days', amount: 7, unit: 'day', type: 'relative' },
  { key: 'next-30-days', amount: 30, unit: 'day', type: 'relative' },
];

const maxFileSize = 5 * 1000 * 1000;
const isWeekday = (date: Date) => date.getDay() !== 0 && date.getDay() !== 6;

// The phase 4 gate: a form built from the date, time, file and tag controls. Browser tests and an
// in-browser axe pass run against it in test/browser/maintenance-window.spec.ts.
export default function MaintenanceWindow() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('2');
  const [unit, setUnit] = useState<SelectProps.Option>(units[1]);
  const [freeze, setFreeze] = useState<DateRangePickerProps.Value | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<ReadonlyArray<TagEditorProps.Tag>>([
    { key: 'team', value: 'platform', existing: true },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const fileErrors = files.map(file => (file.size > maxFileSize ? 'Files must be 5 MB or smaller.' : undefined));
  const errors = {
    date: !date ? 'Choose a start date.' : undefined,
    time: !/^\d{2}:\d{2}$/.test(time) ? 'Enter a start time as hh:mm.' : undefined,
    duration: !(Number(duration) > 0) ? 'Enter a duration greater than 0.' : undefined,
    files: fileErrors.some(Boolean) ? 'Remove the files that are too large.' : undefined,
  };
  const show = (error?: string) => (submitted ? error : undefined);
  const valid = !Object.values(errors).some(Boolean);

  const schedule = () => {
    setSubmitted(true);
    setScheduled(valid);
  };

  return (
    <form onSubmit={event => event.preventDefault()}>
      <Form
        header={
          <Header variant="h1" description="Nodes restart one at a time during the window.">
            Schedule maintenance
          </Header>
        }
        errorText={submitted && !valid ? 'Fix the highlighted fields before scheduling.' : undefined}
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none">Cancel</Button>
            <Button variant="primary" formAction="none" onClick={schedule}>
              Schedule
            </Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="l">
          {scheduled && (
            <Alert
              type="success"
              header="Maintenance scheduled"
              dismissible={true}
              onDismiss={() => setScheduled(false)}
            >
              {`Starts ${date} at ${time} and runs for ${duration} ${unit.label}.`}
            </Alert>
          )}

          <Container header={<Header description="Weekdays only.">Window</Header>}>
            <SpaceBetween size="l">
              <FormField label="Start date" constraintText="YYYY/MM/DD" errorText={show(errors.date)}>
                <DatePicker
                  value={date}
                  onChange={event => setDate(event.detail.value)}
                  isDateEnabled={isWeekday}
                  dateDisabledReason={() => 'Maintenance runs on weekdays only.'}
                  placeholder="YYYY/MM/DD"
                  openCalendarAriaLabel="Choose start date"
                />
              </FormField>
              <FormField label="Start time" constraintText="24-hour clock, hh:mm" errorText={show(errors.time)}>
                <TimeInput
                  value={time}
                  onChange={event => setTime(event.detail.value)}
                  format="hh:mm"
                  placeholder="hh:mm"
                />
              </FormField>
              <FormField label="Duration" errorText={show(errors.duration)}>
                <ControlGroup ariaLabel="Duration">
                  <Input type="number" value={duration} onChange={event => setDuration(event.detail.value)} />
                  <Select
                    options={units}
                    selectedOption={unit}
                    onChange={event => setUnit(event.detail.selectedOption)}
                    ariaLabel="Duration unit"
                  />
                </ControlGroup>
              </FormField>
              <FormField
                label="Change freeze"
                description="No other deployments run during this range."
                info={<span>Optional</span>}
              >
                <DateRangePicker
                  value={freeze}
                  onChange={event => setFreeze(event.detail.value)}
                  relativeOptions={relativeOptions}
                  dateOnly={true}
                  showClearButton={true}
                  placeholder="Choose a range"
                />
              </FormField>
            </SpaceBetween>
          </Container>

          <Container header={<Header>Runbook and labels</Header>}>
            <SpaceBetween size="l">
              <FormField label="Runbook" description="Attach the steps the on-call engineer follows.">
                <FileUpload
                  value={files}
                  onChange={event => setFiles([...event.detail.value])}
                  multiple={true}
                  accept=".md,.pdf,.txt"
                  showFileSize={true}
                  showFileLastModified={true}
                  fileErrors={fileErrors}
                  constraintText="Markdown, PDF or text, up to 5 MB each."
                  errorText={show(errors.files)}
                />
              </FormField>
              <FormField label="Labels">
                <TagEditor tags={tags} onChange={event => setTags(event.detail.tags)} tagLimit={10} />
              </FormField>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      </Form>
    </form>
  );
}
