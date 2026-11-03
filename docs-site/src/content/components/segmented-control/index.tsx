// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'SegmentedControl',
  folder: 'segmented-control',
  group: 'actions',
  summary: 'Switches between a few views or modes of the same content, with one always chosen.',
  description: (
    <>
      <p>
        A hairline frame holds two to five segments, with short ticks between them. The chosen segment is one of a set,
        so it is lettered in ink and marked with crop marks, the same marks as the open tab. The marks slide to the new
        segment when the choice changes, and change at once under reduced motion.
      </p>
      <p>
        The control is controlled: keep the chosen ID in state and set it in <code>onChange</code>.
      </p>
    </>
  ),
  marks: ['M5'],
  examples: [
    {
      id: 'basic',
      title: 'Choosing a range',
      description: (
        <p>
          Short text segments that change what the content below shows. <code>label</code> names the group for screen
          readers when there is no visible label.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'icons',
      title: 'Icons',
      description: (
        <p>
          A segment can show an <code>iconName</code> before its text, or the icon alone. A segment with only an icon
          needs an <code>iconAlt</code>.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'with-label',
      title: 'In a form field',
      description: (
        <p>
          Inside a <a href="#/components/form-field">FormField</a>, the field gives the visible label and description. A
          disabled segment stays in place but cannot be chosen; say why in the field&apos;s text.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To switch between views of the same content, such as a list and a grid, or a time range of a chart.',
      'For two to five short options when one of them is always chosen.',
    ],
    avoid: [
      <>
        For more than five options, or long labels. Use a <a href="#/components/select">Select</a>.
      </>,
      <>
        For navigating between sections of different content. Use <a href="#/components/tabs">Tabs</a>.
      </>,
      <>
        For turning one setting on or off. Use a <a href="#/components/toggle">Toggle</a> or a{' '}
        <a href="#/components/toggle-button">ToggleButton</a>.
      </>,
      <>
        For a choice in a form that is submitted later. Use a <a href="#/components/radio-group">RadioGroup</a> or
        tiles.
      </>,
    ],
    writing: [
      'Use one or two words per segment, of similar length.',
      'Use nouns or short measures, such as "List", "Grid", "24h", in sentence case.',
      'Give icon-only segments an iconAlt that names the option, not the icon.',
    ],
  },
  accessibility: [
    <>
      The control is a <code>group</code> of buttons. Each segment has <code>aria-pressed</code>; the chosen one is{' '}
      <code>true</code>. Name the group with <code>label</code> or <code>ariaLabelledby</code>.
    </>,
    'The group is one tab stop on the chosen segment. The left and right arrows move between segments, following the reading direction, and Home and End go to the first and last; Enter or Space chooses the focused segment. Disabled segments are skipped.',
    'Tabbing back into the group lands on the chosen segment again.',
  ],
  related: ['tabs', 'toggle-button', 'select', 'radio-group'],
};

export default doc;
