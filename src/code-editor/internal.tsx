// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalIcon } from '../icon/internal';
import { LoadingStatus } from '../internal/components/loading-status';
import { ResizeHandle } from '../internal/components/resize-handle';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { useControllable } from '../internal/hooks/use-controllable';
import { useDebounceCallback } from '../internal/hooks/use-debounce-callback';
import { useInternalI18n } from '../internal/i18n/context';
import { CursorPosition, DiagnosticCounts, EditorConfig, EditorListeners } from './engine/interfaces';
import { CodeEditorProps } from './interfaces';
import { PreferencesModal } from './preferences-modal';
import { StatusBar } from './status-bar';
import { useEditorEngine } from './use-editor-engine';
import { useEditorInstance } from './use-editor-instance';

import styles from './styles.css.js';

const defaultEditorContentHeight = 480;
const minEditorContentHeight = 64;
const maxEditorContentHeight = 2000;
const delayedChangeTimeout = 500;

const defaultPreferences: Required<CodeEditorProps.Preferences> = { wrapLines: true, theme: 'auto', showGutter: true };

function toAttributes(entries: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(Object.entries(entries).filter((entry): entry is [string, string] => !!entry[1]));
}

export const InternalCodeEditor = React.forwardRef(
  (
    {
      value,
      onChange,
      onDelayedChange,
      language,
      languageLabel,
      preferences: preferencesProp,
      onPreferencesChange,
      editorContentHeight,
      onEditorContentResize,
      loading = false,
      readOnly = false,
      ariaLabel,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      i18nStrings,
      ...rest
    }: CodeEditorProps,
    ref: React.Ref<CodeEditorProps.Ref>
  ) => {
    const i18n = useInternalI18n('code-editor');
    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid, warning });
    const editorId = useId();

    const [storedPreferences, setPreferences] = useControllable(preferencesProp, defaultPreferences);
    const preferences = { ...defaultPreferences, ...storedPreferences };
    const [height, setHeight] = useControllable(editorContentHeight, defaultEditorContentHeight);
    const [tabMovesFocus, setTabMovesFocus] = useState(false);
    const [cursor, setCursor] = useState<CursorPosition>({ row: 1, column: 1 });
    const [diagnostics, setDiagnostics] = useState<DiagnosticCounts>({ errors: 0, warnings: 0 });
    const [preferencesVisible, setPreferencesVisible] = useState(false);
    const preferencesTrigger = useRef<HTMLButtonElement>(null);
    const returnFocus = useRef(false);

    const engine = useEditorEngine();
    const fireDelayedChange = useDebounceCallback(
      (next: string) => fireNonCancelableEvent(onDelayedChange, { value: next }),
      delayedChangeTimeout
    );

    const syntaxErrorMessage = i18n('syntaxErrorMessage', i18nStrings?.syntaxErrorMessage) ?? '';
    const contentAttributes = useMemo(
      () =>
        toAttributes({
          id: field.controlId,
          'aria-label': ariaLabel,
          'aria-labelledby': field.ariaLabelledby,
          'aria-describedby': field.ariaDescribedby,
          'aria-invalid': field.invalid ? 'true' : undefined,
          'aria-readonly': readOnly ? 'true' : undefined,
        }),
      [field.controlId, ariaLabel, field.ariaLabelledby, field.ariaDescribedby, field.invalid, readOnly]
    );
    const config = useMemo<EditorConfig>(
      () => ({
        wrapLines: preferences.wrapLines,
        showGutter: preferences.showGutter,
        readOnly,
        tabMovesFocus,
        contentAttributes,
        syntaxErrorMessage,
      }),
      [preferences.wrapLines, preferences.showGutter, readOnly, tabMovesFocus, contentAttributes, syntaxErrorMessage]
    );

    const listeners: EditorListeners = {
      onChange: next => {
        fireNonCancelableEvent(onChange, { value: next });
        fireDelayedChange(next);
      },
      onCursorChange: setCursor,
      onDiagnosticsChange: setDiagnostics,
      onTabMovesFocusToggle: () => setTabMovesFocus(current => !current),
    };

    const { setContainer, instance } = useEditorInstance({
      engine: engine.status === 'ready' ? engine.engine : null,
      value,
      language,
      config,
      listeners,
    });

    useImperativeHandle(ref, () => ({ focus: () => instance?.focus() }), [instance]);

    // Runs after the modal has closed its dialog, when the rest of the page can take focus again.
    useEffect(() => {
      if (!preferencesVisible && returnFocus.current) {
        returnFocus.current = false;
        preferencesTrigger.current?.focus();
      }
    }, [preferencesVisible]);

    const closePreferences = () => {
      returnFocus.current = true;
      setPreferencesVisible(false);
    };

    const confirmPreferences = (next: Required<CodeEditorProps.Preferences>) => {
      closePreferences();
      setPreferences(next);
      fireNonCancelableEvent(onPreferencesChange, next);
    };

    const resize = (next: number) => {
      setHeight(next);
      fireNonCancelableEvent(onEditorContentResize, { height: next });
    };

    const ready = engine.status === 'ready' && !loading;
    const preferencesLabel = i18n('preferencesButtonAriaLabel', i18nStrings?.preferencesButtonAriaLabel);

    return (
      <div
        {...rest}
        role="group"
        aria-label={i18n('editorGroupAriaLabel', i18nStrings?.editorGroupAriaLabel)}
        className={clsx(
          styles.root,
          field.invalid && styles.invalid,
          field.warning && !field.invalid && styles.warning,
          readOnly && styles['read-only']
        )}
      >
        <div className={styles.frame}>
          {/* Code reads left to right in every language, so only the chrome follows the page direction. */}
          <div
            id={editorId}
            dir="ltr"
            className={clsx(styles.editor, preferences.theme !== 'auto' && styles[`theme-${preferences.theme}`])}
            style={{ blockSize: height }}
          >
            {engine.status === 'ready' && (
              <div ref={setContainer} className={styles.surface} hidden={loading || undefined} />
            )}
            {(engine.status === 'loading' || (engine.status === 'ready' && loading)) && (
              <div className={styles.pane}>
                <LoadingStatus
                  className={styles['loading-state']}
                  text={i18n('loadingState', i18nStrings?.loadingState)}
                />
              </div>
            )}
            {engine.status === 'error' && !loading && (
              <div className={styles.pane}>
                <div role="alert" className={styles['error-state']}>
                  <InternalIcon
                    name="status-negative"
                    variant="error"
                    ariaLabel={i18n('errorIconAriaLabel', i18nStrings?.errorIconAriaLabel)}
                  />
                  <span>{i18n('errorState', i18nStrings?.errorState)}</span>
                  <InternalButton
                    className={styles['error-state-recovery']}
                    variant="link"
                    formAction="none"
                    onClick={engine.retry}
                  >
                    {i18n('errorStateRecovery', i18nStrings?.errorStateRecovery)}
                  </InternalButton>
                </div>
              </div>
            )}
            <ResizeHandle
              className={styles['resize-handle']}
              edge="block-end"
              size={height}
              minSize={minEditorContentHeight}
              maxSize={maxEditorContentHeight}
              onResize={resize}
              ariaLabel={i18n('resizeHandleAriaLabel', i18nStrings?.resizeHandleAriaLabel)}
              ariaControls={editorId}
            />
          </div>
          <StatusBar
            ariaLabel={i18n('statusBarGroupAriaLabel', i18nStrings?.statusBarGroupAriaLabel)}
            languageLabel={i18n('languageLabel', languageLabel, { language })}
            cursorPosition={
              ready
                ? i18n('cursorPosition', i18nStrings?.cursorPosition?.(cursor.row, cursor.column), {
                    row: cursor.row,
                    column: cursor.column,
                  })
                : undefined
            }
            errors={{
              count: diagnostics.errors,
              text: i18n('errorsCount', i18nStrings?.errorsCount?.(diagnostics.errors), { count: diagnostics.errors }),
            }}
            warnings={{
              count: diagnostics.warnings,
              text: i18n('warningsCount', i18nStrings?.warningsCount?.(diagnostics.warnings), {
                count: diagnostics.warnings,
              }),
            }}
            onDiagnosticClick={severity => instance?.goToNextDiagnostic(severity)}
            tabMovesFocus={tabMovesFocus}
            tabFocusToggleLabel={i18n('tabFocusToggleLabel', i18nStrings?.tabFocusToggleLabel)}
            onTabFocusToggle={() => setTabMovesFocus(current => !current)}
            actions={
              <button
                ref={preferencesTrigger}
                type="button"
                className={clsx(styles['status-button'], styles['preferences-button'])}
                aria-label={preferencesLabel}
                aria-haspopup="dialog"
                onClick={() => setPreferencesVisible(true)}
              >
                <InternalIcon name="settings" size="small" />
              </button>
            }
          />
        </div>
        {preferencesVisible && (
          <PreferencesModal
            preferences={preferences}
            labels={{
              header: i18n('preferencesModalHeader', i18nStrings?.preferencesModalHeader),
              cancel: i18n('preferencesModalCancel', i18nStrings?.preferencesModalCancel),
              confirm: i18n('preferencesModalConfirm', i18nStrings?.preferencesModalConfirm),
              wrapLines: i18n('preferencesModalWrapLines', i18nStrings?.preferencesModalWrapLines),
              showGutter: i18n('preferencesModalShowGutter', i18nStrings?.preferencesModalShowGutter),
              theme: i18n('preferencesModalTheme', i18nStrings?.preferencesModalTheme),
              themeAuto: i18n('preferencesModalThemeAuto', i18nStrings?.preferencesModalThemeAuto),
              themeLight: i18n('preferencesModalThemeLight', i18nStrings?.preferencesModalThemeLight),
              themeDark: i18n('preferencesModalThemeDark', i18nStrings?.preferencesModalThemeDark),
            }}
            onConfirm={confirmPreferences}
            onCancel={closePreferences}
          />
        )}
      </div>
    );
  }
);
