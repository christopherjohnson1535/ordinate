// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { OptionDefinition } from '../internal/components/option-list/interfaces';
import { PopoverProps } from '../popover/interfaces';
import { InternalPopover } from '../popover/internal';
import { InternalSelect } from '../select/internal';
import { FilterSettings } from './filter-settings';
import { PropertyFilterProps } from './interfaces';
import { TokenEditor } from './token-editor';
import { formatToken } from './utils';

import styles from './styles.css.js';

type Operation = PropertyFilterProps.Operation;

export interface FilterTokenRef {
  /**
   * Focuses the token's remove button, or its edit button when it cannot be removed.
   */
  focus(): void;
}

export interface FilterTokenProps {
  token: PropertyFilterProps.Token;
  settings: FilterSettings;
  /**
   * The operation written before the token, or undefined for the first token.
   */
  operation?: Operation;
  /**
   * Whether the operation is a control that switches it, or only text.
   */
  operationChangeable: boolean;
  onOperationChange(operation: Operation): void;
  onChange(token: PropertyFilterProps.Token): void;
  onRemove(): void;
}

/**
 * One condition of the query line: the join word that ties it to the previous condition, then a token holding
 * the filter, as a button that opens its editor, and a remove button.
 */
export const FilterToken = React.forwardRef(
  (
    { token, settings, operation, operationChangeable, onOperationChange, onChange, onRemove }: FilterTokenProps,
    ref: React.Ref<FilterTokenRef>
  ) => {
    const { properties, options, strings, disabled, expandToViewport } = settings;
    const popoverRef = useRef<PopoverProps.Ref>(null);
    const removeRef = useRef<ButtonProps.Ref>(null);
    useImperativeHandle(ref, () => ({ focus: () => removeRef.current?.focus() }));

    const formatted = formatToken(token, properties, options, strings.operatorName);
    const operationOptions: ReadonlyArray<OptionDefinition> = [
      { value: 'and', label: strings.operationText('and') },
      { value: 'or', label: strings.operationText('or') },
    ];

    const closeEditor = () => {
      popoverRef.current?.dismiss();
      popoverRef.current?.focus();
    };

    // Free text that contains its value reads as the value alone; any other operator is shown.
    const showOperator = formatted.propertyLabel !== undefined || token.operator !== ':';

    return (
      <li className={clsx(styles.token, disabled && styles['token-disabled'])}>
        {operation &&
          (operationChangeable ? (
            <span className={styles.operation}>
              <InternalSelect
                options={operationOptions}
                selectedOption={operationOptions.find(option => option.value === operation) ?? null}
                onChange={event => onOperationChange(event.detail.selectedOption.value as Operation)}
                ariaLabel={strings.tokenOperatorAriaLabel}
                disabled={disabled}
              />
            </span>
          ) : (
            <span className={styles['operation-text']}>{strings.operationText(operation)}</span>
          ))}
        <span className={styles['token-chip']}>
          <InternalPopover
            ref={popoverRef}
            triggerType="custom"
            position="bottom"
            size="large"
            fixedWidth={true}
            header={strings.editTokenHeader}
            dismissAriaLabel={strings.dismissAriaLabel}
            renderWithPortal={expandToViewport}
            content={
              <TokenEditor
                token={token}
                settings={settings}
                onApply={next => {
                  onChange(next);
                  closeEditor();
                }}
                onCancel={closeEditor}
              />
            }
          >
            <button
              type="button"
              className={styles['token-button']}
              aria-label={strings.tokenAriaLabel(formatted)}
              aria-haspopup="dialog"
              disabled={disabled}
            >
              {formatted.propertyLabel !== undefined && (
                <span className={styles['token-property']}>{formatted.propertyLabel}</span>
              )}
              {showOperator && (
                // Operators are only punctuation, which right-to-left text would otherwise turn around.
                <span className={styles['token-operator']} dir="ltr">
                  {token.operator}
                </span>
              )}
              <span className={styles['token-value']}>{formatted.value}</span>
            </button>
          </InternalPopover>
          <InternalButton
            ref={removeRef}
            className={styles['token-remove']}
            variant="icon"
            iconName="close"
            formAction="none"
            disabled={disabled}
            ariaLabel={strings.removeTokenButtonAriaLabel(formatted)}
            onClick={onRemove}
          />
        </span>
      </li>
    );
  }
);
