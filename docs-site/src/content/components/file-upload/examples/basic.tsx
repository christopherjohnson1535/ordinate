// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FileUpload from '@ordinate/components/file-upload';
import FormField from '@ordinate/components/form-field';

export default function Basic() {
  const [value, setValue] = useState<ReadonlyArray<File>>([]);

  return (
    <FormField label="Site plan" description="The plan the council stamped.">
      <FileUpload
        value={value}
        onChange={event => setValue(event.detail.value)}
        accept=".pdf"
        showFileSize={true}
        showFileLastModified={true}
        constraintText="PDF, up to 10 MB."
      />
    </FormField>
  );
}
