// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { InternalAlert } from '../alert/internal';
import { InternalBadge } from '../badge/internal';
import { InternalButton } from '../button/internal';
import { InternalHelpPanel } from '../help-panel/internal';
import { IconProps } from '../icon/interfaces';
import { InternalIcon } from '../icon/internal';
import { TutorialStep, useAnnotationContext } from '../internal/context/annotation-context';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { InternalLink } from '../link/internal';
import { TutorialPanelProps } from './interfaces';

import styles from './styles.css.js';

type Progress = 'success' | 'in-progress' | 'pending';

const progressIcon: Record<Progress, IconProps.Name> = {
  success: 'status-positive',
  'in-progress': 'hotspot',
  pending: 'status-not-started',
};

function progressOf(index: number, current: number, completed: boolean): Progress {
  if (completed || index < current) {
    return 'success';
  }
  return index === current ? 'in-progress' : 'pending';
}

export function InternalTutorialPanel({
  tutorials,
  loading = false,
  onFeedbackClick,
  downloadUrl,
  i18nStrings,
  ...rest
}: TutorialPanelProps) {
  const i18n = useInternalI18n('tutorial-panel');
  const context = useAnnotationContext();
  const rootRef = useRef<HTMLDivElement>(null);
  const currentTutorial = context?.currentTutorial ?? null;
  const view = loading ? 'loading' : !currentTutorial ? 'list' : currentTutorial.completed ? 'completed' : 'tutorial';

  if (!context) {
    warnOnce('TutorialPanel', 'Place the tutorial panel inside an `AnnotationContext`.');
  }

  // Exiting or finishing a tutorial replaces the button that had focus, so focus moves to the
  // heading of the view that replaces it.
  useEffect(() => {
    if (!context || view === 'loading' || !context.takeFocusRequest('panel')) {
      return;
    }
    const root = rootRef.current;
    const heading = root?.querySelector<HTMLElement>(`.${styles['focus-target']}`) ?? root?.querySelector('h2');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  }, [context, view]);

  const statusLabel = (progress: Progress) =>
    progress === 'success'
      ? i18n('taskStatusSuccess', i18nStrings?.labelsTaskStatus?.success)
      : progress === 'in-progress'
        ? i18n('taskStatusInProgress', i18nStrings?.labelsTaskStatus?.inProgress)
        : i18n('taskStatusPending', i18nStrings?.labelsTaskStatus?.pending);

  const feedback = onFeedbackClick && (
    <p>
      <InternalLink className={styles['feedback-link']} onFollow={() => fireNonCancelableEvent(onFeedbackClick, null)}>
        {i18n('feedbackLinkText', i18nStrings?.feedbackLinkText)}
      </InternalLink>
    </p>
  );

  if (view === 'loading') {
    return (
      <div {...rest} ref={rootRef} className={styles.root}>
        <InternalHelpPanel loading={true} loadingText={i18n('loadingText', i18nStrings?.loadingText)} />
      </div>
    );
  }

  if (!currentTutorial || !context) {
    return (
      <div {...rest} ref={rootRef} className={styles.root}>
        <InternalHelpPanel header={i18n('tutorialListTitle', i18nStrings?.tutorialListTitle)} footer={feedback}>
          <div className={styles.body}>
            <p className={styles.description}>
              {i18n('tutorialListDescription', i18nStrings?.tutorialListDescription)}
            </p>
            {downloadUrl && (
              <InternalButton
                className={styles['download-link']}
                variant="link"
                href={downloadUrl}
                download={true}
                iconName="download"
              >
                {i18n('tutorialListDownloadLinkText', i18nStrings?.tutorialListDownloadLinkText)}
              </InternalButton>
            )}
            <ul className={styles['tutorial-list']}>
              {tutorials.map(tutorial => (
                <li key={tutorial.title} className={styles.tutorial}>
                  <div className={styles['tutorial-heading']}>
                    <h3 className={styles['tutorial-title']}>{tutorial.title}</h3>
                    {tutorial.completed && (
                      <InternalBadge className={styles['completed-badge']}>
                        {i18n('tutorialCompletedText', i18nStrings?.tutorialCompletedText)}
                      </InternalBadge>
                    )}
                  </div>
                  {tutorial.description && <div className={styles['tutorial-description']}>{tutorial.description}</div>}
                  {tutorial.prerequisitesNeeded && tutorial.prerequisitesAlert && (
                    <div className={styles.prerequisites}>
                      <InternalAlert type="info">{tutorial.prerequisitesAlert}</InternalAlert>
                    </div>
                  )}
                  <div className={styles['tutorial-actions']}>
                    <InternalButton
                      className={styles['start-button']}
                      formAction="none"
                      disabled={Boolean(tutorial.prerequisitesNeeded) || !context}
                      onClick={() => context?.startTutorial(tutorial)}
                    >
                      {tutorial.completed
                        ? i18n('restartTutorialButtonText', i18nStrings?.restartTutorialButtonText)
                        : i18n('startTutorialButtonText', i18nStrings?.startTutorialButtonText)}
                    </InternalButton>
                    {tutorial.learnMoreUrl && (
                      <InternalLink className={styles['learn-more-link']} href={tutorial.learnMoreUrl} external={true}>
                        {i18n('learnMoreLinkText', i18nStrings?.learnMoreLinkText)}
                      </InternalLink>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </InternalHelpPanel>
      </div>
    );
  }

  const completed = Boolean(currentTutorial.completed);
  const current = context.steps[context.currentStepIndex];
  const stepsOfTask = (taskIndex: number) => context.steps.filter(entry => entry.taskIndex === taskIndex);

  const renderStep = (entry: TutorialStep) => {
    const progress = progressOf(entry.index, current?.index ?? 0, completed);
    return (
      <li
        key={entry.index}
        className={clsx(styles.step, styles[`step-${progress}`])}
        aria-current={progress === 'in-progress' ? 'step' : undefined}
      >
        <span className={styles['step-marker']}>
          <InternalIcon name={progressIcon[progress]} ariaLabel={statusLabel(progress)} />
        </span>
        <span className={styles['step-title']}>{entry.step.title}</span>
      </li>
    );
  };

  return (
    <div {...rest} ref={rootRef} className={styles.root}>
      <InternalHelpPanel header={currentTutorial.title} footer={feedback}>
        <div className={styles.body}>
          {completed && (
            <div className={styles.completion}>
              <h3 className={clsx(styles['completion-title'], styles['focus-target'])}>
                <InternalIcon name="status-positive" />
                <span>{i18n('completionScreenTitle', i18nStrings?.completionScreenTitle)}</span>
              </h3>
              {currentTutorial.completedScreenDescription && (
                <div className={styles['completion-description']}>{currentTutorial.completedScreenDescription}</div>
              )}
            </div>
          )}
          <ol className={styles['task-list']}>
            {currentTutorial.tasks.map((task, taskIndex) => {
              const taskSteps = stepsOfTask(taskIndex);
              const progress: Progress = completed
                ? 'success'
                : taskIndex < (current?.taskIndex ?? 0)
                  ? 'success'
                  : taskIndex === current?.taskIndex
                    ? 'in-progress'
                    : 'pending';
              return (
                <li key={taskIndex} className={clsx(styles.task, styles[`task-${progress}`])}>
                  <h3 className={styles['task-title']}>
                    {i18n('taskTitle', i18nStrings?.taskTitle?.(taskIndex + 1, task.title), {
                      taskNumber: taskIndex + 1,
                      taskTitle: task.title,
                    })}
                  </h3>
                  <span className={styles['task-meta']}>
                    <span className={styles['task-status']}>{statusLabel(progress)}</span>
                    <span aria-hidden="true"> · </span>
                    <span className={styles['total-steps']}>
                      {i18n('totalStepsText', i18nStrings?.totalStepsText?.(taskSteps.length), {
                        count: taskSteps.length,
                      })}
                    </span>
                  </span>
                  <ol className={styles['step-list']}>{taskSteps.map(renderStep)}</ol>
                </li>
              );
            })}
          </ol>
          <div className={styles['exit-row']}>
            <InternalButton
              className={styles['exit-button']}
              formAction="none"
              onClick={() => context.exitTutorial(currentTutorial)}
            >
              {i18n('exitTutorialButtonText', i18nStrings?.exitTutorialButtonText)}
            </InternalButton>
          </div>
        </div>
      </InternalHelpPanel>
    </div>
  );
}
