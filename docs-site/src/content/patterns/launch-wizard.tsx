// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Example } from '../../parts/example';
import { DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';
import { Composition, Part } from './shared/composition';

const page: LoadedExample = {
  meta: {
    id: 'launch-wizard',
    title: 'Launch checklist',
    description: (
      <p>
        The whole page, running. Open the items in any order, choose Next on the first one with an empty name to see
        its error, or start the tutorial from the panel to have notes pinned to the fields.
      </p>
    ),
    layout: 'flush',
    height: 'tall',
  },
  load: () => import('../../../../pages/examples/launch-wizard.page'),
  loadSource: () => import('../../../../pages/examples/launch-wizard.page.tsx?raw').then(module => module.default),
};

const parts: ReadonlyArray<Part> = [
  {
    name: 'AnnotationContext',
    folder: 'annotation-context',
    role: 'Runs the tutorial: which one is active, which step is open, and when it is finished.',
  },
  {
    name: 'AppLayout',
    folder: 'app-layout',
    role: (
      <>
        <code>contentType=&quot;wizard&quot;</code> limits the width and opens the help panel; the navigation is hidden,
        because a launch is a task to finish, not a place to browse from.
      </>
    ),
  },
  {
    name: 'Wizard',
    folder: 'wizard',
    role: 'The default checklist variant: four items on one sheet, opened in any order, submitted from the footer.',
  },
  { name: 'Container', folder: 'container', role: 'The sheet of fields inside each item.' },
  {
    name: 'FormField',
    folder: 'form-field',
    role: 'Labels, descriptions, constraints and errors for every control.',
  },
  { name: 'Input', folder: 'input', role: 'The project name and the allowed address range.' },
  { name: 'Textarea', folder: 'textarea', role: 'The summary shown on the project overview.' },
  { name: 'Select', folder: 'select', role: 'One region out of three, each with its city as a description.' },
  {
    name: 'Tiles',
    folder: 'tiles',
    role: 'Standard or reserved: two choices that each need a sentence, so they are large targets with crop marks.',
  },
  { name: 'Checkbox', folder: 'checkbox', role: 'The public endpoint, off by default.' },
  { name: 'Multiselect', folder: 'multiselect', role: 'The teams paged when the project is unhealthy.' },
  {
    name: 'Hotspot',
    folder: 'hotspot',
    role: 'Marks the name field, the region field and the summary, so tutorial steps can point at them.',
  },
  {
    name: 'TutorialPanel',
    folder: 'tutorial-panel',
    role: 'The list of tutorials in the help panel, and the steps of the one that is running.',
  },
  {
    name: 'KeyValuePairs',
    folder: 'key-value-pairs',
    role: 'The summary beside the checklist, updated as the user fills the items.',
  },
  { name: 'Flashbar', folder: 'flashbar', role: 'The note that the project is launching, once it is.' },
];

function Page() {
  return (
    <>
      <DocSection id="purpose" number={1} title="What the page is for">
        <Prose>
          <p>
            Creating something that takes several decisions: a name, where it runs, how it is reached and who owns it.
            The page collects them on one checklist sheet rather than a row of steps, because the decisions do not
            depend on each other and people often come back to change one of them before they launch.
          </p>
          <p>
            Beside the sheet, a summary and a title block show what has been chosen so far. A tutorial in the help
            panel walks a first-time user through the three items that matter.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="parts" number={2} title="Parts" description="From the outside in.">
        <Composition parts={parts} />
      </DocSection>

      <DocSection id="decisions" number={3} title="Decisions">
        <Notes
          items={[
            <>
              <strong>Errors wait until an item is left.</strong> The page keeps a set of checked items. An item joins
              it when the user moves away from it, and only then does it show its errors, so nobody is told off for a
              field they have not reached.
            </>,
            <>
              <strong>Next validates; the item list does not.</strong> In <code>onNavigate</code>, a <code>next</code>{' '}
              from an invalid item stays put, but opening another item from the list always works. People can look
              ahead without being stopped.
            </>,
            <>
              <strong>Errors are counted as revisions.</strong> The checklist draws a revision cloud around each item
              with an <code>errorText</code> and counts them in its footer, and submitting waits until none is left.
              The title block beside the sheet repeats the count as open revisions.
            </>,
            <>
              <strong>Checked items fold to a summary.</strong> Each step sets <code>summary</code> from the draft, such
              as &quot;us-mountain-1 · Standard&quot;, so the folded sheet reads as a record of the choices.
            </>,
            <>
              <strong>Optional items say so.</strong> Networking and owners are <code>isOptional</code>: the project can
              launch without opening them, with private networking and no owners.
            </>,
            <>
              <strong>The tutorial reads the draft.</strong> Each tutorial step is built from the current values, so a
              step shows a warning while its field is still empty and loses it once the field is filled.
            </>,
            <>
              <strong>Cancel resets.</strong> Cancel clears the draft, the checked set and the open item, so the next
              launch starts clean.
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
  slug: 'launch-wizard',
  title: 'Launch wizard',
  summary: 'A create flow as a checklist sheet, with a running summary and a tutorial pinned to the fields.',
  order: 4,
  keywords: ['Wizard', 'checklist', 'AnnotationContext', 'TutorialPanel', 'Hotspot', 'create flow', 'validation'],
  Page,
};

export default doc;
