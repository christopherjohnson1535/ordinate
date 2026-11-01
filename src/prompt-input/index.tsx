// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { PromptInputProps } from './interfaces';
import { InternalPromptInput } from './internal';

export type { PromptInputProps };

const PromptInput = React.forwardRef(
  (
    {
      value,
      onChange,
      onAction,
      minRows = 1,
      maxRows = 3,
      actionButtonIconName = 'send',
      actionButtonAriaLabel,
      disableActionButton = false,
      placeholder,
      disabled = false,
      readOnly = false,
      secondaryActions,
      secondaryContent,
      disableSecondaryActionsPaddings = false,
      autoFocus = false,
      spellcheck,
      disableBrowserAutocorrect = false,
      autoComplete = true,
      name,
      ariaLabel,
      ariaRequired,
      onKeyDown,
      onKeyUp,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...props
    }: PromptInputProps,
    ref: React.Ref<PromptInputProps.Ref>
  ) => (
    <InternalPromptInput
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      onAction={onAction}
      minRows={minRows}
      maxRows={maxRows}
      actionButtonIconName={actionButtonIconName}
      actionButtonAriaLabel={actionButtonAriaLabel}
      disableActionButton={disableActionButton}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      secondaryActions={secondaryActions}
      secondaryContent={secondaryContent}
      disableSecondaryActionsPaddings={disableSecondaryActionsPaddings}
      autoFocus={autoFocus}
      spellcheck={spellcheck}
      disableBrowserAutocorrect={disableBrowserAutocorrect}
      autoComplete={autoComplete}
      name={name}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
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

PromptInput.displayName = 'PromptInput';

export default PromptInput;
