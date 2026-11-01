// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef, useState } from 'react';

import { FloatingPanel } from '../internal/components/floating-panel';
import { getFirstTabbable } from '../internal/focus';
import { TooltipProps } from './interfaces';

import styles from './styles.css.js';

// A short wait before showing on hover, so the pointer can pass over a row of buttons quietly.
const showDelay = 300;
// A short wait before hiding, so the pointer can cross the gap onto the tooltip without losing it.
const hideDelay = 100;

function addToken(list: string | null, token: string) {
  const tokens = (list ?? '').split(/\s+/).filter(Boolean);
  return tokens.includes(token) ? tokens.join(' ') : [...tokens, token].join(' ');
}

function removeToken(list: string | null, token: string) {
  return (list ?? '')
    .split(/\s+/)
    .filter(item => item && item !== token)
    .join(' ');
}

export interface InternalTooltipProps extends TooltipProps {
  /**
   * Links the tooltip to the trigger as its accessible description, making the trigger focusable
   * if needed. Turn it off when the tooltip repeats the accessible name of a trigger that manages
   * its own focus, such as a toolbar button, so the text is not read twice. Not part of the public API.
   */
  describesTrigger?: boolean;
  /**
   * Keeps the tooltip hidden, for example while other feedback shows in its place. Not part of the public API.
   */
  suppressed?: boolean;
}

export function InternalTooltip({
  content,
  children,
  position = 'top',
  describesTrigger = true,
  suppressed = false,
  ...rest
}: InternalTooltipProps) {
  const [shown, setVisible] = useState(false);
  const visible = shown && !suppressed;
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const tooltipId = `${useId()}tooltip`;

  const showAfter = (delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(true), delay);
  };

  const hideAfter = (delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), delay);
  };

  const hideNow = () => {
    clearTimeout(timer.current);
    setVisible(false);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  // The trigger is the consumer's element, so the description is linked on the DOM node
  // rather than through a prop the element may not accept.
  useEffect(() => {
    const wrapper = triggerRef.current;
    if (!wrapper || !describesTrigger) {
      return;
    }
    const target = getFirstTabbable(wrapper) ?? wrapper;
    const ownsTabStop = target === wrapper;
    if (ownsTabStop) {
      wrapper.tabIndex = 0;
    }
    target.setAttribute('aria-describedby', addToken(target.getAttribute('aria-describedby'), tooltipId));
    return () => {
      const remaining = removeToken(target.getAttribute('aria-describedby'), tooltipId);
      if (remaining) {
        target.setAttribute('aria-describedby', remaining);
      } else {
        target.removeAttribute('aria-describedby');
      }
      if (ownsTabStop) {
        wrapper.removeAttribute('tabindex');
      }
    };
  }, [tooltipId, children, describesTrigger]);

  // Escape hides a tooltip shown by hover too, while focus is somewhere else.
  useEffect(() => {
    if (!visible) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideNow();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  return (
    <span
      {...rest}
      className={styles.root}
      onMouseEnter={() => showAfter(showDelay)}
      onMouseLeave={() => hideAfter(hideDelay)}
      onFocus={() => {
        clearTimeout(timer.current);
        setVisible(true);
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          hideNow();
        }
      }}
      onKeyDown={event => {
        if (visible && event.key === 'Escape') {
          // Closes only the tooltip, not a surrounding modal or popover.
          event.preventDefault();
          event.stopPropagation();
          hideNow();
        }
      }}
    >
      <span ref={triggerRef} className={styles.trigger}>
        {children}
      </span>
      <FloatingPanel
        id={tooltipId}
        role="tooltip"
        trigger={triggerRef}
        preferredSide={position}
        variant="inverse"
        hidden={!visible}
        aria-hidden={describesTrigger ? undefined : true}
        className={styles.tooltip}
      >
        {content}
      </FloatingPanel>
    </span>
  );
}
