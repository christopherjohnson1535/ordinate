// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import { InternalAutosuggest } from '../autosuggest/internal';
import { InternalButton } from '../button/internal';
import { InternalFormField } from '../form-field/internal';
import { OptionDefinition, OptionsDefinition } from '../internal/components/option-list/interfaces';
import { InternalSelect } from '../select/internal';
import { FilterSettings } from './filter-settings';
import { PropertyFilterProps } from './interfaces';
import { findProperty, getAllowedOperators, getDefaultOperator, getPropertyOptions, isolateOperator } from './utils';

import styles from './styles.css.js';

type Token = PropertyFilterProps.Token;
type FilteringProperty = PropertyFilterProps.FilteringProperty;

export interface TokenEditorProps {
  token: Token;
  settings: FilterSettings;
  onApply(token: Token): void;
  onCancel(): void;
}

function getPropertyOptionList(
  properties: ReadonlyArray<FilteringProperty>,
  allProperties: OptionDefinition,
  allowFreeText: boolean
): OptionsDefinition {
  const ungrouped: OptionDefinition[] = allowFreeText ? [allProperties] : [];
  const groups = new Map<string, OptionDefinition[]>();
  for (const property of properties) {
    const option = { value: property.key, label: property.propertyLabel };
    if (property.group === undefined) {
      ungrouped.push(option);
    } else {
      groups.set(property.group, [...(groups.get(property.group) ?? []), option]);
    }
  }
  return [...ungrouped, ...Array.from(groups, ([label, options]) => ({ label, options }))];
}

/**
 * The form inside a filter's popover that changes its property, operator and value. It edits a copy,
 * so nothing changes until the user applies it.
 */
export function TokenEditor({ token, settings, onApply, onCancel }: TokenEditorProps) {
  const { properties, options, strings, status, onLoadItems, asyncProperties, disableFreeTextFiltering } = settings;
  const [propertyKey, setPropertyKey] = useState(token.propertyKey);
  const [operator, setOperator] = useState(token.operator);
  const [value, setValue] = useState(token.value);

  const property = findProperty(properties, propertyKey);
  const operators = getAllowedOperators(property);

  const allPropertiesOption = useMemo<OptionDefinition>(
    () => ({ label: strings.allPropertiesLabel }),
    [strings.allPropertiesLabel]
  );
  const propertyOptions = useMemo(
    () => getPropertyOptionList(properties, allPropertiesOption, !disableFreeTextFiltering),
    [properties, allPropertiesOption, disableFreeTextFiltering]
  );
  const selectedProperty: OptionDefinition = property
    ? { value: property.key, label: property.propertyLabel }
    : propertyKey === undefined
      ? allPropertiesOption
      : // A property that is not in the list, such as one that has not loaded yet, is still shown.
        { value: propertyKey, label: propertyKey };

  const operatorOption = (entry: PropertyFilterProps.ComparisonOperator): OptionDefinition => ({
    value: entry,
    label: strings.operatorName(entry),
    labelTag: isolateOperator(entry),
  });

  const valueOptions = property
    ? getPropertyOptions(options, property.key).map(option => ({ value: option.value, label: option.label }))
    : [];
  const loadsValues = Boolean(property) || asyncProperties;

  const changeProperty = (option: OptionDefinition) => {
    const nextKey = option === allPropertiesOption ? undefined : option.value;
    if (nextKey === propertyKey) {
      return;
    }
    const nextProperty = findProperty(properties, nextKey);
    setPropertyKey(nextKey);
    if (!getAllowedOperators(nextProperty).includes(operator)) {
      setOperator(nextProperty ? getDefaultOperator(nextProperty) : ':');
    }
    setValue('');
  };

  return (
    <div className={styles.editor}>
      <InternalFormField label={strings.propertyText} stretch={true}>
        <InternalSelect
          options={propertyOptions}
          selectedOption={selectedProperty}
          onChange={event => changeProperty(event.detail.selectedOption)}
        />
      </InternalFormField>
      <InternalFormField label={strings.operatorText} stretch={true}>
        <InternalSelect
          options={operators.map(operatorOption)}
          selectedOption={operatorOption(operator)}
          onChange={event => setOperator(event.detail.selectedOption.value as PropertyFilterProps.ComparisonOperator)}
        />
      </InternalFormField>
      <InternalFormField label={strings.valueText} stretch={true}>
        <InternalAutosuggest
          value={value}
          onChange={event => setValue(event.detail.value)}
          options={valueOptions}
          enteredTextLabel={strings.enteredTextLabel}
          statusType={loadsValues ? status.statusType : 'finished'}
          loadingText={status.loadingText}
          finishedText={loadsValues ? status.finishedText : undefined}
          errorText={status.errorText}
          recoveryText={status.recoveryText}
          errorIconAriaLabel={status.errorIconAriaLabel}
          onLoadItems={event => {
            if (loadsValues) {
              onLoadItems({ ...event.detail, filteringProperty: property, filteringOperator: operator });
            }
          }}
        />
      </InternalFormField>
      <div className={styles['editor-actions']}>
        <InternalButton variant="link" formAction="none" onClick={onCancel}>
          {strings.cancelActionText}
        </InternalButton>
        <InternalButton
          variant="primary"
          formAction="none"
          onClick={() =>
            onApply(
              propertyKey === undefined
                ? { operator, value: value.trim() }
                : { propertyKey, operator, value: value.trim() }
            )
          }
        >
          {strings.applyActionText}
        </InternalButton>
      </div>
    </div>
  );
}
