// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CodeView, { CodeViewProps } from '@ordinate/components/code-view';
import CopyToClipboard from '@ordinate/components/copy-to-clipboard';
import Icon from '@ordinate/components/icon';
import TextContent from '@ordinate/components/text-content';

import styles from './prose.module.scss';

/**
 * A numbered section of a page, opened by its number, its heading and an ink rule, like a group
 * on a drawing sheet. Its heading is listed in the "On this sheet" scale.
 */
export function DocSection({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string;
  number?: number;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <div className={styles['section-head']}>
        {number !== undefined && (
          <span className={styles['section-number']} aria-hidden="true">
            {String(number).padStart(2, '0')}
          </span>
        )}
        <h2 id={id} className={styles['section-title']} data-anchor={title} data-anchor-level={1}>
          {title}
        </h2>
      </div>
      {description && <div className={styles['section-description']}>{description}</div>}
      <div className={styles['section-body']}>{children}</div>
    </section>
  );
}

/** A subheading inside a section, listed one step in on the "On this sheet" scale. */
export function SubHeading({ id, children }: { id: string; children: string }) {
  return (
    <h3 id={id} className={styles.subheading} data-anchor={children} data-anchor-level={2}>
      {children}
    </h3>
  );
}

/** Running text: paragraphs, lists, inline code and links, at a readable measure. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.prose}>
      <TextContent>{children}</TextContent>
    </div>
  );
}

/** A code sample with a file label and a copy button. Prefer an example when the code can run. */
export function CodeBlock({
  code,
  language = 'typescript',
  label,
  highlightedLines,
}: {
  code: string;
  language?: CodeViewProps.Language;
  /** A file name or a short description, such as `astro.config.mjs` or `Terminal`. */
  label: string;
  highlightedLines?: ReadonlyArray<number>;
}) {
  const text = code.replace(/^\n/, '').trimEnd();
  const lines = text.split('\n').length;
  return (
    <figure className={styles.code}>
      <figcaption className={styles['code-label']}>
        <span>{label}</span>
        <CopyToClipboard
          variant="icon"
          textToCopy={text}
          copyButtonAriaLabel={`Copy ${label}`}
          copySuccessText="Copied"
          copyErrorText="The browser did not allow copying"
        />
      </figcaption>
      <CodeView
        content={text}
        language={language}
        ariaLabel={label}
        lineNumbers={lines > 3}
        highlightedLines={highlightedLines}
      />
    </figure>
  );
}

/** A command to run in a terminal, set on one line with a copy button. */
export function Command({ children }: { children: string }) {
  return (
    <div className={styles.command}>
      <span className={styles['command-prompt']} aria-hidden="true">
        $
      </span>
      <code className={styles['command-text']}>{children}</code>
      <CopyToClipboard
        variant="icon"
        textToCopy={children}
        copyButtonAriaLabel={`Copy the command ${children}`}
        copySuccessText="Copied"
        copyErrorText="The browser did not allow copying"
      />
    </div>
  );
}

/** When to use a component and when to reach for something else, side by side. */
export function UseAvoid({
  use,
  avoid,
}: {
  use?: ReadonlyArray<React.ReactNode>;
  avoid?: ReadonlyArray<React.ReactNode>;
}) {
  return (
    <div className={styles['use-avoid']}>
      {use && use.length > 0 && (
        <div className={styles.column}>
          <h3 className={styles['column-title']}>
            <Icon name="complete" variant="success" /> Use it
          </h3>
          <ul className={styles.list}>
            {use.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {avoid && avoid.length > 0 && (
        <div className={styles.column}>
          <h3 className={styles['column-title']}>
            <Icon name="fault" variant="error" /> Pick something else
          </h3>
          <ul className={styles.list}>
            {avoid.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** A plain bulleted list at the reading measure, for writing and accessibility notes. */
export function Notes({ items }: { items: ReadonlyArray<React.ReactNode> }) {
  return (
    <ul className={`${styles.list} ${styles.notes}`}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
