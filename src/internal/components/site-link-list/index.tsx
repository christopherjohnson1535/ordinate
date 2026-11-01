// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { followLink, SiteLinkFollowHandler } from '../../site-links';

import styles from './styles.css.js';

export interface SiteLink {
  text: string;
  href: string;
  current?: boolean;
}

interface SiteLinkListProps {
  links: ReadonlyArray<SiteLink>;
  id?: string;
  className?: string;
  itemClassName?: string;
  linkClassName?: string;
  onFollow?: SiteLinkFollowHandler;
  /**
   * Called after `onFollow` for every click, such as to close the menu the list sits in.
   */
  onLinkClick?: () => void;
}

/**
 * A plain list of links, as used in site headers, footers and mastheads. The link to the page being
 * shown carries `aria-current="page"`.
 */
export function SiteLinkList({
  links,
  id,
  className,
  itemClassName,
  linkClassName,
  onFollow,
  onLinkClick,
}: SiteLinkListProps) {
  return (
    <ul id={id} className={clsx(styles.list, className)}>
      {links.map((link, index) => (
        <li key={`${index}-${link.href}`} className={itemClassName}>
          <a
            className={linkClassName}
            href={link.href}
            aria-current={link.current ? 'page' : undefined}
            onClick={event => {
              followLink(onFollow, { href: link.href, text: link.text }, event);
              onLinkClick?.();
            }}
          >
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
