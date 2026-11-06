// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { ConstructionTopLine, RuleEndMarks } from '../internal/components/construction';
import { DimensionLine } from '../internal/components/dimension-line';
import { Heading } from '../internal/components/heading';
import { useResizeObserver } from '../internal/hooks/use-resize-observer';
import { ContainerProps } from './interfaces';

import styles from './styles.css.js';

export type InternalContainerProps = ContainerProps;

const isPresent = (node: React.ReactNode) => node !== undefined && node !== null && node !== false && node !== '';

/**
 * A section drawn like a detail on a drawing: construction lines that run past their corners, a dimension
 * line along the top of the content, hash marks wherever lines end or meet, and the heading in a margin
 * column. The marks are drawing only and stay out of the accessibility tree.
 */
/**
 * Whether a fitHeight container's content holds more than it shows. Its size changes with the
 * container, and what it holds changes with its children, so both are watched.
 */
function useOverflows(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean): boolean {
  const [overflows, setOverflows] = useState(false);
  const measure = () => {
    const element = ref.current;
    setOverflows(enabled && !!element && element.scrollHeight > element.clientHeight + 1);
  };
  useResizeObserver(ref, measure);
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element || typeof MutationObserver === 'undefined') {
      setOverflows(false);
      return;
    }
    const observer = new MutationObserver(measure);
    observer.observe(element, { childList: true, subtree: true, characterData: true });
    measure();
    return () => observer.disconnect();
    // measure reads only the ref and enabled, which are listed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled]);
  return overflows;
}

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
  const contentRef = useRef<HTMLDivElement>(null);
  // Content that scrolls inside the container takes focus, so it can be scrolled from the keyboard
  // even when nothing in it is focusable. Inside a section it is a group named after the heading.
  const scrollable = useOverflows(contentRef, fitHeight);

  return (
    <Root
      {...rest}
      aria-labelledby={hasHeading ? headingId : undefined}
      className={clsx(styles.root, styles[`kind-${kind}`], fitHeight && styles['fit-height'])}
    >
      <ConstructionTopLine kind={kind} />
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
          <div
            ref={contentRef}
            className={styles.content}
            tabIndex={scrollable ? 0 : undefined}
            role={scrollable && hasHeading ? 'group' : undefined}
            aria-labelledby={scrollable && hasHeading ? headingId : undefined}
          >
            {children}
          </div>
          {isPresent(footer) && (
            <div className={styles.footer}>
              <RuleEndMarks kind={kind} />
              {footer}
            </div>
          )}
        </div>
      </div>
    </Root>
  );
}
