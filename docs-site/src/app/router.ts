// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

// The site routes on the URL hash, so it needs no server rewrites and works from file://. A route
// is `#/components/button`; a section of it is `#/components/button#api`.

export interface Location {
  /** The route, such as `/components/button`. */
  path: string;
  /** The section on the page, such as `api`, or an empty string. */
  anchor: string;
}

export function parseHash(hash: string): Location {
  const [path = '', anchor = ''] = hash.replace(/^#/, '').split('#');
  return { path: path.startsWith('/') ? path : `/${path}`, anchor };
}

export const href = (path: string, anchor?: string) => `#${path}${anchor ? `#${anchor}` : ''}`;

export function useLocation(): Location {
  const [location, setLocation] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setLocation(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return location;
}

export function navigate(target: string) {
  window.location.hash = target.replace(/^#/, '');
}

/**
 * Scrolls to a section of the current page and records it in the URL without adding a history
 * entry for every section the reader jumps to.
 */
export function goToAnchor(anchor: string) {
  const { path } = parseHash(window.location.hash);
  window.history.replaceState(null, '', href(path, anchor));
  scrollToAnchor(anchor);
}

export function scrollToAnchor(anchor: string) {
  const target = anchor ? document.getElementById(anchor) : null;
  if (target) {
    target.scrollIntoView({ block: 'start' });
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  } else {
    window.scrollTo({ top: 0 });
  }
}
