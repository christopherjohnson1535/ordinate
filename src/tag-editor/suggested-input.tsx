// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { AutosuggestProps } from '../autosuggest/interfaces';
import { InternalAutosuggest } from '../autosuggest/internal';
import { NonCancelableEventHandler } from '../internal/events';

type Request = (text: string) => Promise<ReadonlyArray<string>>;

/**
 * Suggestions from a promise-returning request. Only the latest request updates the list, so a slow
 * answer for older text cannot replace the answer for what is typed now.
 */
function useSuggestions(request: Request | undefined) {
  const [options, setOptions] = useState<AutosuggestProps.Option[]>([]);
  const [statusType, setStatusType] = useState<AutosuggestProps.StatusType>('finished');
  const latestRef = useRef(0);
  useEffect(
    () => () => {
      latestRef.current = -1;
    },
    []
  );

  const load = (text: string) => {
    if (!request) {
      return;
    }
    const id = ++latestRef.current;
    setStatusType('loading');
    request(text).then(
      values => {
        if (id === latestRef.current) {
          setOptions(values.map(value => ({ value })));
          setStatusType('finished');
        }
      },
      () => {
        if (id === latestRef.current) {
          setStatusType('error');
        }
      }
    );
  };

  return { options, statusType, load };
}

export interface SuggestedInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: NonCancelableEventHandler;
  request?: Request;
  placeholder?: string;
  readOnly?: boolean;
  enteredTextLabel: (value: string) => string;
  loadingText?: string;
  errorText?: string;
  recoveryText?: string;
}

export function SuggestedInput({
  value,
  onChange,
  onBlur,
  request,
  placeholder,
  readOnly,
  enteredTextLabel,
  loadingText,
  errorText,
  recoveryText,
}: SuggestedInputProps) {
  const { options, statusType, load } = useSuggestions(request);
  return (
    <InternalAutosuggest
      value={value}
      onChange={event => onChange(event.detail.value)}
      onBlur={onBlur}
      options={options}
      statusType={statusType}
      loadingText={loadingText}
      errorText={errorText}
      recoveryText={recoveryText}
      onLoadItems={event => load(event.detail.filteringText)}
      enteredTextLabel={enteredTextLabel}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  );
}
