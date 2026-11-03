// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'FormField',
  folder: 'form-field',
  group: 'forms',
  summary: 'Gives a control its label, help text and validation messages.',
  description: (
    <>
      <p>
        A form field is the editable twin of a KeyValuePairs pair. In the default <code>margin</code> layout the label
        is set right-aligned in a margin column against a faint construction line, with the description under it, and
        the control, its messages and its constraint text sit to the right. The margin column is as wide as the label
        column of KeyValuePairs, so a details page and its edit form line up.
      </p>
      <p>
        The field measures its own width: below about 560 px the label stacks above the control. Controls inside the
        field pick up its label, description and validation state on their own, so you set <code>errorText</code> on the
        field and not on the control.
      </p>
    </>
  ),
  marks: ['M4', 'M1', 'M3'],
  examples: [
    {
      id: 'basic',
      title: 'Label, description and constraint',
      description: (
        <p>
          The <code>description</code> says what the field is for and sits under the label. The{' '}
          <code>constraintText</code> gives the rules for the value and sits under the control. An <code>info</code>{' '}
          link goes beside the label.
        </p>
      ),
    },
    {
      id: 'validation',
      title: 'Errors and warnings',
      description: (
        <p>
          <code>errorText</code> marks the control invalid and draws its edge, baseline and a leading mark in the error
          color. <code>warningText</code> is for a value that is allowed but probably not meant. While both are set,
          only the error shows.
        </p>
      ),
    },
    {
      id: 'character-count',
      title: 'Character count',
      description: (
        <p>
          <code>characterCountText</code> is drawn as a dimension line under the control. Update it on every change;
          screen readers hear it once typing pauses for a second.
        </p>
      ),
    },
    {
      id: 'secondary-control',
      title: 'Secondary control',
      description: (
        <p>
          A <code>secondaryControl</code> shares the row with the control, three to one. With <code>stretch</code> the
          control takes the full width and the secondary control goes below it.
        </p>
      ),
    },
    {
      id: 'stacked',
      title: 'Stacked layout',
      description: (
        <p>
          <code>layout="stacked"</code> always puts the label above the control. Use it where fields sit side by side,
          as here, or in a narrow panel.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'Around every control in a form, so each one has a visible label and a place for its messages.',
      'With the margin layout in full-width forms, so the labels line up with the details page the form edits.',
      'With the stacked layout for fields in columns, in side panels and in modals.',
    ],
    avoid: [
      <>
        Around a single checkbox or toggle that carries its own label. Give the{' '}
        <a href="#/components/checkbox">Checkbox</a> its text and leave the field out, or use the field label for the
        question and the checkbox text for the answer.
      </>,
      <>
        For two controls that make one value, such as a size and its unit, as two fields. Put them in one field with a{' '}
        <a href="#/components/control-group">ControlGroup</a>.
      </>,
      <>
        For rows of repeated fields. Use an <a href="#/components/attribute-editor">AttributeEditor</a>.
      </>,
    ],
    writing: [
      'Write the label as a noun phrase in sentence case, with no colon: "Project name", not "Enter project name:".',
      'Keep the description to one sentence about what the value is used for.',
      'Put the rules for the value in constraintText, before the user gets them wrong: "Lowercase letters, numbers and hyphens."',
      'Write errors as what to do: "Enter at least 1 node.", not "Invalid value".',
    ],
  },
  accessibility: [
    <>
      The label is a native <code>&lt;label&gt;</code> tied to the control by <code>controlId</code>, which is generated
      when you do not set it. Clicking the label focuses the control.
    </>,
    <>
      The control is described by the error or warning, the description, the constraint text and the character count, in
      that order, through <code>aria-describedby</code>.
    </>,
    <>
      <code>errorText</code> sets <code>aria-invalid</code> on the control. The error and warning icons are named by{' '}
      <code>errorIconAriaLabel</code> and <code>warningIconAriaLabel</code>, "Error" and "Warning" by default.
    </>,
    'The character count drawn on screen is hidden from screen readers; a copy that updates one second after typing stops is read instead, so it is not announced on every key.',
    'Messages are not live regions. Move focus to the first invalid field when a submit fails, or show a summary in the Form errorText, which is announced.',
  ],
  related: ['form', 'input', 'control-group', 'key-value-pairs', 'attribute-editor'],
};

export default doc;
