// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { MultiselectProps } from './interfaces';
import { InternalMultiselect } from './internal';

export type { MultiselectProps };

const Multiselect = React.forwardRef(
  (
    {
      options = [],
      selectedOptions,
      onChange,
      placeholder,
      disabled = false,
      readOnly = false,
      filteringType = 'none',
      filteringPlaceholder,
      filteringAriaLabel,
      tokenLimit,
      hideTokens = false,
      keepOpen = true,
      enableSelectAll = false,
      empty,
      noMatch,
      statusType = 'finished',
      loadingText,
      finishedText,
      errorText,
      recoveryText,
      errorIconAriaLabel,
      onLoadItems,
      i18nStrings,
      deselectAriaLabel,
      ariaLabel,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...props
    }: MultiselectProps,
    ref: React.Ref<MultiselectProps.Ref>
  ) => (
    <InternalMultiselect
      {...getBaseProps(props)}
      ref={ref}
      options={options}
      selectedOptions={selectedOptions}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      filteringType={filteringType}
      filteringPlaceholder={filteringPlaceholder}
      filteringAriaLabel={filteringAriaLabel}
      tokenLimit={tokenLimit}
      hideTokens={hideTokens}
      keepOpen={keepOpen}
      enableSelectAll={enableSelectAll}
      empty={empty}
      noMatch={noMatch}
      statusType={statusType}
      loadingText={loadingText}
      finishedText={finishedText}
      errorText={errorText}
      recoveryText={recoveryText}
      errorIconAriaLabel={errorIconAriaLabel}
      onLoadItems={onLoadItems}
      i18nStrings={i18nStrings}
      deselectAriaLabel={deselectAriaLabel}
      ariaLabel={ariaLabel}
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

Multiselect.displayName = 'Multiselect';

export default Multiselect;
