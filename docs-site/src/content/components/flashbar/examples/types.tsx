// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Flashbar, { FlashbarProps } from '@ordinate/components/flashbar';

const items: FlashbarProps.MessageDefinition[] = [
  {
    id: 'deploy',
    type: 'fault',
    header: 'Deployment failed',
    content: 'Two nodes of north-annex did not respond within 30 seconds.',
  },
  {
    id: 'certificate',
    type: 'caution',
    header: 'Certificate expires soon',
    content: 'The certificate for api.north-annex expires in 6 days.',
  },
  {
    id: 'backup',
    type: 'complete',
    header: 'Backup complete',
    content: 'All 12 nodes were backed up in 4 minutes.',
  },
  {
    id: 'instance',
    type: 'note',
    loading: true,
    header: 'Creating instance',
    content: 'north-annex-13 is starting in us-mountain-1.',
  },
  {
    id: 'maintenance',
    type: 'note',
    header: 'Maintenance window',
    content: 'Updates run on Sunday at 02:00 UTC.',
  },
];

export default function Types() {
  return <Flashbar items={items} />;
}
