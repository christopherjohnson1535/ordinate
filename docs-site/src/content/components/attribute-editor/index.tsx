// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'AttributeEditor',
  folder: 'attribute-editor',
  group: 'forms',
  summary: 'Edits a list of items that share the same fields, such as environment variables or port rules.',
  description: (
    <>
      <p>
        An attribute editor sets its rows as a schedule on a drawing. When every field of a row fits on one line, the
        labels are lettered once as column headings in mono capitals on an ink rule, and a hairline separates the rows.
        On a narrow editor the fields stack, each with its own label, and a hairline separates one row from the next.
      </p>
      <p>
        The editor is controlled: add and remove items in <code>onAddButtonClick</code> and{' '}
        <code>onRemoveButtonClick</code>, and update them from the controls' own events. Each control sits in a form
        field, so it picks up its label and messages from the field's <code>definition</code>.
      </p>
    </>
  ),
  marks: ['M1'],
  examples: [
    {
      id: 'basic',
      title: 'Key and value',
      description: (
        <p>
          Each entry of <code>definition</code> is a column with a <code>label</code> and a <code>control</code>{' '}
          function that renders the control for an item. Add a row, and focus moves to its first control.
        </p>
      ),
    },
    {
      id: 'validation',
      title: 'Validation, fixed rows and a limit',
      description: (
        <p>
          <code>errorText</code>, <code>warningText</code> and <code>constraintText</code> are functions of the item.{' '}
          <code>isItemRemovable</code> hides the remove button of rows that must stay. At the limit, set{' '}
          <code>disableAddButton</code> and say why in <code>additionalInfo</code>.
        </p>
      ),
    },
    {
      id: 'grid-layout',
      title: 'Custom grid layout',
      description: (
        <p>
          <code>gridLayout</code> sets the fields' relative widths at each width of the editor. Here the description is
          three times as wide as the others on wide editors, and goes onto its own line on narrow ones.
        </p>
      ),
    },
    {
      id: 'empty',
      title: 'Empty',
      description: (
        <p>
          While <code>items</code> is empty, the editor shows <code>empty</code> in place of the rows. Say what having
          no items means.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a list of a few to a few dozen items that the user creates and edits in a form.',
      'For pairs such as keys and values, headers, or rules with two to four fields.',
    ],
    avoid: [
      <>
        For tags on a resource. Use a <a href="#/components/tag-editor">TagEditor</a>, which knows about tag keys and
        values.
      </>,
      <>
        For many items, or items the user mostly reads. Use a <a href="#/components/table">Table</a> with an edit
        action.
      </>,
      'For items with more than four fields. Edit each item in its own form or modal.',
    ],
    writing: [
      'Write the add button as "Add" and the singular noun: "Add variable", "Add rule".',
      'Write empty as a sentence about the current state: "survey-api sends no extra headers."',
      'Put limits in additionalInfo before they are reached: "You can add 2 more tags."',
    ],
  },
  accessibility: [
    'The rows are a list. With column headings, each control is labelled by its heading; in the stacked layout each control has its own visible label.',
    'Adding a row moves focus to the first control of the new row, once the new item arrives.',
    <>
      Removing a row moves focus to the remove button of the row that takes its place, or to the add button after the
      last row, and announces the removal through a live region. Change the announcement with{' '}
      <code>i18nStrings.itemRemovedAriaLive</code>.
    </>,
    <>
      Every row's remove button has the same visible text. Set <code>removeButtonAriaLabel</code> so screen reader users
      can tell them apart: "Remove variable REGION".
    </>,
    'The add and remove buttons do not submit a surrounding form.',
  ],
  related: ['tag-editor', 'form-field', 'input', 'form'],
};

export default doc;
