// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { Band } from '../internal/components/band';
import { Heading } from '../internal/components/heading';
import { SiteLinkList } from '../internal/components/site-link-list';
import { useInternalI18n } from '../internal/i18n/context';
import { OpeningProps } from './interfaces';

import styles from './styles.css.js';

function OpeningMedia({ media, caption }: { media: React.ReactNode; caption: React.ReactNode }) {
  if (!caption) {
    return (
      <div className={styles.media}>
        <div className={styles['media-frame']}>{media}</div>
      </div>
    );
  }
  return (
    <figure className={styles.media}>
      <div className={styles['media-frame']}>{media}</div>
      <figcaption className={styles['media-caption']}>{caption}</figcaption>
    </figure>
  );
}

export function InternalOpening({
  variant = 'statement',
  title,
  kicker,
  meta,
  description,
  actions,
  links,
  navigationAriaLabel,
  onFollow,
  badge,
  media,
  mediaCaption,
  mediaPosition = 'end',
  headingLevel,
  ...rest
}: OpeningProps) {
  const i18n = useInternalI18n('opening');
  const isMasthead = variant === 'masthead';
  const hasLinks = links !== undefined && links.length > 0;

  const linksRow = hasLinks && (
    <nav className={styles.navigation} aria-label={i18n('navigationAriaLabel', navigationAriaLabel)}>
      <SiteLinkList links={links} className={styles.links} linkClassName={styles.link} onFollow={onFollow} />
    </nav>
  );

  const mediaBlock = media ? <OpeningMedia media={media} caption={mediaCaption} /> : null;

  return (
    <Band
      {...rest}
      spacing={isMasthead ? 'small' : 'default'}
      className={clsx(styles.root, styles[`variant-${variant}`])}
      innerClassName={styles.frame}
    >
      <div
        className={clsx(
          styles.layout,
          mediaBlock && !isMasthead && styles['has-media'],
          styles[`media-position-${mediaPosition}`]
        )}
      >
        <div className={styles.text}>
          {meta && <div className={styles.meta}>{meta}</div>}
          {badge && (
            <div className={styles['badge-row']}>
              <span className={styles.badge}>{badge}</span>
            </div>
          )}
          {kicker && <p className={styles.kicker}>{kicker}</p>}
          <Heading level={headingLevel} defaultLevel={1} className={styles.title}>
            {title}
          </Heading>
          {description && <div className={styles.description}>{description}</div>}
          {actions && <div className={styles.actions}>{actions}</div>}
          {linksRow}
          {isMasthead && <div className={styles['double-rule']} aria-hidden="true" />}
        </div>
        {mediaBlock}
      </div>
    </Band>
  );
}
