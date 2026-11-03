// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Cards from '@ordinate/components/cards';
import Header from '@ordinate/components/header';

interface Template {
  id: string;
  name: string;
  description: string;
  nodes: number;
  retired?: boolean;
}

const templates: Template[] = [
  { id: 'C1', name: 'Web service', description: 'A public service behind the load balancer', nodes: 3 },
  { id: 'C2', name: 'Batch worker', description: 'Runs jobs from the queue on a schedule', nodes: 2 },
  { id: 'C3', name: 'Static site', description: 'Serves files from object storage', nodes: 1 },
  { id: 'C4', name: 'Legacy API', description: 'Retired: use Web service instead', nodes: 4, retired: true },
];

export default function Selection() {
  const [selected, setSelected] = useState<ReadonlyArray<Template>>([templates[0]]);

  return (
    <Cards
      items={templates}
      trackBy="id"
      kind="configuration"
      selectionType="multi"
      selectedItems={selected}
      onSelectionChange={event => setSelected(event.detail.selectedItems)}
      isItemDisabled={template => Boolean(template.retired)}
      entireCardClickable={true}
      cardsPerRow={[{ cards: 1 }, { minWidth: 600, cards: 2 }]}
      ariaLabels={{
        selectionGroupLabel: 'Templates',
        itemSelectionLabel: (_, template) => `Select ${template.name}`,
      }}
      header={
        <Header
          counter={`(${selected.length}/${templates.length})`}
          actions={<Button disabled={selected.length === 0}>Copy to project</Button>}
        >
          Templates
        </Header>
      }
      cardDefinition={{
        header: template => template.name,
        reference: template => template.id,
        sections: [
          { id: 'description', content: template => template.description },
          { id: 'nodes', header: 'Nodes', content: template => template.nodes },
        ],
      }}
    />
  );
}
