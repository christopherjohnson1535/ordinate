// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TokenGroup',
  folder: 'token-group',
  group: 'collections',
  summary: 'Shows the values a user has picked as a row of tokens, each of which can be removed.',
  description: (
    <>
      <p>
        A token group is a list of <a href="#/components/token">Token</a>s: hairline boxes on the sheet, wrapped in
        rows or stacked one per line. Each token has a dismiss mark when you pass <code>onDismiss</code>; the event
        gives you the token’s position, and you remove the item from <code>items</code>.
      </p>
      <p>
        With <code>limit</code>, only the first tokens show and a link button reveals the rest. When a focused token is
        removed, focus moves to the next token’s dismiss button, so the keyboard user stays in the group.
      </p>
    </>
  ),
  marks: ['M12'],
  examples: [
    {
      id: 'basic',
      title: 'Picked values',
      description: (
        <p>
          Put the group under the control the values were picked with. Remove the item in <code>onDismiss</code>, using{' '}
          <code>event.detail.itemIndex</code>.
        </p>
      ),
    },
    {
      id: 'limit',
      title: 'A limit',
      description: (
        <p>
          <code>limit</code> shows that many tokens and a "+3 more" button for the rest. The button toggles, so the user
          can hide them again.
        </p>
      ),
    },
    {
      id: 'vertical',
      title: 'Stacked tokens',
      description: (
        <p>
          <code>alignment="vertical"</code> stacks the tokens, which suits tokens with a description and tags. A{' '}
          <code>disabled</code> item is hatched and has no dismiss button.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To show the values picked in a control that holds several, such as zones, labels or recipients.',
      'For a read-only summary of picked values, with readOnly.',
    ],
    avoid: [
      <>
        For a single value. Use a <a href="#/components/token">Token</a>.
      </>,
      <>
        For files the user has attached. Use a <a href="#/components/file-token-group">FileTokenGroup</a>, which
        shows size and upload state.
      </>,
      <>
        For filters on a collection. Use a <a href="#/components/property-filter">PropertyFilter</a>, which writes
        them as one query.
      </>,
    ],
    writing: [
      'Use each value’s own name for its label.',
      'Keep descriptions to a few words and tags to one or two words each.',
      'Leave the default dismiss label, "Remove" and the label, unless you translate it.',
    ],
  },
  accessibility: [
    <>
      The tokens are a list (<code>ul</code>). Name it with <code>ariaLabel</code>, such as "Picked zones".
    </>,
    'Each dismiss button is named "Remove" and the token’s label, unless the item sets its own dismissLabel.',
    'When a focused token is removed, focus moves to the next dismiss button, or to the previous one at the end of the list. Focus is only moved when it was inside the group.',
    <>
      The show-more button carries <code>aria-expanded</code> and <code>aria-controls</code>, pointing at the list.
    </>,
    'When the last token is removed the group renders nothing, so move focus back to the control the values came from.',
  ],
  related: ['token', 'multiselect', 'file-token-group', 'property-filter'],
};

export default doc;
