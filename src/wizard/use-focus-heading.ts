// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';

/**
 * Moves focus to the step's heading whenever the step changes, so keyboard and screen reader users
 * start reading the new step from its top. Attach the returned ref to the element that holds the
 * active step's heading.
 */
export function useFocusHeadingOnStepChange(activeStepIndex: number) {
  const headerRef = useRef<HTMLDivElement>(null);
  const shownIndex = useRef(activeStepIndex);
  useEffect(() => {
    if (shownIndex.current === activeStepIndex) {
      return;
    }
    shownIndex.current = activeStepIndex;
    const heading = headerRef.current?.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  }, [activeStepIndex]);
  return headerRef;
}
