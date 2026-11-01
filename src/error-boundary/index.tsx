// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ErrorBoundaryProps } from './interfaces';
import { InternalErrorBoundary } from './internal';

export type { ErrorBoundaryProps };

export default function ErrorBoundary({
  children,
  errorBoundaryId,
  onError,
  renderFallback,
  feedbackHref,
  i18nStrings,
  ...props
}: ErrorBoundaryProps) {
  return (
    <InternalErrorBoundary
      {...getBaseProps(props)}
      errorBoundaryId={errorBoundaryId}
      onError={onError}
      renderFallback={renderFallback}
      feedbackHref={feedbackHref}
      i18nStrings={i18nStrings}
    >
      {children}
    </InternalErrorBoundary>
  );
}
