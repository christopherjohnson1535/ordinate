// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import FileTokenGroup from '@ordinate/components/file-token-group';
import KeyValuePairs from '@ordinate/components/key-value-pairs';

const lastModified = new Date(2026, 9, 12, 9, 15).getTime();
const file = (name: string, size: number) => {
  const sample = new File(['%PDF'], name, { type: 'application/pdf', lastModified });
  Object.defineProperty(sample, 'size', { value: size });
  return sample;
};

export default function ReadOnly() {
  return (
    <KeyValuePairs
      items={[
        { label: 'Request', value: 'Change of use, north annex' },
        { label: 'Submitted by', value: 'Dana Ruiz' },
        {
          label: 'Attachments',
          value: (
            <FileTokenGroup
              readOnly={true}
              alignment="vertical"
              showFileSize={true}
              ariaLabel="Attachments"
              items={[{ file: file('application-form.pdf', 412_000) }, { file: file('site-plan.pdf', 1_240_512) }]}
            />
          ),
        },
      ]}
    />
  );
}
