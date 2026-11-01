// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

import { getAnchorTarget } from './utils';

/**
 * Tracks which section the reader is in: the last target whose top has scrolled past the line
 * `offset` pixels below the top of the viewport, or the first target before any has. An
 * IntersectionObserver whose root starts at that line reports each crossing, so the position is
 * only read when a target crosses it, not on every scroll event.
 */
export function useScrollSpy(
  hrefs: ReadonlyArray<string>,
  offset: number,
  enabled: boolean
): [string | undefined, (href: string) => void] {
  const [activeHref, setActiveHref] = useState<string | undefined>(undefined);
  const hrefKey = hrefs.join('\n');

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const targets = hrefKey
      .split('\n')
      .map(href => ({ href, element: getAnchorTarget(href) }))
      .filter((target): target is { href: string; element: HTMLElement } => target.element !== null);
    if (targets.length === 0) {
      return;
    }
    const update = () => {
      // Short sections at the end of the page can never scroll up to the line, so once the page
      // is scrolled to the bottom the last section in view counts as reached.
      const root = document.documentElement;
      const atBottom = root.scrollTop > 0 && root.scrollTop + window.innerHeight >= root.scrollHeight - 1;
      // One pixel of slack, so a section scrolled exactly to the line by a link counts as reached.
      const line = atBottom ? window.innerHeight : offset + 1;
      let current = targets[0].href;
      for (const { href, element } of targets) {
        if (element.getBoundingClientRect().top <= line) {
          current = href;
        }
      }
      setActiveHref(current);
    };
    const observer = new IntersectionObserver(update, {
      rootMargin: `${-offset}px 0px 0px 0px`,
      threshold: [0, 1],
    });
    targets.forEach(({ element }) => observer.observe(element));
    update();
    return () => observer.disconnect();
  }, [hrefKey, offset, enabled]);

  return [activeHref, setActiveHref];
}
