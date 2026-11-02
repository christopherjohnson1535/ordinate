// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId } from 'react';
import clsx from 'clsx';

import { DimensionLine } from '../internal/components/dimension-line';
import { Heading } from '../internal/components/heading';
import { ContainerProps } from './interfaces';

import styles from './styles.css.js';

export type InternalContainerProps = ContainerProps;

const isPresent = (node: React.ReactNode) => node !== undefined && node !== null && node !== false && node !== '';

/**
 * A section drawn like a detail on a drawing: construction lines that run past their corners, a dimension
 * line along the top of the content, hash marks wherever lines end or meet, and the heading in a margin
 * column. The marks are drawing only and stay out of the accessibility tree.
 */
export function InternalContainer({
  kind = 'neutral',
  reference,
  heading,
  headingLevel = 2,
  description,
  measure,
  actions,
  footer,
  fitHeight = false,
  children,
  ...rest
}: InternalContainerProps) {
  const headingId = useId();
  const hasHeading = isPresent(heading);
  const hasMargin = hasHeading || isPresent(reference) || isPresent(description);
  const Root = hasHeading ? 'section' : 'div';

  return (
    <Root
      {...rest}
      aria-labelledby={hasHeading ? headingId : undefined}
      className={clsx(styles.root, styles[`kind-${kind}`], fitHeight && styles['fit-height'])}
    >
      <span className={clsx(styles.ink, styles['top-line'])} aria-hidden="true" />
      <span className={clsx(styles.ink, styles.mark, styles['mark-top-start'])} aria-hidden="true" />
      <span className={clsx(styles.ink, styles.mark, styles['mark-top-end'])} aria-hidden="true" />
      <div className={clsx(styles.layout, !hasMargin && styles['no-margin'])}>
        {hasMargin && (
          <div className={styles.margin}>
            {isPresent(reference) && <span className={clsx(styles.ink, styles.reference)}>{reference}</span>}
            {hasHeading && (
              <Heading level={headingLevel} defaultLevel={2} className={styles.heading}>
                <span id={headingId}>{heading}</span>
              </Heading>
            )}
            {isPresent(description) && <p className={styles.description}>{description}</p>}
          </div>
        )}
        <div className={styles.main}>
          <span className={clsx(styles.ink, styles['side-line'])} aria-hidden="true" />
          <span className={clsx(styles.ink, styles.mark, styles['mark-side-start'])} aria-hidden="true" />
          <span className={clsx(styles.ink, styles.mark, styles['mark-side-end'])} aria-hidden="true" />
          {isPresent(measure) && <DimensionLine label={measure} className={clsx(styles.ink, styles.measure)} />}
          {isPresent(actions) && <div className={styles.actions}>{actions}</div>}
          <div className={styles.content}>{children}</div>
          {isPresent(footer) && (
            <div className={styles.footer}>
              <span className={clsx(styles.ink, styles.mark, styles['mark-footer-start'])} aria-hidden="true" />
              <span className={clsx(styles.ink, styles.mark, styles['mark-footer-end'])} aria-hidden="true" />
              {footer}
            </div>
          )}
        </div>
      </div>
    </Root>
  );
}
