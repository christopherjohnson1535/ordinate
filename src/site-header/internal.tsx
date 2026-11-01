// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { Band } from '../internal/components/band';
import { SiteBrandMark } from '../internal/components/site-brand';
import { SiteLinkList } from '../internal/components/site-link-list';
import { useInternalI18n } from '../internal/i18n/context';
import { SiteHeaderProps } from './interfaces';
import { useMenu } from './use-menu';

import styles from './styles.css.js';

export function InternalSiteHeader({
  brand,
  links = [],
  actions,
  notice,
  sticky = false,
  navigationAriaLabel,
  menuButtonText,
  onFollow,
  ...rest
}: SiteHeaderProps) {
  const i18n = useInternalI18n('site-header');
  const { open, toggle, dismiss, containerRef, buttonRef, onKeyDown, onBlur } = useMenu();
  const listId = useId();

  return (
    <header {...rest} className={clsx(styles.root, sticky && styles.sticky)}>
      {notice && (
        <Band spacing="none" className={styles.notice} innerClassName={styles['notice-inner']}>
          {notice}
        </Band>
      )}
      <Band spacing="none" className={styles.bar} innerClassName={styles['bar-inner']}>
        <SiteBrandMark brand={brand} className={styles.brand} onFollow={onFollow} />
        {links.length > 0 && (
          <nav
            ref={containerRef}
            className={styles.navigation}
            aria-label={i18n('navigationAriaLabel', navigationAriaLabel)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
          >
            <button
              ref={buttonRef}
              type="button"
              className={styles['menu-button']}
              aria-expanded={open}
              aria-controls={listId}
              onClick={toggle}
            >
              <InternalIcon name={open ? 'close' : 'menu'} />
              <span className={styles['menu-button-text']}>{i18n('menuButtonText', menuButtonText)}</span>
            </button>
            <SiteLinkList
              id={listId}
              links={links}
              className={clsx(styles.links, open && styles['links-open'])}
              itemClassName={styles.item}
              linkClassName={styles.link}
              onFollow={onFollow}
              onLinkClick={dismiss}
            />
          </nav>
        )}
        {actions && <div className={styles.actions}>{actions}</div>}
      </Band>
    </header>
  );
}
