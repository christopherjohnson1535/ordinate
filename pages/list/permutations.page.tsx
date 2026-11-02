// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import Icon from '~components/icon';
import List, { ListProps } from '~components/list';

import styles from './styles.module.scss';

interface Stage {
  id: string;
  title: string;
  detail?: string;
}

const stages: Stage[] = [
  { id: 'build', title: 'Build', detail: 'Compile, lint and run the unit tests' },
  { id: 'stage', title: 'Deploy to staging' },
  { id: 'verify', title: 'Verify', detail: 'Smoke tests against the staging endpoints' },
  { id: 'prod', title: 'Deploy to production', detail: 'One zone at a time, forty minutes in all' },
];

const renderStage = (stage: Stage): ListProps.RenderedItem => ({
  id: stage.id,
  content: stage.title,
  secondaryContent: stage.detail,
  icon: <Icon name="status-pending" />,
  actions: <Button variant="icon" iconName="edit" ariaLabel={`Edit ${stage.title}`} />,
});

function SortableStages() {
  const [items, setItems] = useState(stages);
  return (
    <List
      ariaLabel="Pipeline stages"
      items={items}
      renderItem={stage => ({ id: stage.id, content: stage.title, secondaryContent: stage.detail })}
      sortable={true}
      onSortingChange={event => setItems(event.detail.items)}
    />
  );
}

export default function ListPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">List</Box>

      <Container heading="Icons, secondary text and actions">
        <List ariaLabel="Pipeline stages" items={stages} renderItem={renderStage} />
      </Container>

      <Container heading="Plain, ordered">
        <List
          ariaLabel="Steps"
          tagOverride="ol"
          items={['Pick a region', 'Choose a node size', 'Review and create']}
          renderItem={step => ({ id: step, content: step })}
        />
      </Container>

      <Container heading="Sortable">
        <SortableStages />
      </Container>
    </div>
  );
}
