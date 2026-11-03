// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Multiselect',
  folder: 'multiselect',
  group: 'forms',
  summary: 'Lets the user choose several options from a list, and shows the choices as tokens.',
  description: (
    <>
      <p>
        A multiselect is a <a href="#/components/select">Select</a> trigger that opens a list of options with a checkbox
        key square in each row. The list is a plate: a white sheet with a hairline ink edge on a hard offset. The
        trigger counts the selection, "2 options selected", and the chosen options are shown below it as tokens in
        hairline boxes, each with a button that removes it.
      </p>
      <p>
        The multiselect is controlled: pass <code>selectedOptions</code> and update it in <code>onChange</code>. The
        list stays open after each choice so several can be picked in a row; set <code>keepOpen</code> to{' '}
        <code>false</code> to close it after each one.
      </p>
    </>
  ),
  marks: ['M6', 'M9', 'M13'],
  examples: [
    {
      id: 'basic',
      title: 'Choosing several options',
      description: (
        <p>
          Options can have a <code>description</code> and a <code>labelTag</code>. Name the remove button of each token
          with <code>deselectAriaLabel</code>, or the default "Remove …" is used.
        </p>
      ),
    },
    {
      id: 'filtering',
      title: 'Groups, filtering and select all',
      description: (
        <p>
          <code>filteringType="auto"</code> adds a filter input to the top of the list. <code>enableSelectAll</code>{' '}
          adds a row that selects or clears every option shown, and only those that match while filtering. Disabled
          options are left out. <code>tokenLimit</code> folds the rest of the tokens behind a "Show more" button.
        </p>
      ),
    },
    {
      id: 'async',
      title: 'Loading options',
      description: (
        <p>
          Load options in <code>onLoadItems</code>, which is called when the list opens and when the user scrolls to its
          end while <code>statusType</code> is <code>pending</code>. The status shows under the options as a mono
          caption.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Validation, read-only and disabled',
      description: (
        <p>
          The error comes from the surrounding form field. <code>readOnly</code> keeps the trigger focusable and the
          tokens visible without remove buttons. <code>disabled</code> also hides the remove buttons.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For choosing any number of options from a list of more than about seven.',
      'When the user needs to see what they chose at a glance, as tokens under the field.',
    ],
    avoid: [
      <>
        For fewer than about seven options. Show them all as <a href="#/components/checkbox">Checkboxes</a>.
      </>,
      <>
        For one choice. Use a <a href="#/components/select">Select</a>.
      </>,
      <>
        For values the user types that are not in a list. Use an <a href="#/components/autosuggest">Autosuggest</a> or a{' '}
        <a href="#/components/tag-editor">TagEditor</a>.
      </>,
      'With hideTokens unless the selection is shown somewhere else, such as a table beside the field.',
    ],
    writing: [
      'Write the placeholder as an action: "Choose zones".',
      'Keep option labels short; put the detail in the description or tags.',
      'Set filteringAriaLabel to say what the filter finds: "Find people".',
    ],
  },
  accessibility: [
    <>
      The trigger is a button with <code>aria-haspopup="listbox"</code>. Arrow Down and Arrow Up open the list, as does
      typing a letter, which jumps to the first option that starts with it.
    </>,
    <>
      The list is a <code>listbox</code> with <code>aria-multiselectable</code>. Arrow keys, Page Up, Page Down, Home
      and End move the highlight, and Enter or Space selects. With a filter, focus stays in the filter input and Space
      types a space.
    </>,
    'Escape and Tab close the list and return focus to the trigger.',
    <>
      Each token's remove button is named by <code>deselectAriaLabel</code>. Removing a focused token moves focus to the
      next token, or to the trigger when none are left.
    </>,
    <>
      A read-only multiselect stays focusable and is marked <code>aria-disabled</code>; a disabled one is skipped by
      Tab.
    </>,
  ],
  related: ['select', 'autosuggest', 'checkbox', 'token-group', 'tag-editor'],
};

export default doc;
