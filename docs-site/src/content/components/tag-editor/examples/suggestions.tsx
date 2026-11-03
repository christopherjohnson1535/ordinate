// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TagEditor, { TagEditorProps } from '@ordinate/components/tag-editor';

// Tags already used elsewhere in the account, as a service would return them.
const knownTags: Record<string, string[]> = {
  project: ['north-annex', 'atrium', 'boundary-survey'],
  stage: ['draft', 'review', 'issued'],
  region: ['us-mountain-1', 'us-coast-2'],
  owner: ['dana.ruiz', 'drafting-team'],
};

const later = <T,>(value: T) => new Promise<T>(resolve => window.setTimeout(() => resolve(value), 400));

const keysRequest = (key: string) => later(Object.keys(knownTags).filter(known => known.includes(key)));

const valuesRequest = (key: string, value: string) =>
  later((knownTags[key] ?? []).filter(known => known.includes(value)));

export default function Suggestions() {
  const [tags, setTags] = useState<ReadonlyArray<TagEditorProps.Tag>>([
    { key: 'project', value: 'north-annex', existing: true },
    { key: 'stage', value: '', existing: false },
  ]);

  return (
    <TagEditor
      tags={tags}
      onChange={event => setTags(event.detail.tags)}
      keysRequest={keysRequest}
      valuesRequest={valuesRequest}
    />
  );
}
