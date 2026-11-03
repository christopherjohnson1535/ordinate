// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Dropdown',
  folder: 'dropdown',
  group: 'overlays',
  summary: 'Drops a panel of your own content from a trigger, such as a filter with its own actions.',
  description: (
    <>
      <p>
        The panel is the same plate that the menus and selects of the library drop: white, with a hairline ink edge on a
        4 px offset, rising onto it as it opens. A <code>header</code> stays fixed above the scrolling content behind a
        divider, and a <code>footer</code> stays fixed below it.
      </p>
      <p>
        Dropdown is the building block under those components, for panels they do not cover. It only positions and
        frames the panel. Your code decides when it opens, what is in it and how it closes: keep <code>open</code> in
        state, toggle it from the trigger, and close it in <code>onOutsideClick</code> and <code>onEscape</code>.
      </p>
    </>
  ),
  marks: ['M9', 'M13'],
  examples: [
    {
      id: 'filter',
      title: 'A filter panel',
      description: (
        <p>
          A button opens a panel of checkboxes with Clear and Apply in the footer. The choices are a draft until Apply,
          so closing the panel by clicking outside or pressing Escape discards them. The panel opens in place, so it
          follows the example&apos;s mode.
        </p>
      ),
      height: 'medium',
    },
    {
      id: 'widths',
      title: 'Widths',
      description: (
        <p>
          The panel is at least as wide as its trigger, or <code>minWidth</code>. It grows with its content up to{' '}
          <code>maxWidth</code>, or to the width of the viewport with the default, <code>none</code>.
        </p>
      ),
      height: 'short',
    },
  ],
  guidelines: {
    use: [
      'For a panel of controls that drops from a button, such as a filter, a column picker or a small form.',
      'When no ready-made component fits the content of the panel.',
    ],
    avoid: [
      <>
        For a list of actions. Use a <a href="#/components/button-dropdown">ButtonDropdown</a>.
      </>,
      <>
        For choosing a value. Use a <a href="#/components/select">Select</a>,{' '}
        <a href="#/components/multiselect">Multiselect</a> or <a href="#/components/autosuggest">Autosuggest</a>.
      </>,
      <>
        For extra detail about a word or a value. Use a <a href="#/components/popover">Popover</a>.
      </>,
    ],
    writing: [
      'Name the trigger after what the panel holds: "Zones", "Columns".',
      'Put the actions that apply the panel in the footer, the primary one last.',
    ],
  },
  accessibility: [
    <>
      Give the panel an <code>ariaRole</code> that fits its content, <code>dialog</code> for a form, and a name with{' '}
      <code>ariaLabel</code> or <code>ariaLabelledby</code>.
    </>,
    <>
      Set <code>ariaExpanded</code> and <code>ariaHaspopup</code> on the trigger button, so screen readers say what it
      opens and whether it is open.
    </>,
    <>
      Escape pressed in the trigger or the panel calls <code>onEscape</code> and goes no further, so a modal around it
      stays open. Close the panel there and move focus back to the trigger.
    </>,
    'The panel does not move focus or trap it. Tab moves from the trigger into the panel and on to the rest of the page.',
    'Clicking the panel’s own surface does not move focus away from the control that has it.',
  ],
  related: ['button-dropdown', 'popover', 'select', 'multiselect'],
};

export default doc;
