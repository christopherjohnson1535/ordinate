// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import KeyValuePairs from '@ordinate/components/key-value-pairs';

export default function Groups() {
  return (
    <KeyValuePairs
      columns={3}
      ariaLabel="Node configuration"
      items={[
        {
          type: 'group',
          title: 'Network',
          items: [
            { label: 'Private address', value: '10.0.4.12' },
            { label: 'Public address', value: '203.0.113.40' },
            { label: 'Subnet', value: 'subnet-north-7' },
          ],
        },
        {
          type: 'group',
          title: 'Storage',
          items: [
            { label: 'Root volume', value: 'vol-0a4e, 50 GB' },
            { label: 'Data volume', value: 'vol-77c1, 200 GB' },
          ],
        },
        {
          type: 'group',
          title: 'Access',
          items: [
            { label: 'Key pair', value: 'deploy-2026' },
            { label: 'Owner', value: 'Dana Ruiz' },
          ],
        },
      ]}
    />
  );
}
