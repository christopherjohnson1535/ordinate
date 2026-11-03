// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import FileInput from '@ordinate/components/file-input';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

export default function Basic() {
  const [value, setValue] = useState<ReadonlyArray<File>>([]);

  return (
    <FormField label="Photo of the damage" constraintText="JPEG, PNG or HEIC.">
      <SpaceBetween size="xs">
        <FileInput value={value} onChange={event => setValue(event.detail.value)} accept="image/*">
          Choose a photo
        </FileInput>
        <Box color="text-body-secondary" fontSize="body-s">
          {value.length > 0 ? `Chosen: ${value[0].name}` : 'No photo chosen'}
        </Box>
      </SpaceBetween>
    </FormField>
  );
}
