// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Open state and dismissal for a disclosure menu: Escape closes it and returns focus to its button,
 * and so does `dismiss`, called when a link is followed. Clicking or tabbing away closes it without
 * moving focus.
 */
export function useMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => setOpen(current => !current), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // A link hidden by the closing menu would otherwise drop focus to the top of the page.
  const dismiss = () => {
    if (open) {
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (open && event.key === 'Escape') {
      event.stopPropagation();
      dismiss();
    }
  };

  const onBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (open && next && !containerRef.current?.contains(next)) {
      setOpen(false);
    }
  };

  return { open, toggle, dismiss, containerRef, buttonRef, onKeyDown, onBlur };
}
