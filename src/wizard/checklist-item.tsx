// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalIcon } from '../icon/internal';
import { RevisionCloud } from '../internal/components/revision-cloud';
import { WizardProps } from './interfaces';
import { ChecklistItemState } from './utils';

import styles from './styles.css.js';

export interface ChecklistItemLabels {
  stepNumber?: string;
  optional?: string;
  doneSummary?: string;
  errorIcon?: string;
  action?: string;
  actionAriaLabel?: string;
  next?: string;
  loadingNext?: string;
}

interface ChecklistItemProps {
  step: WizardProps.Step;
  index: number;
  state: ChecklistItemState;
  labels: ChecklistItemLabels;
  /**
   * Holds the heading of the open item, so focus can move to it when another item opens.
   */
  headerRef?: React.Ref<HTMLDivElement>;
  isLoadingNextStep: boolean;
  hasNext: boolean;
  onOpen: () => void;
  onNext: () => void;
}

function Marker({ index, state }: { index: number; state: ChecklistItemState }) {
  const checked = state.status === 'visited' && state.revision === null;
  return (
    <span className={styles['item-marker']}>
      {checked ? <InternalIcon name="check" className={styles['item-marker-check']} /> : index + 1}
    </span>
  );
}

/**
 * One item on the checklist sheet. The open item shows its content; the others fold to their
 * title and one line, a summary once checked or the description before, with a button to open them.
 */
export function ChecklistItem({
  step,
  index,
  state,
  labels,
  headerRef,
  isLoadingNextStep,
  hasNext,
  onOpen,
  onNext,
}: ChecklistItemProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const errorId = `${id}-error`;
  const { status, revision } = state;
  const isActive = status === 'active';
  const hasError = revision !== null;
  const revisionMark = hasError ? `△${revision}` : undefined;
  const line = status === 'visited' ? (step.summary ?? labels.doneSummary) : step.description;

  return (
    <li
      className={clsx(
        styles.item,
        styles[`item-${status}`],
        step.isOptional && styles['item-optional'],
        hasError && styles['item-has-error']
      )}
      aria-current={isActive ? 'step' : undefined}
    >
      <div className={styles['item-margin']} aria-hidden="true">
        <Marker index={index} state={state} />
        {step.isOptional && <span className={styles['item-optional-label']}>{labels.optional}</span>}
      </div>
      <div
        className={styles['item-body']}
        role="group"
        aria-labelledby={titleId}
        aria-describedby={hasError ? errorId : undefined}
      >
        <div
          ref={isActive ? headerRef : undefined}
          className={clsx(styles['item-header'], isActive && styles['step-header'])}
        >
          <h2 id={titleId} className={styles['item-title']}>
            <span className={styles['screenreader-only']}>{labels.stepNumber}</span> {step.title}
            {step.isOptional && (
              <>
                {' '}
                <span className={styles['screenreader-only']}>- {labels.optional}</span>
              </>
            )}
          </h2>
          {isActive && step.info && <span className={styles['item-info']}>{step.info}</span>}
          {!isActive && (
            <InternalButton
              className={clsx(styles['item-action'], styles[status === 'visited' ? 'change-button' : 'open-button'])}
              variant="link"
              formAction="none"
              disabled={isLoadingNextStep}
              ariaLabel={labels.actionAriaLabel}
              onClick={onOpen}
            >
              {labels.action}
            </InternalButton>
          )}
        </div>
        {isActive && step.description && <div className={styles['item-description']}>{step.description}</div>}
        {(isActive || line || hasError) && (
          <RevisionCloud active={hasError} marker={revisionMark}>
            {isActive ? (
              <div className={styles.content}>{step.content}</div>
            ) : (
              line && <div className={styles['item-summary']}>{line}</div>
            )}
          </RevisionCloud>
        )}
        {hasError && (
          <div id={errorId} className={styles['item-error']}>
            <span className={styles['item-error-mark']} aria-hidden="true">
              {revisionMark}
            </span>
            <span className={styles['screenreader-only']}>{labels.errorIcon}:</span>{' '}
            <span className={styles['item-error-text']}>{step.errorText}</span>
          </div>
        )}
        {isActive && hasNext && (
          <div className={styles['item-actions']}>
            <InternalButton
              className={styles['next-button']}
              formAction="none"
              loading={isLoadingNextStep}
              loadingText={labels.loadingNext}
              onClick={onNext}
            >
              {labels.next}
            </InternalButton>
          </div>
        )}
      </div>
    </li>
  );
}
