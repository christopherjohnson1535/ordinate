// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { AnnotationContextProps } from './interfaces';
import { InternalAnnotationContext } from './internal';

export type { AnnotationContextProps };

/**
 * Runs a guided tutorial over the page inside it. It renders no element of its own: each step
 * appears as an annotation next to the `Hotspot` it names, and a `TutorialPanel` inside lists
 * the tutorials and tracks progress.
 */
export default function AnnotationContext({
  currentTutorial,
  children,
  onStartTutorial,
  onExitTutorial,
  onStepChange,
  onFinish,
  i18nStrings,
}: AnnotationContextProps) {
  return (
    <InternalAnnotationContext
      currentTutorial={currentTutorial}
      onStartTutorial={onStartTutorial}
      onExitTutorial={onExitTutorial}
      onStepChange={onStepChange}
      onFinish={onFinish}
      i18nStrings={i18nStrings}
    >
      {children}
    </InternalAnnotationContext>
  );
}
