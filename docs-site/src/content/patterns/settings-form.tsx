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
    id: 'settings-form',
    title: 'Project settings',
    description: (
      <p>
        The whole page, running. Change the name to include a capital letter or set the nodes to 0, then choose Save
        changes to see the errors; set more than 50 nodes for a warning.
      </p>
    ),
    layout: 'flush',
    height: 'tall',
  },
  load: onSheet(() => import('../../../../pages/examples/settings-form.page')),
  loadSource: () => import('../../../../pages/examples/settings-form.page.tsx?raw').then(module => module.default),
};

const parts: ReadonlyArray<Part> = [
  {
    name: 'Form',
    folder: 'form',
    role: 'Opens the page with its header, holds the sections, and stands the actions and the form-wide error on a rule at its foot.',
  },
  {
    name: 'Header',
    folder: 'header',
    role: 'The page title, a description of when changes apply, and the project state at the end of the line.',
  },
  {
    name: 'StatusIndicator',
    folder: 'status-indicator',
    role: 'The project is running, set where an action would go.',
  },
  {
    name: 'Container',
    folder: 'container',
    role: 'Three sections, General, Capacity and Data, each with a heading in the margin.',
  },
  { name: 'Badge', folder: 'badge', role: 'Marks the Capacity section as beta, as its measure.' },
  {
    name: 'FormField',
    folder: 'form-field',
    role: 'The margin layout of every field, with descriptions, constraints, a warning and errors.',
  },
  { name: 'Input', folder: 'input', role: 'The project name, and the number of nodes as a number input.' },
  { name: 'Textarea', folder: 'textarea', role: 'The summary.' },
  { name: 'Select', folder: 'select', role: 'The region, with options grouped by continent.' },
  {
    name: 'RadioGroup',
    folder: 'radio-group',
    role: 'Standard or reserved billing: one of two, each with a sentence of description.',
  },
  {
    name: 'Toggle',
    folder: 'toggle',
    role: 'Automatic scaling, a setting that is on or off and takes effect without a further choice.',
  },
  { name: 'Checkbox', folder: 'checkbox', role: 'Encryption and nightly backups, two independent options.' },
  { name: 'Box', folder: 'box', role: 'A small secondary line under the backups option.' },
  { name: 'Alert', folder: 'alert', role: 'The note that the settings were saved, which the user can dismiss.' },
  { name: 'Link', folder: 'link', role: 'View change history, the secondary action of the form.' },
  { name: 'Button', folder: 'button', role: 'Cancel, and Save changes as the one primary action.' },
];

function Page() {
  return (
    <>
      <DocSection id="purpose" number={1} title="What the page is for">
        <Prose>
          <p>
            Editing the settings of something that already exists. The form is long enough to need sections but short
            enough to stay on one page, and it is saved in one go: there is no draft and no step to come back to.
          </p>
          <p>
            It is the reference for forms in Ordinate: the margin layout of{' '}
            <a href="#/components/form-field">FormField</a>, the choice controls side by side, and validation that waits
            until the user asks to save.
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
              <strong>Validate on save.</strong> The fields show errors only after the first Save changes, and from then
              on as the user types, so a fix is confirmed as soon as it is made.
            </>,
            <>
              <strong>Say it twice, in two places.</strong> Each invalid field says what is wrong with it, and the
              form&apos;s <code>errorText</code> by the buttons says that something is, for a user whose eyes are on the
              Save button.
            </>,
            <>
              <strong>A warning is not an error.</strong> More than 50 nodes is allowed but slow to start, so it is a{' '}
              <code>warningText</code> and saving still works.
            </>,
            <>
              <strong>Each choice gets the control that fits it.</strong> A toggle for a setting that is on or off,
              radio buttons for one of two plans that each need a sentence, checkboxes for options that do not depend on
              each other, a select for one of several regions.
            </>,
            <>
              <strong>Constraints are said before they are broken.</strong> The name field states its rule as{' '}
              <code>constraintText</code>, and the error repeats the same words.
            </>,
            <>
              <strong>The buttons do not submit the form.</strong> Both have <code>formAction=&quot;none&quot;</code>{' '}
              and the native form prevents its default submit, so pressing Enter in a field does not save half a change.
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
  slug: 'settings-form',
  title: 'Settings form',
  summary: 'An edit page in sections, with every kind of choice control and validation that waits for Save.',
  order: 3,
  keywords: ['Form', 'FormField', 'validation', 'errors', 'settings', 'edit page'],
  Page,
};

export default doc;
