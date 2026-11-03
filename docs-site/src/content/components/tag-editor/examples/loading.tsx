// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';
import TagEditor, { TagEditorProps } from '@ordinate/components/tag-editor';

export default function Loading() {
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<ReadonlyArray<TagEditorProps.Tag>>([]);

  useEffect(() => {
    if (!loading) {
      return;
    }
    const timer = window.setTimeout(() => {
      setTags([]);
      setLoading(false);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <SpaceBetween size="l">
      <TagEditor tags={tags} loading={loading} onChange={event => setTags(event.detail.tags)} />
      <Button variant="link" disabled={loading} onClick={() => setLoading(true)}>
        Load the tags again
      </Button>
    </SpaceBetween>
  );
}
