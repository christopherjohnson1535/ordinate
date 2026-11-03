// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Tiles from '@ordinate/components/tiles';

export default function States() {
  const [engine, setEngine] = useState<string | null>('postgres');

  return (
    <Form>
      <FormField stretch={true} label="Database engine">
        <Tiles
          value={engine}
          onChange={event => setEngine(event.detail.value)}
          kind="resource"
          items={[
            { value: 'postgres', label: 'PostgreSQL', description: 'Version 17, with point-in-time restore.' },
            { value: 'mysql', label: 'MySQL', description: 'Version 8.4, with read replicas.' },
            {
              value: 'oracle',
              label: 'Oracle',
              description: 'Not offered in us-mountain-1.',
              disabled: true,
            },
          ]}
        />
      </FormField>
      <FormField stretch={true} label="Region" description="Set by your organization. Ask Dana Ruiz to change it.">
        <Tiles
          value="us-mountain-1"
          readOnly={true}
          columns={2}
          items={[
            { value: 'us-mountain-1', label: 'us-mountain-1', description: 'Denver and Salt Lake City.' },
            { value: 'us-coast-2', label: 'us-coast-2', description: 'Portland.' },
          ]}
        />
      </FormField>
    </Form>
  );
}
