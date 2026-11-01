// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import styles from './specimen.module.scss';

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/**
 * One group of the specimen sheet, as the README groups the components. The number is the group's
 * place on the sheet, drawn like a sheet number.
 */
export function Group({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  const id = `group-${slug(title)}`;
  return (
    <section className={styles.group} aria-labelledby={id}>
      <div className={styles['group-head']}>
        <span className={styles['group-number']} aria-hidden="true">
          {String(number).padStart(2, '0')}
        </span>
        <h2 id={id} className={styles['group-title']}>
          {title}
        </h2>
      </div>
      <div className={styles.grid}>{children}</div>
    </section>
  );
}

/**
 * One component on the sheet: its name as a small caption, then a working example. `wide` gives the
 * example the full width of the sheet; `note` says what to do with it when that is not obvious.
 */
export function Cell({
  name,
  wide = false,
  note,
  children,
}: {
  name: string;
  wide?: boolean;
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? `${styles.cell} ${styles.wide}` : styles.cell}>
      <h3 className={styles.name}>{name}</h3>
      {note && <p className={styles.note}>{note}</p>}
      <div className={styles.example}>{children}</div>
    </div>
  );
}

/** A box of fixed height for components that fill their container, such as layouts and drawers. */
export function Frame({
  height = 'medium',
  children,
}: {
  height?: 'short' | 'medium' | 'tall';
  children: React.ReactNode;
}) {
  return <div className={`${styles.frame} ${styles[`frame-${height}`]}`}>{children}</div>;
}

/** A labelled stand-in block, to show how layout components place their children. */
export function Swatch({ children }: { children: React.ReactNode }) {
  return <div className={styles.swatch}>{children}</div>;
}

/** A row of small examples that wraps, for buttons, badges and the like. */
export function Row({ children }: { children: React.ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

/** A line of plain text that reports what an interactive example did. */
export function Readout({ children }: { children: React.ReactNode }) {
  return <p className={styles.readout}>{children}</p>;
}
