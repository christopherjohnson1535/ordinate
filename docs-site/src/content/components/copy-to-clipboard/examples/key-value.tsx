// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CopyToClipboard from '@ordinate/components/copy-to-clipboard';
import KeyValuePairs from '@ordinate/components/key-value-pairs';

const accessKey = 'ORD7Q2M4X9KD81VZ3PLN';

export default function KeyValue() {
  return (
    <KeyValuePairs
      columns={3}
      items={[
        {
          label: 'Project ID',
          value: (
            <CopyToClipboard
              variant="inline"
              textToCopy="north-annex-4471"
              copyButtonAriaLabel="Copy project ID"
              copySuccessText="Project ID copied"
            />
          ),
        },
        {
          label: 'Endpoint',
          value: (
            <CopyToClipboard
              variant="inline"
              textToCopy="https://api.us-mountain-1.example.com"
              copyButtonAriaLabel="Copy endpoint"
              copySuccessText="Endpoint copied"
            />
          ),
        },
        {
          label: 'Access key',
          value: (
            <CopyToClipboard
              variant="inline"
              textToCopy={accessKey}
              textToDisplay={`${accessKey.slice(0, 4)}…${accessKey.slice(-4)}`}
              copyButtonAriaLabel="Copy access key"
              copySuccessText="Access key copied"
            />
          ),
        },
      ]}
    />
  );
}
