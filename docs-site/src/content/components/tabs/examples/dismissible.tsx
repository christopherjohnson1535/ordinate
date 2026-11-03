// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';
import Tabs, { TabsProps } from '@ordinate/components/tabs';

interface Query {
  id: string;
  name: string;
  text: string;
}

export default function Dismissible() {
  const [queries, setQueries] = useState<Query[]>([
    { id: 'q1', name: 'Slow requests', text: 'SELECT path, p99 FROM requests WHERE p99 > 800;' },
    { id: 'q2', name: 'Failed jobs', text: "SELECT id, error FROM jobs WHERE state = 'failed';" },
    { id: 'q3', name: 'Disk use', text: 'SELECT node, used_pct FROM disks ORDER BY used_pct DESC;' },
  ]);
  const [activeTabId, setActiveTabId] = useState('q1');
  const [count, setCount] = useState(3);

  const close = (id: string) => {
    const index = queries.findIndex(query => query.id === id);
    const rest = queries.filter(query => query.id !== id);
    setQueries(rest);
    if (id === activeTabId && rest.length > 0) {
      setActiveTabId(rest[Math.min(index, rest.length - 1)].id);
    }
  };

  const open = () => {
    const id = `q${count + 1}`;
    setQueries([...queries, { id, name: `Query ${count + 1}`, text: 'SELECT 1;' }]);
    setActiveTabId(id);
    setCount(count + 1);
  };

  const tabs: TabsProps.Tab[] = queries.map(query => ({
    id: query.id,
    label: query.name,
    content: <Box variant="code">{query.text}</Box>,
    dismissible: true,
    dismissLabel: `Close ${query.name}`,
    onDismiss: () => close(query.id),
  }));

  return (
    <SpaceBetween size="s">
      <Button iconName="add" onClick={open}>
        New query
      </Button>
      {tabs.length > 0 ? (
        <Tabs
          ariaLabel="Open queries"
          variant="container"
          tabs={tabs}
          activeTabId={activeTabId}
          onChange={event => setActiveTabId(event.detail.activeTabId)}
        />
      ) : (
        <Box color="text-body-secondary">No queries open.</Box>
      )}
    </SpaceBetween>
  );
}
