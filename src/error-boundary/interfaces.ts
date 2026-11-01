// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface ErrorBoundaryProps extends BaseComponentProps {
  /**
   * The content to protect. When it throws while rendering, the fallback is shown in its place and the rest
   * of the page keeps working. The ID and data attributes go on the fallback.
   */
  children?: React.ReactNode;
  /**
   * An identifier passed to `onError` and `renderFallback`, so you can tell which part of the page failed.
   */
  errorBoundaryId?: string;
  /**
   * Called once when the content throws, with the error and React's component stack. Use it to report the
   * error.
   */
  onError?: NonCancelableEventHandler<ErrorBoundaryProps.ErrorDetail>;
  /**
   * Renders your own fallback in place of the built-in message.
   */
  renderFallback?: (props: ErrorBoundaryProps.FallbackProps) => React.ReactNode;
  /**
   * Adds a link to a feedback page to the built-in message.
   */
  feedbackHref?: string;
  /**
   * Built-in text of the fallback, for when the `I18nProvider` messages do not fit.
   */
  i18nStrings?: ErrorBoundaryProps.I18nStrings;
}

export namespace ErrorBoundaryProps {
  export interface ErrorDetail {
    error: Error;
    errorInfo: React.ErrorInfo;
    errorBoundaryId?: string;
  }

  export interface FallbackProps {
    error: Error;
    errorBoundaryId?: string;
  }

  export interface I18nStrings {
    /**
     * The header of the fallback message.
     */
    headerText?: string;
    /**
     * The text below the header.
     */
    descriptionText?: string;
    /**
     * The text of the button that reloads the page.
     */
    refreshActionText?: string;
    /**
     * The text of the feedback link, shown when `feedbackHref` is set.
     */
    feedbackLinkText?: string;
  }
}
