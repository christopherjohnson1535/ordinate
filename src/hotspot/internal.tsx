// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useRef } from 'react';
import clsx from 'clsx';

import { Annotation } from '../annotation-context/annotation';
import { InternalIcon } from '../icon/internal';
import { AnnotationContextValue, TutorialStep, useAnnotationContext } from '../internal/context/annotation-context';
import { useInternalI18n } from '../internal/i18n/context';
import { HotspotProps } from './interfaces';

import styles from './styles.css.js';

// A hotspot shows a marker while any step of the current task points at it. When several
// steps of the task do, the current one wins, then the earliest.
function findOwnStep(context: AnnotationContextValue | null, hotspotId: string): TutorialStep | undefined {
  if (!context?.currentTutorial || context.currentTutorial.completed) {
    return undefined;
  }
  const current = context.steps[context.currentStepIndex];
  if (!current) {
    return undefined;
  }
  if (current.step.hotspotId === hotspotId) {
    return current;
  }
  return context.steps.find(entry => entry.taskIndex === current.taskIndex && entry.step.hotspotId === hotspotId);
}

export function InternalHotspot({ hotspotId, children, side = 'right', direction = 'top', ...rest }: HotspotProps) {
  const i18n = useInternalI18n('annotation-context');
  const context = useAnnotationContext();
  const markerRef = useRef<HTMLButtonElement>(null);
  const annotationId = useId();
  const ownStep = findOwnStep(context, hotspotId);
  const isCurrent = ownStep !== undefined && ownStep.index === context?.currentStepIndex;
  const open = isCurrent && Boolean(context?.annotationOpen);

  const onMarkerClick = () => {
    if (!context || !ownStep) {
      return;
    }
    if (isCurrent) {
      context.setAnnotationOpen(!open);
    } else {
      context.goToStep(ownStep.index, 'open');
    }
  };

  const dismiss = () => {
    context?.setAnnotationOpen(false);
    markerRef.current?.focus();
  };

  const marker = ownStep && context && (
    <span className={styles['marker-slot']}>
      <button
        ref={markerRef}
        type="button"
        className={clsx(styles.marker, isCurrent && styles['marker-current'])}
        aria-label={i18n(
          'labelHotspot',
          context.i18nStrings?.labelHotspot?.(open, ownStep.indexInTask + 1, ownStep.taskStepCount),
          {
            open: open ? 'true' : 'false',
            stepNumber: ownStep.indexInTask + 1,
            totalStepCount: ownStep.taskStepCount,
          }
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? annotationId : undefined}
        onClick={onMarkerClick}
      >
        {isCurrent && (
          <span className={styles.pulse}>
            <InternalIcon name="status-not-started" />
          </span>
        )}
        <InternalIcon name={isCurrent ? 'hotspot' : 'status-not-started'} />
      </button>
      {open && (
        <Annotation
          key={ownStep.index}
          id={annotationId}
          context={context}
          tutorialStep={ownStep}
          trigger={markerRef}
          direction={direction}
          onDismiss={dismiss}
        />
      )}
    </span>
  );

  return (
    <span
      {...rest}
      className={clsx(styles.root, children !== undefined && styles['with-children'])}
      data-hotspot-id={hotspotId}
    >
      {side === 'left' && marker}
      {children !== undefined && <span className={styles.content}>{children}</span>}
      {side === 'right' && marker}
    </span>
  );
}
