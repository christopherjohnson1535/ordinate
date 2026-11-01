// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { followLink, SiteLinkFollowHandler } from '../../site-links';

import styles from './styles.css.js';

export interface SiteBrand {
  /**
   * The name of the site or business, always shown as text.
   */
  name: string;
  /**
   * Where the name links to, usually the home page. Leave it out to show the name without a link.
   */
  href?: string;
  /**
   * A logo shown before the name, such as an `<svg>` or an `<img>`. The name is read out instead,
   * so the logo is hidden from screen readers.
   */
  logo?: React.ReactNode;
}

interface SiteBrandProps {
  brand: SiteBrand;
  className?: string;
  onFollow?: SiteLinkFollowHandler;
}

/**
 * The logo and name of a site, as shown in its header and footer.
 */
export function SiteBrandMark({ brand, className, onFollow }: SiteBrandProps) {
  const content = (
    <>
      {brand.logo && (
        <span className={styles.logo} aria-hidden="true">
          {brand.logo}
        </span>
      )}
      <span className={styles.name}>{brand.name}</span>
    </>
  );

  if (brand.href === undefined) {
    return <span className={clsx(styles.brand, className)}>{content}</span>;
  }
  return (
    <a
      className={clsx(styles.brand, styles.link, className)}
      href={brand.href}
      onClick={event => followLink(onFollow, { href: brand.href!, text: brand.name }, event)}
    >
      {content}
    </a>
  );
}
