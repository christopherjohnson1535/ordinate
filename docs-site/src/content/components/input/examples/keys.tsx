// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function Keys() {
  const [value, setValue] = useState('');
  const [tags, setTags] = useState<string[]>(['staging', 'annex']);

  return (
    <SpaceBetween size="s">
      <Input
        inlineLabelText="Add a tag"
        placeholder="Type and press Enter"
        value={value}
        onChange={event => setValue(event.detail.value)}
        onKeyDown={event => {
          if (event.detail.key === 'Enter' && value.trim() !== '') {
            event.preventDefault();
            setTags([...tags, value.trim()]);
            setValue('');
          }
        }}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Tags: {tags.join(', ')}
      </Box>
    </SpaceBetween>
  );
}
