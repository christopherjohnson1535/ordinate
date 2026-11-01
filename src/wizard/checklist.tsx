// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { breakpointMinWidths } from '../internal/breakpoints';
import { fireNonCancelableEvent } from '../internal/events';
import { useContainerWidth } from '../internal/hooks/use-container-width';
import { useControllable } from '../internal/hooks/use-controllable';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalLiveRegion } from '../live-region/internal';
import { InternalSpaceBetween } from '../space-between/internal';
import { ChecklistItem } from './checklist-item';
import { WizardProps } from './interfaces';
import { useFocusHeadingOnStepChange } from './use-focus-heading';
import { clampIndex, getChecklistState } from './utils';

import styles from './styles.css.js';

export type ChecklistWizardProps = Omit<WizardProps, 'variant' | 'allowSkipTo'>;

/**
 * Every step as an item on one sheet, opened in any order, with the count of checked items and open
 * errors and the submit button in the sheet's footer.
 */
export function ChecklistWizard({
  steps,
  activeStepIndex: controlledActiveStepIndex,
  onNavigate,
  onSubmit,
  onCancel,
  isLoadingNextStep = false,
  submitButtonText,
  secondaryActions,
  aside,
  i18nStrings,
  ...rest
}: ChecklistWizardProps) {
  const i18n = useInternalI18n('wizard');
  const [currentIndex, setCurrentIndex] = useControllable(controlledActiveStepIndex, 0);
  const activeStepIndex = clampIndex(currentIndex, steps.length);

  // An item counts as opened from the first time it is shown, whoever opened it.
  const [visited, setVisited] = useState<ReadonlySet<number>>(() => new Set([activeStepIndex]));
  if (!visited.has(activeStepIndex)) {
    setVisited(new Set(visited).add(activeStepIndex));
  }

  const rootRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(rootRef);
  const narrow = width !== null && width < breakpointMinWidths.s;
  const headerRef = useFocusHeadingOnStepChange(activeStepIndex);

  const hasAside = Boolean(aside);
  const sheet = getChecklistState(steps, activeStepIndex, visited);
  const canSubmit = sheet.canSubmit && !isLoadingNextStep;

  const navigate = (requestedStepIndex: number, reason: WizardProps.NavigateReason) => {
    setCurrentIndex(requestedStepIndex);
    fireNonCancelableEvent(onNavigate, { requestedStepIndex, reason });
  };

  const optionalLabel = i18n('optional', i18nStrings?.optional);
  const checkedText = i18n('checkedStatus', i18nStrings?.checkedStatusText?.(sheet.checkedCount, sheet.requiredCount), {
    checkedCount: sheet.checkedCount,
    requiredCount: sheet.requiredCount,
  });
  const errorParams = { errorCount: sheet.errorCount };

  return (
    <div
      {...rest}
      ref={rootRef}
      className={clsx(styles.root, styles['variant-checklist'], hasAside && !narrow && styles['with-aside'])}
    >
      <div className={styles.sheet}>
        <ol className={styles.items} aria-label={i18n('checklistAriaLabel', i18nStrings?.checklistAriaLabel)}>
          {steps.map((step, index) => {
            const state = sheet.items[index];
            const isChange = state.status === 'visited';
            const stepNumber = index + 1;
            return (
              <ChecklistItem
                key={index}
                step={step}
                index={index}
                state={state}
                headerRef={headerRef}
                isLoadingNextStep={isLoadingNextStep}
                hasNext={index < steps.length - 1}
                onOpen={() => navigate(index, 'step')}
                onNext={() => navigate(index + 1, 'next')}
                labels={{
                  stepNumber: i18n('stepNumberLabel', i18nStrings?.stepNumberLabel?.(stepNumber), { stepNumber }),
                  optional: optionalLabel,
                  doneSummary: i18n('doneSummary', i18nStrings?.doneSummary),
                  errorIcon: i18n('errorIconAriaLabel', i18nStrings?.errorIconAriaLabel),
                  action: isChange
                    ? i18n('changeButton', i18nStrings?.changeButton)
                    : i18n('openButton', i18nStrings?.openButton),
                  actionAriaLabel: isChange
                    ? i18n('changeButtonAriaLabel', i18nStrings?.changeButtonAriaLabel?.(step, stepNumber), {
                        title: step.title,
                      })
                    : i18n('openButtonAriaLabel', i18nStrings?.openButtonAriaLabel?.(step, stepNumber), {
                        title: step.title,
                      }),
                  next: i18n('nextButton', i18nStrings?.nextButton),
                  loadingNext: i18n('loadingNextStepText', i18nStrings?.loadingNextStepText),
                }}
              />
            );
          })}
        </ol>
        <div className={styles.footer}>
          <InternalLiveRegion className={styles['status-line']}>
            <span>{checkedText}</span>
            {sheet.errorCount > 0 && (
              <>
                <span className={styles['status-errors']} aria-hidden="true">
                  {' · △'}
                  {i18n('openErrorsMark', i18nStrings?.openErrorsMarkText?.(sheet.errorCount), errorParams)}
                </span>
                <span className={styles['screenreader-only']}>
                  , {i18n('openErrorsText', i18nStrings?.openErrorsText?.(sheet.errorCount), errorParams)}
                </span>
              </>
            )}
          </InternalLiveRegion>
          <div className={styles['footer-actions']}>
            {secondaryActions && <div className={styles['secondary-actions']}>{secondaryActions}</div>}
            <InternalSpaceBetween direction="horizontal" size="xs">
              <InternalButton
                className={styles['cancel-button']}
                variant="link"
                formAction="none"
                onClick={() => fireNonCancelableEvent(onCancel, null)}
              >
                {i18n('cancelButton', i18nStrings?.cancelButton)}
              </InternalButton>
              <InternalButton
                className={styles['primary-button']}
                variant="primary"
                formAction="none"
                disabled={!canSubmit}
                onClick={() => fireNonCancelableEvent(onSubmit, null)}
              >
                {submitButtonText ?? i18n('issueButton', i18nStrings?.submitButton)}
              </InternalButton>
            </InternalSpaceBetween>
          </div>
        </div>
      </div>
      {hasAside && <div className={styles.aside}>{aside}</div>}
    </div>
  );
}
