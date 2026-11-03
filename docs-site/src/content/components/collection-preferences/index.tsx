// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'CollectionPreferences',
  folder: 'collection-preferences',
  group: 'collections',
  summary: 'Lets the user choose how a table or cards collection is shown: page size, columns, density and more.',
  description: (
    <>
      <p>
        Collection preferences is an icon button that opens a modal. The settings you ask for are stacked in one column;
        the column list, when you ask for it, takes a second column on the other side of a rule. The column list is
        ruled like a schedule, with a drag handle, move buttons and a toggle on each row, and a row being dragged is
        lifted off the list on a hard offset.
      </p>
      <p>
        Every change is made on a draft. Nothing reaches the application until the user confirms, and{' '}
        <code>onConfirm</code> then hands you all the preferences at once. You apply them to the collection yourself:
        page size to <code>useCollection</code>, the rest to the Table or Cards.
      </p>
    </>
  ),
  marks: ['M9', 'M13', 'M10'],
  examples: [
    {
      id: 'table',
      title: 'Preferences of a table',
      description: (
        <p>
          Put the control in the table’s <code>preferences</code> slot. Here it sets the page size, wrapping, striped
          rows, density and the columns, which go to the table’s <code>columnDisplay</code>.
        </p>
      ),
    },
    {
      id: 'content-display',
      title: 'Column order and visibility',
      description: (
        <p>
          <code>contentDisplayPreference</code> lists the columns. Each one can be shown or hidden with its toggle and
          moved with its buttons or by dragging the handle. <code>alwaysVisible</code> keeps a column on.
        </p>
      ),
    },
    {
      id: 'custom',
      title: 'A preference of your own',
      description: (
        <p>
          <code>customPreference</code> renders your own controls in the modal. It receives the draft value and a
          setter, and the value comes back in <code>event.detail.custom</code> on confirm.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For tables and cards collections whose users work with them every day and want them their own way.',
      'For the page size, as soon as a collection is paginated.',
    ],
    avoid: [
      'Settings that change what data is shown, such as which items match. Those are filters: use a TextFilter or a PropertyFilter.',
      'Preferences the collection does not apply. Offer only what the Table or Cards you show will honor.',
      <>
        Offering sticky columns with <a href="#/components/table">Table</a>: it has no sticky column support yet, so the
        setting would have no effect.
      </>,
    ],
    writing: [
      'Say what the user is setting in the title when there is more than one collection on the page: "Instance preferences".',
      'Label page sizes with the items they count: "10 instances", "25 instances".',
      'Keep the confirm label short and plain: "Confirm" or "Apply".',
    ],
  },
  accessibility: [
    <>
      The settings button is an icon button named by <code>title</code>, or "Preferences", and marked{' '}
      <code>aria-haspopup="dialog"</code>.
    </>,
    'The modal is a native modal dialog: focus moves into it, the page behind cannot be reached, and Escape cancels.',
    'When the modal closes, by confirming or cancelling, focus returns to the settings button.',
    'Each column’s toggle is named by the column label, and its move buttons by "Move" and the label. After a move, the new position is announced, such as "Zone moved to position 2 of 5".',
    'The drag handle is for pointers only. Keyboard and screen reader users move columns with the buttons.',
  ],
  related: ['table', 'cards', 'pagination', 'modal'],
};

export default doc;
