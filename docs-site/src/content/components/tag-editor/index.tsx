// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TagEditor',
  folder: 'tag-editor',
  group: 'forms',
  summary: 'Adds, changes and removes the key and value tags of a resource, with suggestions and validation.',
  description: (
    <>
      <p>
        A tag editor is an AttributeEditor set up for tags. On a wide sheet it is drawn as a schedule: the Key and Value
        column labels in mono capitals on an ink rule, and a hairline between rows. On a narrow one each row stacks.
        Under the rows, beside the add button, a mono caption counts how many more tags fit under <code>tagLimit</code>.
      </p>
      <p>
        The editor checks keys and values as the user types: an empty or repeated key, characters outside{' '}
        <code>allowedCharacterPattern</code>, and keys over 128 or values over 256 characters. Each{' '}
        <code>onChange</code> reports the new tags and whether they are <code>valid</code>, so you can hold back the
        save. Tags already saved on the resource are marked <code>existing</code>: their keys cannot be changed, and
        removing one only marks it, with an Undo button, until the changes are saved.
      </p>
    </>
  ),
  marks: ['M12'],
  examples: [
    {
      id: 'basic',
      title: 'Edit the tags of a resource',
      description: (
        <p>
          Keep the tags in state, update them in <code>onChange</code>, and use <code>event.detail.valid</code> to
          enable the save. On save, drop the tags marked for removal and mark the rest as existing.
        </p>
      ),
    },
    {
      id: 'suggestions',
      title: 'Suggested keys and values',
      description: (
        <p>
          <code>keysRequest</code> and <code>valuesRequest</code> return promises of suggestions for what is typed. Only
          the latest answer is shown, and a rejected promise shows an error with a retry button.
        </p>
      ),
    },
    {
      id: 'limit',
      title: 'Tag limit',
      description: (
        <p>
          With <code>tagLimit</code> the caption counts down to the limit and the add button is disabled once it is
          reached. Tags marked for removal do not count.
        </p>
      ),
    },
    {
      id: 'loading',
      title: 'Loading and no tags',
      description: (
        <p>
          Set <code>loading</code> while the tags are fetched. A resource without tags shows <code>emptyTags</code>{' '}
          above the add button.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the tags of a resource, in its create or edit form.',
      'Where tags follow rules your service enforces, such as a limit or allowed characters, so the user sees problems before saving.',
    ],
    avoid: [
      <>
        For other lists of pairs, such as environment variables. Use an{' '}
        <a href="#/components/attribute-editor">AttributeEditor</a>.
      </>,
      <>
        For showing tags that cannot be edited. Use <a href="#/components/key-value-pairs">KeyValuePairs</a> or a table.
      </>,
      'Saving changes while event.detail.valid is false.',
    ],
    writing: [
      'The built-in English texts fit most uses. Change i18nStrings to match the name your product uses, such as "label" for "tag".',
      'Say in the form description what tags are used for, such as cost reports.',
    ],
  },
  accessibility: [
    'Key and value fields are labelled by their column headings, or by their own labels when the rows stack.',
    'When a row is added, focus moves to its key field. When a new tag is removed, focus moves to the next remove button, or to the add button, and "Tag removed" is announced.',
    <>
      Removing an existing tag turns its Remove button into Undo, named &quot;Undo removal of tag &lt;key&gt;&quot;.
      Remove buttons are named &quot;Remove tag &lt;key&gt;&quot;; change both with <code>removeButtonAriaLabel</code>{' '}
      and <code>undoButtonAriaLabel</code>.
    </>,
    'Validation messages are tied to their fields and shown under them. Over the limit, the count turns into an error message.',
    'The key and value fields suggest as Autosuggest does: the arrow keys move through the suggestions and Enter picks one.',
    <>
      The loading state is a status message, so <code>loading</code> text is announced.
    </>,
  ],
  related: ['attribute-editor', 'autosuggest', 'key-value-pairs', 'form'],
};

export default doc;
