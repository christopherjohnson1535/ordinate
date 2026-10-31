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
  .map(([file, module]) => {
    const path = file.replace('../', '').replace('.page.tsx', '');
    const [group, name] = path.split('/');
    return { path, group, name, Page: module.default };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const groups = Array.from(new Set(routes.map(route => route.group)));

function useHashPath() {
  const [path, setPath] = useState(() => window.location.hash.slice(1));
  useEffect(() => {
    const onChange = () => setPath(window.location.hash.slice(1));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.setting}>
      <span className={styles['setting-label']}>{label}</span>
      <div className={styles.segmented} role="group" aria-label={label}>
        {options.map(option => (
          <button key={option} type="button" aria-pressed={option === value} onClick={() => onChange(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const path = useHashPath();
  const [mode, setMode] = useState<Mode>(Mode.Light);
  const [revision, setRevision] = useState<Revision>(Revision.V2026_1);

  useEffect(() => applyMode(mode), [mode]);
  useEffect(() => applyRevision(revision), [revision]);

  const current = routes.find(route => route.path === path);

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <a className={styles.brand} href="#">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <rect width="22" height="22" className={styles['brand-mark']} />
            <path d="M11 4v14M4 11h14" className={styles['brand-cross']} />
          </svg>
          Ordinate
        </a>
        <nav className={styles.nav} aria-label="Pages">
          {groups.map(group => (
            <React.Fragment key={group}>
              <div className={styles.group}>{group}</div>
              {routes
                .filter(route => route.group === group)
                .map(route => (
                  <a key={route.path} href={`#${route.path}`} aria-current={route.path === path ? 'page' : undefined}>
                    {route.name}
                  </a>
                ))}
            </React.Fragment>
          ))}
        </nav>
      </aside>
      <header className={styles.top}>
        <span className={styles.crumb}>{current ? current.path : 'Choose a page'}</span>
        <Segmented label="Mode" options={Object.values(Mode)} value={mode} onChange={setMode} />
        <Segmented label="Revision" options={Object.values(Revision)} value={revision} onChange={setRevision} />
      </header>
      <main className={styles.sheet}>{current ? <current.Page /> : <p>Choose a page from the list.</p>}</main>
    </div>
  );
}
