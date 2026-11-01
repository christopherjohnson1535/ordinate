// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useRef, useState } from 'react';

import {
  AnnotationContextContext,
  AnnotationContextValue,
  AnnotationFocusTarget,
  flattenSteps,
} from '../internal/context/annotation-context';
import { fireNonCancelableEvent } from '../internal/events';
import { AnnotationContextProps } from './interfaces';

function clampStep(index: number, count: number) {
  return Math.min(Math.max(index, 0), Math.max(count - 1, 0));
}

export function InternalAnnotationContext({
  currentTutorial,
  children,
  onStartTutorial,
  onExitTutorial,
  onStepChange,
  onFinish,
  i18nStrings,
}: AnnotationContextProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [annotationOpen, setAnnotationOpen] = useState(true);
  const focusRequest = useRef<AnnotationFocusTarget | null>(null);
  // Stable, so an annotation only claims focus when it mounts.
  const takeFocusRequest = useCallback((target: AnnotationFocusTarget) => {
    if (focusRequest.current !== target) {
      return false;
    }
    focusRequest.current = null;
    return true;
  }, []);

  // A different tutorial starts from its first step with the annotation open, whether the
  // user started it from the panel or the application set it.
  const tutorialKey = currentTutorial ? currentTutorial.title : null;
  const [previousKey, setPreviousKey] = useState(tutorialKey);
  if (tutorialKey !== previousKey) {
    setPreviousKey(tutorialKey);
    setStepIndex(0);
    setAnnotationOpen(true);
  }

  const steps = flattenSteps(currentTutorial);
  const currentStepIndex = clampStep(stepIndex, steps.length);

  const value: AnnotationContextValue = {
    currentTutorial,
    steps,
    currentStepIndex,
    annotationOpen,
    i18nStrings,
    takeFocusRequest,
    startTutorial: tutorial => {
      setStepIndex(0);
      setAnnotationOpen(true);
      focusRequest.current = 'annotation';
      fireNonCancelableEvent(onStartTutorial, { tutorial });
    },
    exitTutorial: tutorial => {
      focusRequest.current = 'panel';
      fireNonCancelableEvent(onExitTutorial, { tutorial });
    },
    goToStep: (index, reason) => {
      const next = clampStep(index, steps.length);
      setAnnotationOpen(true);
      focusRequest.current = 'annotation';
      if (next !== currentStepIndex) {
        setStepIndex(next);
        fireNonCancelableEvent(onStepChange, { step: next, reason });
      }
    },
    setAnnotationOpen: open => {
      focusRequest.current = open ? 'annotation' : null;
      setAnnotationOpen(open);
    },
    finish: () => {
      setAnnotationOpen(false);
      focusRequest.current = 'panel';
      fireNonCancelableEvent(onFinish, null);
    },
  };

  return <AnnotationContextContext.Provider value={value}>{children}</AnnotationContextContext.Provider>;
}
