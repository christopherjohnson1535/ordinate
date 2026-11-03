// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import TruncatedText from '@ordinate/components/truncated-text';

export default function OneLine() {
  return (
    <ColumnLayout columns={2}>
      <KeyValuePairs
        ariaLabel="Archive object"
        items={[
          {
            label: 'Object',
            value: (
              <TruncatedText>
                ord:storage:us-mountain-1:4021:bucket/archive/telemetry/2026/10/31/node-04.parquet
              </TruncatedText>
            ),
          },
          { label: 'Size', value: '4.2 GiB' },
          { label: 'Class', value: <TruncatedText>Archive</TruncatedText> },
        ]}
      />
    </ColumnLayout>
  );
}
