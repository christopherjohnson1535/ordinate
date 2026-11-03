// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ActionCard from '@ordinate/components/action-card';
import Box from '@ordinate/components/box';
import TextFilter from '@ordinate/components/text-filter';

import { href } from '../app/router';
import { PageFrame } from '../parts/page-frame';
import { DocSection } from '../parts/prose';
import { componentDocs, componentsInGroup, groups, sheetOfComponent } from '../registry/components';
import { ComponentDoc } from '../registry/types';

import styles from './component-index.module.scss';

const matches = (doc: ComponentDoc, filter: string) => {
  const text = filter.trim().toLowerCase();
  return !text || `${doc.name} ${doc.folder} ${doc.summary}`.toLowerCase().includes(text);
};

export default function ComponentIndex() {
  const [filter, setFilter] = useState('');
  const shown = componentDocs.filter(doc => matches(doc, filter));
  let number = 0;

  return (
    <PageFrame
      code="C-000"
      title="Components"
      description={`Every component in @ordinate/components and @ordinate/charts, ${componentDocs.length} in all, grouped by what they do. Each page has runnable examples, guidelines and the full API.`}
      lead={
        <div className={styles.filter}>
          <TextFilter
            filteringText={filter}
            filteringPlaceholder="Find a component"
            filteringAriaLabel="Find a component"
            filteringClearAriaLabel="Clear"
            countText={filter ? `${shown.length} of ${componentDocs.length}` : undefined}
            onChange={event => setFilter(event.detail.filteringText)}
          />
        </div>
      }
    >
      {shown.length === 0 && <Box color="text-body-secondary">No component matches “{filter.trim()}”.</Box>}
      {groups.map(group => {
        const docs = componentsInGroup(group.id).filter(doc => matches(doc, filter));
        if (!docs.length) {
          return null;
        }
        return (
          <DocSection key={group.id} id={group.id} number={++number} title={group.title} description={group.summary}>
            <ul className={styles.grid}>
              {docs.map(doc => (
                <li key={doc.folder}>
                  <ActionCard
                    href={href(`/components/${doc.folder}`)}
                    header={doc.name}
                    description={doc.summary}
                    kind={doc.package === 'charts' ? 'resource' : 'neutral'}
                  >
                    <span className={styles.sheet}>{sheetOfComponent(doc)}</span>
                  </ActionCard>
                </li>
              ))}
            </ul>
          </DocSection>
        );
      })}
    </PageFrame>
  );
}
