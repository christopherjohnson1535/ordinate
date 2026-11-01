// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';

import styles from './styles.module.scss';

const actions: ButtonDropdownProps.Items = [
  { id: 'start', text: 'Start', iconName: 'play' },
  { id: 'stop', text: 'Stop', iconName: 'stop-circle', disabled: true, disabledReason: 'The instance is stopped.' },
  { id: 'reboot', text: 'Reboot', iconName: 'refresh', description: 'Restarts the operating system' },
  { id: 'copy', text: 'Copy ID', iconName: 'copy', secondaryText: 'Ctrl+C' },
  { id: 'docs', text: 'Documentation', href: 'https://example.com/docs', external: true },
];

const grouped: ButtonDropdownProps.Items = [
  {
    id: 'state',
    text: 'Instance state',
    items: [
      { id: 'start', text: 'Start' },
      { id: 'stop', text: 'Stop' },
      { id: 'hibernate', text: 'Hibernate', disabled: true, disabledReason: 'Hibernation is not enabled.' },
    ],
  },
  {
    id: 'view',
    text: 'View',
    items: [
      { id: 'wrap', text: 'Wrap lines', itemType: 'checkbox', checked: true },
      { id: 'numbers', text: 'Line numbers', itemType: 'checkbox', checked: false, secondaryText: 'Ctrl+L' },
    ],
  },
  { id: 'delete', text: 'Delete', iconName: 'remove' },
];

const nested: ButtonDropdownProps.Items = [
  {
    id: 'networking',
    text: 'Networking',
    iconName: 'globe',
    items: [
      { id: 'attach', text: 'Attach address' },
      { id: 'detach', text: 'Detach address' },
      {
        id: 'security',
        text: 'Security',
        items: [
          { id: 'groups', text: 'Change security groups' },
          { id: 'keys', text: 'Rotate keys' },
        ],
      },
    ],
  },
  {
    id: 'storage',
    text: 'Storage',
    iconName: 'folder',
    items: [
      { id: 'snapshot', text: 'Create snapshot' },
      { id: 'resize', text: 'Resize volume' },
    ],
  },
  { id: 'monitor', text: 'Monitoring', iconName: 'notification', disabled: true, items: [] },
  { id: 'terminate', text: 'Terminate' },
];

function useLog() {
  const [entry, setEntry] = useState('Nothing chosen yet.');
  const onItemClick = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
    if (event.detail.href) {
      event.preventDefault();
    }
    setEntry(`onItemClick ${JSON.stringify(event.detail)}`);
  };
  return { entry, onItemClick };
}

function CheckboxMenu() {
  const [checked, setChecked] = useState<Record<string, boolean>>({ wrap: true, numbers: false });
  const items = grouped.map(entry =>
    'items' in entry && entry.id === 'view'
      ? {
          ...entry,
          items: entry.items.map(item => ('id' in item && item.id ? { ...item, checked: checked[item.id] } : item)),
        }
      : entry
  );
  return (
    <ButtonDropdown
      items={items}
      onItemClick={event => {
        const { id, checked: next } = event.detail;
        if (next !== undefined) {
          setChecked(current => ({ ...current, [id]: next }));
        }
      }}
    >
      Groups and checkboxes
    </ButtonDropdown>
  );
}

export default function ButtonDropdownSimple() {
  const log = useLog();

  return (
    <article className={styles.page}>
      <h1>Button dropdown</h1>
      <p className={styles.log} aria-live="polite">
        {log.entry}
      </p>

      <section className={styles.section}>
        <h2>Variants</h2>
        <div className={styles.row}>
          <ButtonDropdown items={actions} onItemClick={log.onItemClick}>
            Actions
          </ButtonDropdown>
          <ButtonDropdown items={actions} variant="primary" onItemClick={log.onItemClick}>
            Launch
          </ButtonDropdown>
          <ButtonDropdown items={actions} variant="icon" ariaLabel="Instance actions" onItemClick={log.onItemClick} />
          <ButtonDropdown items={actions} variant="inline-icon" onItemClick={log.onItemClick} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Disabled and loading</h2>
        <div className={styles.row}>
          <ButtonDropdown items={actions} disabled={true}>
            Actions
          </ButtonDropdown>
          <ButtonDropdown items={actions} variant="primary" disabled={true}>
            Launch
          </ButtonDropdown>
          <ButtonDropdown items={actions} loading={true} loadingText="Loading actions">
            Actions
          </ButtonDropdown>
          <ButtonDropdown items={actions} variant="icon" disabled={true} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Split buttons</h2>
        <div className={styles.row}>
          <ButtonDropdown
            items={actions}
            mainAction={{ text: 'Start instance', iconName: 'play', onClick: () => undefined }}
            ariaLabel="More start options"
            onItemClick={log.onItemClick}
          />
          <ButtonDropdown
            items={actions}
            variant="primary"
            mainAction={{ text: 'Launch', onClick: () => undefined }}
            ariaLabel="More launch options"
            onItemClick={log.onItemClick}
          />
          <ButtonDropdown
            items={actions}
            variant="primary"
            mainAction={{ text: 'Launch', disabled: true }}
            ariaLabel="More launch options"
          />
          <ButtonDropdown
            items={actions}
            mainAction={{ text: 'Open console', href: 'https://example.com', external: true }}
            ariaLabel="More console options"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Groups, checkboxes and sub-menus</h2>
        <div className={styles.row}>
          <CheckboxMenu />
          <ButtonDropdown items={nested} expandableGroups={true} onItemClick={log.onItemClick}>
            Expandable groups
          </ButtonDropdown>
        </div>
      </section>

      <section className={styles.section}>
        <h2>At the end of the line</h2>
        <div className={styles.end}>
          <ButtonDropdown items={actions} variant="icon" ariaLabel="Instance actions" onItemClick={log.onItemClick} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>In a container that clips overflow</h2>
        <div className={styles.clipped}>
          <ButtonDropdown items={actions}>Clipped</ButtonDropdown>
          <ButtonDropdown items={actions} expandToViewport={true} onItemClick={log.onItemClick}>
            Expands to viewport
          </ButtonDropdown>
        </div>
      </section>

      <section className={styles.section}>
        <h2>In a table row</h2>
        <table className={styles.table}>
          <tbody>
            {['north-annex', 'south-annex'].map(name => (
              <tr key={name}>
                <td>{name}</td>
                <td>Running</td>
                <td>
                  <ButtonDropdown
                    items={actions}
                    variant="inline-icon"
                    ariaLabel={`Actions for ${name}`}
                    onItemClick={log.onItemClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={`${styles.section} ${styles.bottom}`}>
        <h2>Near the bottom</h2>
        <div className={styles.row}>
          <ButtonDropdown items={grouped}>Opens above</ButtonDropdown>
        </div>
      </section>
    </article>
  );
}
