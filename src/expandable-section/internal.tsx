// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { ExpandIcon } from '../internal/components/expand-icon';
import { fireNonCancelableEvent } from '../internal/events';
import { warnOnce } from '../internal/logging';
import { ExpandableSectionProps } from './interfaces';

import styles from './styles.css.js';

const containerVariants: ReadonlyArray<ExpandableSectionProps.Variant> = ['container', 'stacked'];
const variantsWithoutDescription: ReadonlyArray<ExpandableSectionProps.Variant> = ['navigation', 'inline'];

export interface InternalExpandableSectionProps extends ExpandableSectionProps {
  /**
   * Lets other components position the section. Not part of the public API.
   */
  className?: string;
}

export const InternalExpandableSection = React.forwardRef(
  (
    {
      variant = 'default',
      headerText,
      header,
      headerDescription,
      headerCounter,
      headerInfo,
      headerActions,
      headerAriaLabel,
      expanded: controlledExpanded,
      defaultExpanded = false,
      onChange,
      disableContentPaddings = false,
      headingTagOverride,
      className,
      children,
      ...rest
    }: InternalExpandableSectionProps,
    ref: React.Ref<ExpandableSectionProps.Ref>
  ) => {
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
    const isControlled = controlledExpanded !== undefined;
    const expanded = isControlled ? controlledExpanded : uncontrolledExpanded;

    const triggerRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => triggerRef.current?.focus() }));

    const id = useId();
    const triggerId = `${id}-trigger`;
    const contentId = `${id}-content`;
    const descriptionId = `${id}-description`;

    const isContainer = containerVariants.includes(variant);
    const showDescription = Boolean(headerDescription) && !variantsWithoutDescription.includes(variant);
    const hasCounter = isContainer && headerCounter !== undefined && headerCounter !== null;
    const HeadingTag = headingTagOverride ?? (isContainer ? 'h2' : undefined);

    if (!isContainer && (headerInfo || headerActions || headerCounter)) {
      warnOnce(
        'ExpandableSection',
        '`headerCounter`, `headerInfo` and `headerActions` are only shown in the container and stacked variants.'
      );
    }

    const toggle = () => {
      if (!isControlled) {
        setUncontrolledExpanded(!expanded);
      }
      fireNonCancelableEvent(onChange, { expanded: !expanded });
    };

    const trigger = (
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        className={styles.trigger}
        aria-expanded={expanded}
        aria-controls={contentId}
        aria-label={headerAriaLabel}
        aria-describedby={showDescription ? descriptionId : undefined}
        onClick={toggle}
      >
        <ExpandIcon expanded={expanded} className={styles.icon} />
        <span className={styles['header-text']}>
          {headerText ?? header}
          {hasCounter && (
            <>
              {' '}
              <span className={styles.counter}>{headerCounter}</span>
            </>
          )}
        </span>
      </button>
    );

    return (
      <div
        {...rest}
        className={clsx(styles.root, styles[`variant-${variant}`], expanded && styles.expanded, className)}
      >
        <div className={styles.header}>
          <div className={styles['header-row']}>
            {HeadingTag ? <HeadingTag className={styles.heading}>{trigger}</HeadingTag> : trigger}
            {isContainer && headerInfo && <span className={styles.info}>{headerInfo}</span>}
            {isContainer && headerActions && <div className={styles.actions}>{headerActions}</div>}
          </div>
          {showDescription && (
            <p id={descriptionId} className={styles.description}>
              {headerDescription}
            </p>
          )}
        </div>
        <div
          id={contentId}
          role="group"
          aria-labelledby={triggerId}
          className={clsx(styles.content, disableContentPaddings && styles['no-paddings'])}
          hidden={!expanded}
        >
          {children}
        </div>
      </div>
    );
  }
);
