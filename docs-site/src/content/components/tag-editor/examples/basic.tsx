// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Form from '@ordinate/components/form';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';
import TagEditor, { TagEditorProps } from '@ordinate/components/tag-editor';

const savedTags: TagEditorProps.Tag[] = [
  { key: 'project', value: 'north-annex', existing: true },
  { key: 'owner', value: 'dana.ruiz', existing: true },
  { key: 'cost-centre', value: 'annex-04', existing: true },
];

export default function Basic() {
  const [tags, setTags] = useState<ReadonlyArray<TagEditorProps.Tag>>(savedTags);
  const [valid, setValid] = useState(true);
  const [status, setStatus] = useState('No changes yet.');

  const save = () => {
    const kept = tags.filter(tag => !tag.markedForRemoval).map(tag => ({ ...tag, existing: true }));
    setTags(kept);
    setStatus(`Saved ${kept.length} tags.`);
  };

  return (
    <SpaceBetween size="m">
      <Form
        header={
          <Header variant="h3" description="Tags show up in cost reports for atrium-api.">
            Tags
          </Header>
        }
        actions={
          <Button variant="primary" disabled={!valid} onClick={save}>
            Save tags
          </Button>
        }
      >
        <TagEditor
          tags={tags}
          onChange={event => {
            setTags(event.detail.tags);
            setValid(event.detail.valid);
            setStatus(event.detail.valid ? 'Unsaved changes.' : 'Fix the tags before saving.');
          }}
        />
      </Form>
      <Box color="text-body-secondary" fontSize="body-s">
        {status}
      </Box>
    </SpaceBetween>
  );
}
