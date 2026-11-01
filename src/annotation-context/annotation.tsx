// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef } from 'react';

import { InternalAlert } from '../alert/internal';
import { InternalButton } from '../button/internal';
import { FloatingPanel, FloatingSide } from '../internal/components/floating-panel';
import { AnnotationContextValue, TutorialStep } from '../internal/context/annotation-context';
import { wrapTabFocus } from '../internal/focus';
import { useInternalI18n } from '../internal/i18n/context';

import styles from './styles.css.js';

export interface AnnotationProps {
  id: string;
  context: AnnotationContextValue;
  tutorialStep: TutorialStep;
  /**
   * The hotspot's marker, which the annotation points at.
   */
  trigger: React.RefObject<HTMLElement | null>;
  direction: FloatingSide;
  /**
   * Closes the annotation and moves focus back to the marker.
   */
  onDismiss: () => void;
}

/**
 * The popover of one tutorial step, anchored to its hotspot. Mount it with a `key` per step,
 * so focus moves into the new step when the user goes back or forward.
 */
export function Annotation({ id, context, tutorialStep, trigger, direction, onDismiss }: AnnotationProps) {
  const i18n = useInternalI18n('annotation-context');
  const panelRef = useRef<HTMLSpanElement>(null);
  const titleId = useId();
  const { currentTutorial, steps, i18nStrings, takeFocusRequest } = context;
  const { step, index, taskIndex, indexInTask, taskStepCount } = tutorialStep;
  const task = currentTutorial?.tasks[taskIndex];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  useEffect(() => {
    if (takeFocusRequest('annotation')) {
      trigger.current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      panelRef.current?.focus({ preventScroll: true });
    }
  }, [takeFocusRequest, trigger]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onDismiss();
      return;
    }
    wrapTabFocus(event, event.currentTarget);
  };

  const taskTitle = i18n('taskTitle', task && i18nStrings?.taskTitle?.(taskIndex + 1, task.title), {
    taskNumber: taskIndex + 1,
    taskTitle: task?.title ?? '',
  });
  const stepCounter = i18n('stepCounterText', i18nStrings?.stepCounterText?.(indexInTask + 1, taskStepCount), {
    stepNumber: indexInTask + 1,
    totalStepCount: taskStepCount,
  });

  return (
    <FloatingPanel
      ref={panelRef}
      id={id}
      trigger={trigger}
      preferredSide={direction}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={styles.annotation}
      onKeyDown={handleKeyDown}
    >
      <span className={styles['header-row']}>
        <span className={styles['task-title']}>{taskTitle}</span>
        <span className={styles.dismiss}>
          <InternalButton
            variant="icon"
            formAction="none"
            iconName="close"
            ariaLabel={i18n('labelDismissAnnotation', i18nStrings?.labelDismissAnnotation)}
            onClick={onDismiss}
          />
        </span>
      </span>
      <span id={titleId} className={styles['step-title']}>
        {step.title}
      </span>
      <span className={styles.content}>{step.content}</span>
      {step.warningAlert && (
        <span className={styles.warning}>
          <InternalAlert type="warning">{step.warningAlert}</InternalAlert>
        </span>
      )}
      <span className={styles.footer}>
        <span className={styles['step-counter']}>{stepCounter}</span>
        <span className={styles.actions}>
          {!isFirst && (
            <InternalButton
              className={styles['previous-button']}
              variant="link"
              formAction="none"
              onClick={() => context.goToStep(index - 1, 'previous')}
            >
              {i18n('previousButtonText', i18nStrings?.previousButtonText)}
            </InternalButton>
          )}
          {isLast ? (
            <InternalButton
              className={styles['finish-button']}
              variant="primary"
              formAction="none"
              onClick={() => context.finish()}
            >
              {i18n('finishButtonText', i18nStrings?.finishButtonText)}
            </InternalButton>
          ) : (
            <InternalButton
              className={styles['next-button']}
              variant="primary"
              formAction="none"
              onClick={() => context.goToStep(index + 1, 'next')}
            >
              {i18n('nextButtonText', i18nStrings?.nextButtonText)}
            </InternalButton>
          )}
        </span>
      </span>
    </FloatingPanel>
  );
}
