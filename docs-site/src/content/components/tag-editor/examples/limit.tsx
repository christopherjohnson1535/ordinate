// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TagEditor, { TagEditorProps } from '@ordinate/components/tag-editor';

export default function Limit() {
  const [tags, setTags] = useState<ReadonlyArray<TagEditorProps.Tag>>([
    { key: 'project', value: 'north-annex', existing: true },
    { key: 'stage', value: 'review', existing: true, markedForRemoval: true },
    { key: 'sheet', value: 'A-101', existing: false },
  ]);

  return (
    <TagEditor
      tags={tags}
      onChange={event => setTags(event.detail.tags)}
      tagLimit={4}
      i18nStrings={{
        emptyTags: 'No tags on this drawing.',
        addButton: 'Add tag',
        tagLimit: (available, limit) =>
          available === 1 ? `1 tag left of ${limit}.` : `${available} tags left of ${limit}.`,
        tagLimitReached: limit => `All ${limit} tags used.`,
      }}
    />
  );
}
