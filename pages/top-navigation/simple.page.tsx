// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Input from '~components/input';
import TopNavigation, { TopNavigationProps } from '~components/top-navigation';

import styles from './styles.module.scss';

const logo =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
      '<rect width="28" height="28" fill="#131416"/><path d="M14 5v18M5 14h18" stroke="#fff" stroke-width="2"/></svg>'
  );

const widths = [960, 640, 420, 320];

function Search() {
  const [value, setValue] = useState('');
  return (
    <div className={styles.search}>
      <Input
        type="search"
        value={value}
        placeholder="Search courses"
        ariaLabel="Search courses"
        onChange={event => setValue(event.detail.value)}
      />
    </div>
  );
}

function useUtilities(log: (entry: string) => void): TopNavigationProps.Utility[] {
  const route = (name: string) => (event: CustomEvent) => {
    event.preventDefault();
    log(name);
  };
  return [
    {
      type: 'button',
      text: 'Docs',
      iconName: 'file',
      href: 'https://example.com/docs',
      external: true,
      externalIconAriaLabel: 'Opens in a new tab',
    },
    {
      type: 'button',
      iconName: 'notification',
      ariaLabel: 'Notifications (unread)',
      badge: true,
      disableUtilityCollapse: true,
      onClick: route('Notifications'),
    },
    {
      type: 'menu-dropdown',
      text: 'Settings',
      iconName: 'adjust',
      items: [
        { id: 'language', text: 'Language and region' },
        { id: 'theme', text: 'Theme' },
        { id: 'shortcuts', text: 'Keyboard shortcuts', secondaryText: '?' },
      ],
      onItemClick: event => log(`Settings: ${event.detail.id}`),
    },
    {
      type: 'menu-dropdown',
      text: 'Ada Lovelace',
      iconName: 'person',
      title: 'Ada Lovelace',
      description: 'ada@example.com',
      items: [
        { id: 'profile', text: 'Profile' },
        { id: 'preferences', text: 'Preferences' },
        {
          text: 'Support',
          items: [{ id: 'help', text: 'Help center', href: 'https://example.com/help', external: true }],
        },
        { id: 'sign-out', text: 'Sign out', iconName: 'sign-out' },
      ],
      onItemClick: event => log(`Account: ${event.detail.id}`),
    },
  ];
}

export default function TopNavigationSimple() {
  const [entry, setEntry] = useState('Nothing chosen yet.');
  const utilities = useUtilities(setEntry);
  const identity: TopNavigationProps.Identity = {
    href: '#top-navigation/simple',
    title: 'Learning Lab',
    logo: { src: logo, alt: 'Learning Lab' },
    onFollow: event => {
      event.preventDefault();
      setEntry('Home');
    },
  };

  return (
    <article className={styles.page}>
      <h1>Top navigation</h1>
      <p className={styles.log} aria-live="polite">
        {entry}
      </p>
      <section className={styles.section}>
        <h2>Full width, with search</h2>
        <div className={styles.frame}>
          <TopNavigation identity={identity} utilities={utilities} search={<Search />} />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Primary button utility, no search</h2>
        <div className={styles.frame}>
          <TopNavigation
            identity={{ href: '#top-navigation/simple', title: 'Learning Lab' }}
            utilities={[
              { type: 'button', text: 'Pricing', href: '#top-navigation/simple' },
              { type: 'button', text: 'Sign in', href: '#top-navigation/simple' },
              { type: 'button', text: 'Start learning', variant: 'primary-button', disableUtilityCollapse: true },
            ]}
          />
        </div>
      </section>
      {widths.map(width => (
        <section key={width} className={styles.section}>
          <h2>{width} pixels</h2>
          <div className={styles.frame} style={{ inlineSize: width }}>
            <TopNavigation identity={identity} utilities={utilities} />
          </div>
        </section>
      ))}
      <section className={styles.section}>
        <h2>Logo only</h2>
        <div className={styles.frame} style={{ inlineSize: 420 }}>
          <TopNavigation identity={{ href: '#top-navigation/simple', logo: { src: logo, alt: 'Learning Lab' } }} />
        </div>
      </section>
    </article>
  );
}
