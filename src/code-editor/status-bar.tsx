// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { DiagnosticSeverity } from './engine/interfaces';

import styles from './styles.css.js';

interface DiagnosticSummary {
  count: number;
  text?: string;
}

interface StatusBarProps {
  ariaLabel?: string;
  languageLabel?: string;
  /**
   * The cursor position, once the editor has loaded.
   */
  cursorPosition?: string;
  errors: DiagnosticSummary;
  warnings: DiagnosticSummary;
  onDiagnosticClick: (severity: DiagnosticSeverity) => void;
  tabMovesFocus: boolean;
  tabFocusToggleLabel?: string;
  onTabFocusToggle: () => void;
  /**
   * The preferences trigger, at the end of the bar.
   */
  actions: React.ReactNode;
}

function DiagnosticButton({
  severity,
  summary,
  onClick,
}: {
  severity: DiagnosticSeverity;
  summary: DiagnosticSummary;
  onClick: (severity: DiagnosticSeverity) => void;
}) {
  const active = summary.count > 0;
  return (
    <button
      type="button"
      className={clsx(styles['status-button'], styles[`${severity}s-count`], active && styles[`has-${severity}s`])}
      disabled={!active}
      onClick={() => onClick(severity)}
    >
      <InternalIcon name={severity === 'error' ? 'status-negative' : 'status-warning'} size="small" />
      <span>{summary.text}</span>
    </button>
  );
}

/**
 * The strip under the editing area: language, cursor position, diagnostics, Tab behavior and
 * preferences.
 */
export function StatusBar({
  ariaLabel,
  languageLabel,
  cursorPosition,
  errors,
  warnings,
  onDiagnosticClick,
  tabMovesFocus,
  tabFocusToggleLabel,
  onTabFocusToggle,
  actions,
}: StatusBarProps) {
  return (
    <div role="group" aria-label={ariaLabel} className={styles['status-bar']}>
      <div className={styles['status-items']}>
        <span className={styles.language}>{languageLabel}</span>
        {cursorPosition && <span className={styles['cursor-position']}>{cursorPosition}</span>}
        <DiagnosticButton severity="error" summary={errors} onClick={onDiagnosticClick} />
        <DiagnosticButton severity="warning" summary={warnings} onClick={onDiagnosticClick} />
      </div>
      <div className={styles['status-actions']}>
        <button
          type="button"
          className={clsx(styles['status-button'], styles['tab-focus-toggle'])}
          aria-pressed={tabMovesFocus}
          onClick={onTabFocusToggle}
        >
          <InternalIcon name="keyboard" size="small" />
          <span>{tabFocusToggleLabel}</span>
        </button>
        {actions}
      </div>
    </div>
  );
}
