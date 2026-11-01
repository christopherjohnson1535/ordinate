// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { AutosuggestProps } from './interfaces';
import { InternalAutosuggest } from './internal';

export type { AutosuggestProps };

const Autosuggest = React.forwardRef(
  (
    {
      value,
      onChange,
      options = [],
      onSelect,
      filteringType = 'auto',
      enteredTextLabel,
      hideEnteredTextOption = false,
      empty,
      statusType = 'finished',
      loadingText,
      finishedText,
      errorText,
      recoveryText,
      errorIconAriaLabel,
      onLoadItems,
      placeholder,
      disabled = false,
      readOnly = false,
      name,
      ariaLabel,
      ariaRequired,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...props
    }: AutosuggestProps,
    ref: React.Ref<AutosuggestProps.Ref>
  ) => (
    <InternalAutosuggest
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      options={options}
      onSelect={onSelect}
      filteringType={filteringType}
      enteredTextLabel={enteredTextLabel}
      hideEnteredTextOption={hideEnteredTextOption}
      empty={empty}
      statusType={statusType}
      loadingText={loadingText}
      finishedText={finishedText}
      errorText={errorText}
      recoveryText={recoveryText}
      errorIconAriaLabel={errorIconAriaLabel}
      onLoadItems={onLoadItems}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      name={name}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      onFocus={onFocus}
      onBlur={onBlur}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
      warning={warning}
    />
  )
);

Autosuggest.displayName = 'Autosuggest';

export default Autosuggest;
