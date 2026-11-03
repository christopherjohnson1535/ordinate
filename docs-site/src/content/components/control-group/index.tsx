// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ControlGroup',
  folder: 'control-group',
  group: 'forms',
  summary: 'Joins several controls into one field, such as a number and its unit.',
  description: (
    <>
      <p>
        A control group sets its controls in one row and removes the borders between them, so they read as a single
        field. Text fields and selects share the free width; buttons keep their natural width. An error or warning draws
        its leading mark once, on the edge of the whole group.
      </p>
      <p>
        Inside a <a href="#/components/form-field">FormField</a>, the first control takes the field's label as its own,
        and every control picks up the field's description and validation state. Name the other controls with{' '}
        <code>ariaLabel</code>.
      </p>
    </>
  ),
  examples: [
    {
      id: 'value-and-unit',
      title: 'Value and unit',
      description: (
        <p>
          The most common use: an input for an amount joined to a select for its unit. The select needs its own{' '}
          <code>ariaLabel</code>, because the field's label goes to the input.
        </p>
      ),
    },
    {
      id: 'with-buttons',
      title: 'With buttons',
      description: (
        <p>
          A button at the end acts on the value beside it. Outside a form field, name the whole group with{' '}
          <code>ariaLabel</code>.
        </p>
      ),
    },
    {
      id: 'validation',
      title: 'Validation',
      description: (
        <p>
          The field's <code>errorText</code> marks every control in the group invalid, with one error mark on the
          group's leading edge.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For one value made of parts: an amount and a unit, a protocol and a host.',
      'For a field and the one button that acts on it, such as Copy or Search.',
    ],
    avoid: [
      <>
        For values that stand on their own. Give each its own <a href="#/components/form-field">FormField</a>.
      </>,
      <>
        For a row of buttons. Use a <a href="#/components/button-group">ButtonGroup</a> or{' '}
        <a href="#/components/space-between">SpaceBetween</a>.
      </>,
      'More than three controls in a group. The row gets hard to read and to label.',
    ],
    writing: [
      'Name each control after the first by what it holds, as a noun: "Size unit", "Protocol".',
      'Write the field label for the whole value: "Volume size", not "Volume size and unit".',
    ],
  },
  accessibility: [
    <>
      The group has <code>role="group"</code>. Inside a form field it is labelled by the field's label unless you set{' '}
      <code>ariaLabel</code> or <code>ariaLabelledby</code>.
    </>,
    "Only the first control takes the field's control ID, so clicking the label focuses it. Every control is described by the field's messages and marked invalid by its error.",
    <>
      Controls after the first have no visible label of their own: give each an <code>ariaLabel</code>.
    </>,
    'The focus ring of the focused control is lifted above its neighbors so it is never covered.',
  ],
  related: ['form-field', 'input', 'select', 'button'],
};

export default doc;
