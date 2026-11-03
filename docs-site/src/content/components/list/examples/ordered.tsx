// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '@ordinate/components/icon';
import List from '@ordinate/components/list';
import StatusIndicator from '@ordinate/components/status-indicator';

const steps = [
  { id: 'build', title: 'Build the image', state: 'complete', label: 'Done', note: 'web:v2, 2 minutes' },
  { id: 'test', title: 'Run the tests', state: 'complete', label: 'Done', note: '412 passed' },
  { id: 'stage', title: 'Deploy to staging', state: 'underway', label: 'Running', note: 'Started 40 seconds ago' },
  { id: 'prod', title: 'Deploy to production', state: 'queued', label: 'Queued', note: 'Waits for staging' },
] as const;

export default function Ordered() {
  return (
    <List
      ariaLabel="Release steps"
      tagOverride="ol"
      items={steps}
      renderItem={step => ({
        id: step.id,
        content: step.title,
        secondaryContent: step.note,
        icon: <Icon name="script" />,
        actions: <StatusIndicator state={step.state}>{step.label}</StatusIndicator>,
      })}
    />
  );
}
