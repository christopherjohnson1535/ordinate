// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SelectProps } from './interfaces';
import { InternalSelect } from './internal';

export type { SelectProps };

const Select = React.forwardRef(
  (
    {
      options = [],
      selectedOption,
      onChange,
      placeholder,
      disabled = false,
      readOnly = false,
      filteringType = 'none',
      filteringPlaceholder,
      filteringAriaLabel,
      empty,
      noMatch,
      statusType = 'finished',
      loadingText,
      finishedText,
      errorText,
      recoveryText,
      errorIconAriaLabel,
      onLoadItems,
      ariaLabel,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      ...props
    }: SelectProps,
    ref: React.Ref<SelectProps.Ref>
  ) => (
    <InternalSelect
      {...getBaseProps(props)}
      ref={ref}
      options={options}
      selectedOption={selectedOption}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      filteringType={filteringType}
      filteringPlaceholder={filteringPlaceholder}
      filteringAriaLabel={filteringAriaLabel}
      empty={empty}
      noMatch={noMatch}
      statusType={statusType}
      loadingText={loadingText}
      finishedText={finishedText}
      errorText={errorText}
      recoveryText={recoveryText}
      errorIconAriaLabel={errorIconAriaLabel}
      onLoadItems={onLoadItems}
      ariaLabel={ariaLabel}
      onFocus={onFocus}
      onBlur={onBlur}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
    />
  )
);

Select.displayName = 'Select';

export default Select;
