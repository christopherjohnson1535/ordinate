// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonGroup, { ButtonGroupProps } from '~components/button-group';

import styles from './styles.module.scss';

const menuItems = [
  { id: 'report', text: 'Report a problem', iconName: 'flag' },
  { id: 'wrap', text: 'Wrap lines', itemType: 'checkbox', checked: false },
  { id: 'docs', text: 'Documentation', href: 'https://example.com/docs', external: true },
] as const;

function ResponseActions() {
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [wrap, setWrap] = useState(false);
  const [entry, setEntry] = useState('Nothing clicked yet.');

  const items: ButtonGroupProps.ItemOrGroup[] = [
    {
      type: 'group',
      text: 'Vote',
      items: [
        {
          type: 'icon-toggle-button',
          id: 'up',
          text: 'Helpful',
          iconName: 'thumbs-up',
          pressedIconName: 'thumbs-up-filled',
          pressed: vote === 'up',
        },
        {
          type: 'icon-toggle-button',
          id: 'down',
          text: 'Not helpful',
          iconName: 'thumbs-down',
          pressedIconName: 'thumbs-down-filled',
          pressed: vote === 'down',
        },
      ],
    },
    {
      type: 'group',
      text: 'Actions',
      items: [
        { type: 'icon-button', id: 'copy', text: 'Copy', iconName: 'copy', popoverFeedback: 'Copied' },
        { type: 'icon-button', id: 'retry', text: 'Retry', iconName: 'refresh' },
        { type: 'icon-button', id: 'share', text: 'Share', iconName: 'share', disabled: true },
      ],
    },
    {
      type: 'menu-dropdown',
      id: 'more',
      text: 'More actions',
      items: menuItems.map(item => (item.id === 'wrap' ? { ...item, checked: wrap } : item)),
    },
  ];

  return (
    <>
      <ButtonGroup
        ariaLabel="Response actions"
        items={items}
        onItemClick={event => {
          const { id, pressed, checked } = event.detail;
          if (id === 'up' || id === 'down') {
            setVote(pressed ? id : null);
          }
          if (id === 'wrap' && checked !== undefined) {
            setWrap(checked);
          }
          setEntry(`onItemClick ${JSON.stringify(event.detail)}`);
        }}
      />
      <p className={styles.log} aria-live="polite">
        {entry}
      </p>
    </>
  );
}

const editorItems: ButtonGroupProps.ItemOrGroup[] = [
  { type: 'icon-button', id: 'undo', text: 'Undo', iconName: 'undo' },
  { type: 'icon-button', id: 'redo', text: 'Redo', iconName: 'redo', disabled: true },
  {
    type: 'group',
    text: 'View',
    items: [
      { type: 'icon-button', id: 'zoom-in', text: 'Zoom in', iconName: 'zoom-in' },
      { type: 'icon-button', id: 'zoom-out', text: 'Zoom out', iconName: 'zoom-out' },
      { type: 'icon-button', id: 'fit', text: 'Zoom to fit', iconName: 'zoom-to-fit' },
    ],
  },
  { type: 'icon-button', id: 'save', text: 'Save', iconName: 'download', loading: true, loadingText: 'Saving' },
  {
    type: 'menu-dropdown',
    id: 'settings',
    text: 'Settings',
    iconName: 'settings',
    items: [
      { id: 'grid', text: 'Show grid' },
      { id: 'rulers', text: 'Show rulers' },
    ],
  },
];

export default function ButtonGroupSimple() {
  return (
    <article className={styles.page}>
      <h1>Button group</h1>

      <section className={styles.section}>
        <h2>Response actions</h2>
        <ResponseActions />
      </section>

      <section className={styles.section}>
        <h2>Loose actions, a group and a settings menu</h2>
        <ButtonGroup ariaLabel="Drawing tools" items={editorItems} />
      </section>

      <section className={styles.section}>
        <h2>At the end of the line</h2>
        <div className={styles.end}>
          <ButtonGroup
            ariaLabel="Row actions"
            items={[
              { type: 'icon-button', id: 'edit', text: 'Edit', iconName: 'edit' },
              {
                type: 'icon-button',
                id: 'copy',
                text: 'Copy link',
                iconName: 'anchor-link',
                popoverFeedback: 'Link copied',
              },
              { type: 'menu-dropdown', id: 'more', text: 'More', items: [{ id: 'delete', text: 'Delete' }] },
            ]}
          />
        </div>
      </section>
    </article>
  );
}
