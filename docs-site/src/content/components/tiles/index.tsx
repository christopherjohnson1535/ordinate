// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Tiles',
  folder: 'tiles',
  group: 'forms',
  summary: 'Lets the user choose one option from a few that each need a description or a picture.',
  description: (
    <>
      <p>
        Tiles are a radio group laid out as a grid of tiles with room for a label, a description and an image. A tile
        has no box: crop marks stand at its four corners, saying it is one of a set, and close into an ink frame with
        heavier corners once it is chosen. The <code>kind</code> colors the marks for what the choice sets. A disabled
        tile is hatched; read-only tiles are shaded.
      </p>
      <p>
        Each tile keeps its radio button, so the choice reads without the marks. The whole tile is a target for the
        pointer. The tiles are controlled: set <code>value</code> and update it in <code>onChange</code>.
      </p>
    </>
  ),
  marks: ['M5', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'Choose one option',
      description: (
        <p>
          Up to three tiles sit in one row by default. Put them in a FormField, which names the group and gives it a
          label in the margin, and set <code>stretch</code> on the field so the tiles take its full width.
        </p>
      ),
    },
    {
      id: 'images',
      title: 'With images',
      description: (
        <p>
          An <code>image</code> sits at the bottom of the tile. Give it its own alt text, or hide it from screen readers
          when the label says everything.
        </p>
      ),
    },
    {
      id: 'columns',
      title: 'Columns and kind',
      description: (
        <p>
          Four tiles fall into two rows of two; set <code>columns</code> from 1 to 4 to choose. Rows collapse to one
          column when the tiles get too narrow. <code>kind=&quot;configuration&quot;</code> draws the marks in drafting
          blue.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Disabled tiles and read-only',
      description: (
        <p>
          Disable a tile that does not apply and say why in its description. <code>readOnly</code> shades every tile and
          keeps the group focusable and submitted with the form.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a choice between two to about six options that each need a sentence or a picture to tell apart.',
      'For a choice that shapes the rest of a flow, such as a plan or a deployment type.',
    ],
    avoid: [
      <>
        For short options that a word explains. Use a <a href="#/components/radio-group">RadioGroup</a>.
      </>,
      <>
        For many options. Use a <a href="#/components/select">Select</a>.
      </>,
      <>
        For choosing several options. Use <a href="#/components/checkbox">Checkboxes</a> or a{' '}
        <a href="#/components/multiselect">Multiselect</a>.
      </>,
      <>
        For cards that lead somewhere or act on a resource. Use <a href="#/components/cards">Cards</a> or an{' '}
        <a href="#/components/action-card">ActionCard</a>.
      </>,
    ],
    writing: [
      'Keep labels to a word or two. Put the difference between options in the description, in the same order on every tile.',
      'Write descriptions of about the same length, so the tiles line up.',
    ],
  },
  accessibility: [
    <>
      The tiles form a <code>role=&quot;radiogroup&quot;</code>, named by the surrounding FormField&apos;s label or by{' '}
      <code>ariaLabel</code>. Each tile holds a native radio input, labelled by the tile&apos;s label and described by
      its description.
    </>,
    'Tab moves into the group and the arrow keys move between tiles and select them. The focus ring goes around the whole tile.',
    'Clicking anywhere on a tile selects it and moves focus to its radio button.',
    'The crop marks are drawing only and hidden from screen readers; the radio buttons carry the state.',
    <>
      <code>readOnly</code> sets <code>aria-readonly</code> on the group and keeps the tiles focusable. Disabled tiles
      are skipped.
    </>,
    'Images need their own text alternative, such as role="img" and an aria-label on an SVG.',
  ],
  related: ['radio-group', 'cards', 'segmented-control', 'form-field'],
};

export default doc;
