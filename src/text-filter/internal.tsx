// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';

import { InputProps } from '../input/interfaces';
import { InternalInput } from '../input/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { useDebounceCallback } from '../internal/hooks/use-debounce-callback';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalLiveRegion } from '../live-region/internal';
import { TextFilterProps } from './interfaces';

import styles from './styles.css.js';

/**
 * How long typing must pause before `onDelayedChange` fires.
 */
export const delayedChangeMs = 200;

export const InternalTextFilter = React.forwardRef(
  (
    {
      filteringText,
      onChange,
      onDelayedChange,
      filteringPlaceholder,
      filteringAriaLabel,
      filteringClearAriaLabel,
      countText,
      disabled = false,
      ...rest
    }: TextFilterProps,
    ref: React.Ref<TextFilterProps.Ref>
  ) => {
    const i18n = useInternalI18n('text-filter');
    const inputRef = useRef<InputProps.Ref>(null);
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

    const fireDelayedChange = useDebounceCallback(
      (text: string) => fireNonCancelableEvent(onDelayedChange, { filteringText: text }),
      delayedChangeMs
    );

    const handleChange = (text: string) => {
      fireNonCancelableEvent(onChange, { filteringText: text });
      fireDelayedChange(text);
    };

    const showCount = Boolean(countText) && filteringText !== '' && !disabled;

    return (
      <div {...rest} className={styles.root}>
        <div className={styles.input}>
          <InternalInput
            ref={inputRef}
            type="search"
            value={filteringText}
            onChange={event => handleChange(event.detail.value)}
            placeholder={filteringPlaceholder}
            ariaLabel={i18n('filteringAriaLabel', filteringAriaLabel)}
            clearAriaLabel={i18n('filteringClearAriaLabel', filteringClearAriaLabel)}
            disabled={disabled}
            autoComplete={false}
            disableBrowserAutocorrect={true}
          />
        </div>
        <InternalLiveRegion tagName="span" hidden={!showCount}>
          <span className={styles.count}>{showCount ? countText : ''}</span>
        </InternalLiveRegion>
      </div>
    );
  }
);
