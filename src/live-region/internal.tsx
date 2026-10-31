// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { LiveRegionProps } from './interfaces';

import styles from './styles.css.js';

/**
 * Time to wait after a change before announcing it. Several quick changes, like typing into a filter,
 * become one announcement of the final text.
 */
export const announcementDelay = 500;

export interface InternalLiveRegionProps extends LiveRegionProps {
  /**
   * Lets other components position the content. Not part of the public API.
   */
  className?: string;
}

/**
 * Reads the text a screen reader would read: hidden elements are skipped and images use their label.
 */
export function getAnnouncementText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }
  if (!(node instanceof Element) || node.getAttribute('aria-hidden') === 'true') {
    return '';
  }
  if (node.getAttribute('role') === 'img') {
    return node.getAttribute('aria-label') ?? '';
  }
  return Array.from(node.childNodes, getAnnouncementText).join(' ').replace(/\s+/g, ' ').trim();
}

export function InternalLiveRegion({
  children,
  assertive = false,
  hidden = false,
  tagName: TagName = 'div',
  className,
  ...rest
}: InternalLiveRegionProps) {
  const contentRef = useRef<HTMLDivElement & HTMLSpanElement>(null);
  const announcerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const announcedRef = useRef('');

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    },
    []
  );

  // Runs after every render because the text can change without any prop changing identity.
  useEffect(() => {
    if (timeoutRef.current !== undefined || !contentRef.current) {
      return;
    }
    if (getAnnouncementText(contentRef.current) === announcedRef.current) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = undefined;
      const text = contentRef.current ? getAnnouncementText(contentRef.current) : '';
      // The announcer gets the text as a single node, which screen readers read more reliably than markup.
      if (announcerRef.current && text !== announcedRef.current) {
        announcerRef.current.textContent = text;
        announcedRef.current = text;
      }
    }, announcementDelay);
  });

  // The announcer is in the page before any text arrives, so screen readers notice the change, and it
  // sits outside the content so it is still read when the content is hidden.
  return (
    <TagName {...rest} className={clsx(styles.root, className)}>
      <TagName ref={contentRef} className={styles.content} hidden={hidden}>
        {children}
      </TagName>
      <span
        ref={announcerRef}
        className={styles.announcer}
        aria-live={assertive ? 'assertive' : 'polite'}
        aria-atomic="true"
      />
    </TagName>
  );
}
