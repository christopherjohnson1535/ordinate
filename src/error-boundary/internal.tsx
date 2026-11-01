// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalAlert } from '../alert/internal';
import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalLink } from '../link/internal';
import { ErrorBoundaryProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalErrorBoundaryProps extends ErrorBoundaryProps {
  /**
   * Lets other components position the fallback. Not part of the public API.
   */
  className?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Anything can be thrown, but consumers should only ever have to handle an Error.
function toError(thrown: unknown): Error {
  return thrown instanceof Error ? thrown : new Error(String(thrown));
}

function DefaultFallback({ feedbackHref, i18nStrings }: Pick<ErrorBoundaryProps, 'feedbackHref' | 'i18nStrings'>) {
  const i18n = useInternalI18n('error-boundary');

  return (
    <InternalAlert
      type="error"
      header={<span className={styles.header}>{i18n('headerText', i18nStrings?.headerText)}</span>}
      action={
        <InternalButton
          className={styles['refresh-button']}
          formAction="none"
          iconName="refresh"
          onClick={() => window.location.reload()}
        >
          {i18n('refreshActionText', i18nStrings?.refreshActionText)}
        </InternalButton>
      }
    >
      <span className={styles.description}>{i18n('descriptionText', i18nStrings?.descriptionText)}</span>
      {feedbackHref && (
        <>
          {' '}
          <InternalLink className={styles['feedback-link']} variant="primary" href={feedbackHref}>
            {i18n('feedbackLinkText', i18nStrings?.feedbackLinkText)}
          </InternalLink>
        </>
      )}
    </InternalAlert>
  );
}

// Error boundaries can only be class components; the fallback is a function component so it can use hooks.
export class InternalErrorBoundary extends React.Component<InternalErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(thrown: unknown): ErrorBoundaryState {
    return { error: toError(thrown) };
  }

  componentDidCatch(thrown: unknown, errorInfo: React.ErrorInfo) {
    fireNonCancelableEvent(this.props.onError, {
      error: toError(thrown),
      errorInfo,
      errorBoundaryId: this.props.errorBoundaryId,
    });
  }

  render() {
    const { children, errorBoundaryId, renderFallback, feedbackHref, i18nStrings, className } = this.props;
    const { error } = this.state;

    if (!error) {
      return children;
    }

    // The fallback replaces content the user may have been reading, so it is announced as it appears.
    return (
      <div {...getBaseProps(this.props)} className={clsx(styles.root, className)} role="alert">
        {renderFallback ? (
          renderFallback({ error, errorBoundaryId })
        ) : (
          <DefaultFallback feedbackHref={feedbackHref} i18nStrings={i18nStrings} />
        )}
      </div>
    );
  }
}
