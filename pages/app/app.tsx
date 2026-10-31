// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { applyMode, applyRevision, Mode, Revision } from '~global-styles';

import styles from './styles.module.scss';

interface PageModule {
  default: React.ComponentType;
}

const pages = import.meta.glob<PageModule>('../*/*.page.tsx', { eager: true });

const routes = Object.entries(pages)
  .map(([file, module]) => ({ path: file.replace('../', '').replace('.page.tsx', ''), Page: module.default }))
  .sort((a, b) => a.path.localeCompare(b.path));

function useHashPath() {
  const [path, setPath] = useState(() => window.location.hash.slice(1));
  useEffect(() => {
    const onChange = () => setPath(window.location.hash.slice(1));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}

export default function App() {
  const path = useHashPath();
  const [mode, setMode] = useState<Mode>(Mode.Light);
  const [revision, setRevision] = useState<Revision>(Revision.V2026_1);

  useEffect(() => applyMode(mode), [mode]);
  useEffect(() => applyRevision(revision), [revision]);

  const current = routes.find(route => route.path === path);

  return (
    <div className={styles.layout}>
      <header className={styles.toolbar}>
        <a className={styles.home} href="#">
          Ordinate
        </a>
        <label className={styles.setting}>
          Mode
          <select value={mode} onChange={event => setMode(event.target.value as Mode)}>
            {Object.values(Mode).map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.setting}>
          Revision
          <select value={revision} onChange={event => setRevision(event.target.value as Revision)}>
            {Object.values(Revision).map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </header>
      <nav className={styles.nav} aria-label="Pages">
        <ul>
          {routes.map(route => (
            <li key={route.path}>
              <a href={`#${route.path}`} aria-current={route.path === path ? 'page' : undefined}>
                {route.path}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <main className={styles.main}>{current ? <current.Page /> : <p>Choose a page from the list.</p>}</main>
    </div>
  );
}
