// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * How long a feedback message stays, in milliseconds. Long enough to read a word or two.
 */
export const feedbackDuration = 2000;

export interface Feedback {
  /**
   * Changes every time feedback opens. Use it as the panel's `key`, so the same message
   * shown twice in a row mounts a new live region and is announced again.
   */
  key: number;
  /**
   * The message, or `null` while the feedback is open but not filled yet. Screen readers only
   * announce changes to a live region that is already in the page, so feedback always opens
   * empty and receives its message in a later render.
   */
  content: React.ReactNode | null;
}

export interface FeedbackControls {
  feedback: Feedback | null;
  /**
   * Opens the feedback empty, before the result is known, and returns a token for `resolve`.
   */
  start(): number;
  /**
   * Fills feedback opened with `start` and hides it after a moment. Does nothing when the
   * feedback was opened again or hidden since, so a late result cannot replace a newer one.
   */
  resolve(token: number, content: React.ReactNode): void;
  /**
   * Opens the feedback empty and fills it with the message straight after, then hides it after a moment.
   */
  show(content: React.ReactNode): void;
  hide(): void;
  /**
   * Handlers for the element around the trigger: moving focus away or pressing Escape hides the feedback.
   */
  dismissHandlers: {
    onBlur: (event: React.FocusEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
}

/**
 * State for a short message shown next to a control after the user acts on it, such as
 * "Copied". The message hides itself after a moment, when focus leaves, or on Escape.
 */
export function useFeedback(): FeedbackControls {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const lastKey = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const hide = useCallback(() => {
    clearTimeout(timer.current);
    lastKey.current++;
    setFeedback(null);
  }, []);

  const start = useCallback(() => {
    clearTimeout(timer.current);
    const key = ++lastKey.current;
    setFeedback({ key, content: null });
    return key;
  }, []);

  const resolve = useCallback(
    (token: number, content: React.ReactNode) => {
      if (token !== lastKey.current) {
        return;
      }
      setFeedback({ key: token, content });
      clearTimeout(timer.current);
      timer.current = setTimeout(hide, feedbackDuration);
    },
    [hide]
  );

  const show = useCallback(
    (content: React.ReactNode) => {
      const token = start();
      // A render later, so the message lands in a live region that is already in the page.
      timer.current = setTimeout(() => resolve(token, content), 0);
    },
    [start, resolve]
  );

  const dismissHandlers = {
    onBlur: (event: React.FocusEvent) => {
      if (feedback && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
        hide();
      }
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (feedback && event.key === 'Escape') {
        // Closes only the feedback, not a surrounding modal or popover.
        event.preventDefault();
        event.stopPropagation();
        hide();
      }
    },
  };

  return { feedback, start, resolve, show, hide, dismissHandlers };
}
