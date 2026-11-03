// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Example } from '../../parts/example';
import { DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';
import { Composition, Part } from './shared/composition';
import { onSheet } from './shared/on-sheet';

const page: LoadedExample = {
  meta: {
    id: 'maintenance-window',
    title: 'Schedule maintenance',
    description: (
      <p>
        The whole page, running. Choose Schedule with the form empty to see every error, then pick a weekday, type a
        time such as 0230, and attach a runbook. Weekend days in the calendar are hatched, with the reason in words.
      </p>
    ),
    layout: 'flush',
    height: 'tall',
  },
  load: onSheet(() => import('../../../../pages/examples/maintenance-window.page')),
  loadSource: () => import('../../../../pages/examples/maintenance-window.page.tsx?raw').then(module => module.default),
};

const parts: ReadonlyArray<Part> = [
  {
    name: 'Form',
    folder: 'form',
    role: 'Holds the two sections and stands Cancel and Schedule, with the form-wide error, at its foot.',
  },
  { name: 'Header', folder: 'header', role: 'The page title and what happens during the window.' },
  { name: 'Container', folder: 'container', role: 'Window, then Runbook and labels.' },
  { name: 'FormField', folder: 'form-field', role: 'The label, format hint and error of every control.' },
  {
    name: 'DatePicker',
    folder: 'date-picker',
    role: (
      <>
        The start date. <code>isDateEnabled</code> allows weekdays only and <code>dateDisabledReason</code> says why the
        others are hatched.
      </>
    ),
  },
  {
    name: 'TimeInput',
    folder: 'time-input',
    role: 'The start time, masked to hh:mm on a 24-hour clock, so the separator is typed for the user.',
  },
  {
    name: 'ControlGroup',
    folder: 'control-group',
    role: 'Joins the duration and its unit into one control with one name.',
  },
  { name: 'Input', folder: 'input', role: 'The duration, as a number.' },
  { name: 'Select', folder: 'select', role: 'Minutes or hours, the unit of the duration.' },
  {
    name: 'DateRangePicker',
    folder: 'date-range-picker',
    role: 'An optional change freeze: an absolute range of dates, or the next 7 or 30 days, with a clear button.',
  },
  {
    name: 'FileUpload',
    folder: 'file-upload',
    role: 'The runbook: several files of three types, with sizes, dates and an error on each file that is too large.',
  },
  {
    name: 'TagEditor',
    folder: 'tag-editor',
    role: 'Labels as key and value, with the existing team tag kept until the change is saved.',
  },
  { name: 'Alert', folder: 'alert', role: 'Confirms the window in one sentence once it is scheduled.' },
  { name: 'Button', folder: 'button', role: 'Cancel, and Schedule as the primary action.' },
];

function Page() {
  return (
    <>
      <DocSection id="purpose" number={1} title="What the page is for">
        <Prose>
          <p>
            Booking a time for work that interrupts a service: when it starts, how long it runs, what else must wait,
            and what the on-call engineer needs on hand. It gathers the date, time, file and tag controls on one form,
            each in the job it is built for.
          </p>
          <p>
            Browser tests and an automated accessibility check run against this page in the repository, so it is also
            the reference for how these controls are labelled and announced together.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="parts" number={2} title="Parts" description="In the order they appear, from the top of the page.">
        <Composition parts={parts} />
      </DocSection>

      <DocSection id="decisions" number={3} title="Decisions">
        <Notes
          items={[
            <>
              <strong>Rules become disabled days, not errors.</strong> Maintenance runs on weekdays, so weekend days
              cannot be picked at all. The reason is given in words, because hatching alone does not say why.
            </>,
            <>
              <strong>Formats are shown before they are needed.</strong> Each date and time field gives its format as{' '}
              <code>constraintText</code> and as the placeholder, and the error message names the same format.
            </>,
            <>
              <strong>A value and its unit are one control.</strong> ControlGroup keeps the number and the unit together
              and names them once, &quot;Duration&quot;, while the unit select keeps its own label for screen readers.
            </>,
            <>
              <strong>File problems are reported per file.</strong> A file over 5 MB gets its own error in{' '}
              <code>fileErrors</code>, and the field says what to do: remove the files that are too large.
            </>,
            <>
              <strong>Optional is said in words.</strong> The change freeze is optional, and its field says so in the{' '}
              <code>info</code> slot rather than with an asterisk on the others.
            </>,
            <>
              <strong>The confirmation repeats the choices.</strong> Once scheduled, the alert reads the date, time and
              duration back, so the user can see at once that what was booked is what they meant.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="page" number={4} title="The page">
        <Example example={page} index={1} />
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'maintenance-window',
  title: 'Maintenance window',
  summary: 'A scheduling form built from the date, time, file and tag controls, with rules shown as disabled days.',
  order: 5,
  keywords: ['DatePicker', 'TimeInput', 'DateRangePicker', 'FileUpload', 'TagEditor', 'ControlGroup', 'schedule'],
  Page,
};

export default doc;
