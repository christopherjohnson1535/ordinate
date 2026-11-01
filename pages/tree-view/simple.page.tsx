// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '~components/badge';
import ButtonDropdown from '~components/button-dropdown';
import Icon from '~components/icon';
import TreeView, { TreeViewProps } from '~components/tree-view';

import styles from './styles.module.scss';

interface Entry {
  id: string;
  name: string;
  detail?: string;
  children?: Entry[];
}

const files: Entry[] = [
  {
    id: 'src',
    name: 'src',
    detail: '3 folders',
    children: [
      {
        id: 'src/button',
        name: 'button',
        children: [
          { id: 'src/button/index.tsx', name: 'index.tsx', detail: '1.2 KB' },
          { id: 'src/button/internal.tsx', name: 'internal.tsx', detail: '6.8 KB' },
          { id: 'src/button/styles.scss', name: 'styles.scss', detail: '3.1 KB' },
        ],
      },
      {
        id: 'src/tree-view',
        name: 'tree-view',
        children: [
          { id: 'src/tree-view/index.tsx', name: 'index.tsx', detail: '0.9 KB' },
          { id: 'src/tree-view/utils.ts', name: 'utils.ts', detail: '2.4 KB' },
        ],
      },
      { id: 'src/index.ts', name: 'index.ts', detail: 'Generated' },
    ],
  },
  { id: 'docs', name: 'docs', detail: '6 files', children: [{ id: 'docs/STYLING.md', name: 'STYLING.md' }] },
  { id: 'package.json', name: 'package.json', detail: '2.0 KB' },
];

const plant: Entry[] = [
  {
    id: 'plant',
    name: 'North annex plant',
    children: [
      {
        id: 'boiler',
        name: 'Boiler house',
        children: [
          {
            id: 'b1',
            name: 'Boiler 1',
            children: [
              { id: 'b1-burner', name: 'Burner' },
              { id: 'b1-feed', name: 'Feed pump' },
            ],
          },
          { id: 'b2', name: 'Boiler 2' },
        ],
      },
      { id: 'cooling', name: 'Cooling tower' },
    ],
  },
];

const getItemId = (entry: Entry) => entry.id;
const getItemChildren = (entry: Entry) => entry.children;

function useExpanded(initial: string[]) {
  const [expanded, setExpanded] = useState<ReadonlyArray<string>>(initial);
  const onItemToggle: TreeViewProps<Entry>['onItemToggle'] = event => {
    const { id, expanded: isExpanded } = event.detail;
    setExpanded(current => (isExpanded ? [...current, id] : current.filter(other => other !== id)));
  };
  return { expandedItems: expanded, onItemToggle };
}

export default function TreeViewSimple() {
  const fileState = useExpanded(['src', 'src/button']);
  const plainState = useExpanded(['src']);
  const plantState = useExpanded(['plant', 'boiler', 'b1']);

  return (
    <article className={styles.page}>
      <h1>Tree view</h1>

      <section className={styles.section}>
        <h2 id="files-heading">Icons, secondary content and actions</h2>
        <div className={styles.frame}>
          <TreeView
            items={files}
            getItemId={getItemId}
            getItemChildren={getItemChildren}
            ariaLabelledby="files-heading"
            {...fileState}
            renderItem={entry => ({
              content: entry.name,
              secondaryContent: entry.detail,
              icon: <Icon name={entry.children ? 'folder' : 'file'} />,
              actions: (
                <ButtonDropdown
                  variant="inline-icon"
                  ariaLabel={`Actions for ${entry.name}`}
                  items={[
                    { id: 'rename', text: 'Rename' },
                    { id: 'delete', text: 'Delete' },
                  ]}
                />
              ),
            })}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Content only</h2>
        <div className={styles.frame}>
          <TreeView
            items={files}
            getItemId={getItemId}
            getItemChildren={getItemChildren}
            ariaLabel="Files"
            {...plainState}
            renderItem={entry => ({ content: entry.name })}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Deep nesting and rich content</h2>
        <div className={styles.frame}>
          <TreeView
            items={plant}
            getItemId={getItemId}
            getItemChildren={getItemChildren}
            ariaLabel="Plant equipment"
            {...plantState}
            renderItem={entry => ({
              content: (
                <span className={styles.rich}>
                  {entry.name}
                  {entry.id === 'b1' && <Badge color="red">Alarm</Badge>}
                </span>
              ),
              announcementLabel: entry.id === 'b1' ? `${entry.name}, alarm` : entry.name,
            })}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Custom toggle icon, uncontrolled</h2>
        <div className={styles.frame}>
          <TreeView
            items={plant}
            getItemId={getItemId}
            getItemChildren={getItemChildren}
            ariaLabel="Plant equipment, custom toggles"
            renderItemToggleIcon={({ expanded }) => (
              <Icon name={expanded ? 'caret-down-filled' : 'caret-right-filled'} />
            )}
            renderItem={entry => ({ content: entry.name })}
          />
        </div>
      </section>
    </article>
  );
}
