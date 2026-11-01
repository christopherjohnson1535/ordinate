// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getHeadingTag } from '../internal/heading-level';
import { HowItWorksProps } from './interfaces';

import styles from './styles.css.js';

export function InternalHowItWorks({
  steps,
  headingLevel,
  orientation = 'horizontal',
  ariaLabel,
  ...rest
}: HowItWorksProps) {
  const HeadingTag = getHeadingTag('HowItWorks', headingLevel, 3);
  return (
    // Safari drops list semantics from a list drawn without markers unless the role is stated.
    <ol
      {...rest}
      role="list"
      className={clsx(styles.root, styles[`orientation-${orientation}`])}
      aria-label={ariaLabel}
    >
      {steps.map((step, index) => (
        <li key={index} className={styles.step}>
          {/* The list already gives each step its position, so the drawn number is not read twice. */}
          <span className={styles.number} aria-hidden="true">
            {index + 1}
          </span>
          <div className={styles.body}>
            <HeadingTag className={styles.title}>{step.title}</HeadingTag>
            {step.description && <div className={styles.description}>{step.description}</div>}
            {step.media && <div className={styles.media}>{step.media}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
