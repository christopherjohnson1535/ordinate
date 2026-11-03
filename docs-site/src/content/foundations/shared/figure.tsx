// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { applyMode, Mode } from '@ordinate/global-styles';

import styles from './figure.module.scss';

/**
 * A live drawing on a foundation sheet: the components on paper, over a faint drafting grid, with a
 * caption strip under it. The code, such as `M5`, is lettered before the caption.
 */
export function Figure({
  code,
  caption,
  layout = 'padded',
  grid = true,
  className,
  children,
}: {
  code?: string;
  caption?: React.ReactNode;
  layout?: 'padded' | 'centered' | 'flush';
  grid?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className={styles.figure}>
      <div className={clsx(styles.stage, styles[`layout-${layout}`], grid && styles.grid, className)}>{children}</div>
      {(code || caption) && (
        <figcaption className={styles.caption}>
          {code && <span className={styles['caption-code']}>{code}</span>}
          {caption && <span>{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/** One pane drawn in a fixed color mode, whatever the page is set to. */
export function ModePane({
  mode,
  label,
  className,
  children,
}: {
  mode: 'light' | 'dark';
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      applyMode(mode === 'dark' ? Mode.Dark : Mode.Light, ref.current);
    }
  }, [mode]);
  return (
    <div ref={ref} className={clsx(styles.pane, className)}>
      {label && <p className={styles['pane-label']}>{label}</p>}
      {children}
    </div>
  );
}

/** The same drawing in light and dark mode, side by side. */
export function ModePair({ render }: { render: (mode: 'light' | 'dark') => React.ReactNode }) {
  return (
    <div className={styles.pair}>
      <ModePane mode="light" label="Light">
        {render('light')}
      </ModePane>
      <ModePane mode="dark" label="Dark">
        {render('dark')}
      </ModePane>
    </div>
  );
}

/** Words on the left, the drawing on the right; stacked when the sheet is narrow. */
export function Split({ text, children }: { text: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={styles.split}>
      <div className={styles['split-inner']}>
        <div className={styles['split-text']}>{text}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}

/** Short labelled facts, such as "Means" and "Used by", lettered like a title block. */
export function Facts({ items }: { items: ReadonlyArray<[string, React.ReactNode]> }) {
  return (
    <dl className={styles.facts}>
      {items.map(([term, detail]) => (
        <div key={term} className={styles.fact}>
          <dt>{term}</dt>
          <dd>{detail}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A reference in mono, such as M5 or P2, in a kind's color. */
export function Reference({
  children,
  kind = 'configuration',
}: {
  children: React.ReactNode;
  kind?: 'configuration' | 'resource' | 'policy';
}) {
  return (
    <span className={clsx(styles.reference, kind !== 'configuration' && styles[`reference-${kind}`])}>
      {children}
    </span>
  );
}

/** The token's CSS custom property name, such as `--ord-space-m`, from its JS name, such as `spaceM`. */
export function cssVariableOf(jsName: string): string {
  return `--ord-${jsName.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
}

/** The token's Sass name, such as `$space-m`, from its JS name. */
export function sassNameOf(jsName: string): string {
  return `$${cssVariableOf(jsName).slice('--ord-'.length)}`;
}

/** Reads a token's computed value on an element, so it follows the mode, revision and density there. */
export function readToken(element: Element, jsName: string): string {
  return getComputedStyle(element).getPropertyValue(cssVariableOf(jsName)).trim();
}
