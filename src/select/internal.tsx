// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle } from 'react';

import { Dropdown } from '../internal/components/dropdown';
import { OptionList } from '../internal/components/option-list';
import { renderDropdownStatus } from '../internal/components/option-list/status';
import { getLabel, isSameOption, OptionItem } from '../internal/components/option-list/utils';
import { FilterInput, SelectTrigger, TriggerLabel, TriggerPlaceholder } from '../internal/components/select-base';
import { useSelectList } from '../internal/components/select-base/use-select-list';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { SelectProps } from './interfaces';

import styles from './styles.css.js';

export const InternalSelect = React.forwardRef(
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
      warning,
      ...rest
    }: SelectProps,
    ref: React.Ref<SelectProps.Ref>
  ) => {
    const i18n = useInternalI18n('select');
    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid, warning });
    const baseId = useId();
    const hiddenLabelId = `${baseId}label`;
    const labelIds = field.ariaLabelledby ?? (ariaLabel ? hiddenLabelId : undefined);

    const list = useSelectList({
      options,
      filteringType,
      disabled,
      readOnly,
      statusType,
      onLoadItems,
      onFocus,
      onBlur,
      getInitialIndex: optionItems => optionItems.findIndex(item => isSameOption(item.option, selectedOption)),
      onChoose: (item: OptionItem) => {
        if (!isSameOption(item.option, selectedOption)) {
          fireNonCancelableEvent(onChange, { selectedOption: item.option });
        }
        return false;
      },
    });
    useImperativeHandle(ref, () => ({ focus: () => list.triggerRef.current?.focus() }));

    const { highlightedIndex } = list.highlight;
    const activeDescendant = highlightedIndex >= 0 ? list.getOptionId(highlightedIndex) : undefined;

    const status = list.open
      ? renderDropdownStatus({
          statusType,
          loadingText,
          finishedText,
          errorText,
          recoveryText,
          errorIconAriaLabel: i18n('errorIconAriaLabel', errorIconAriaLabel),
          empty,
          noMatch,
          isEmpty: list.optionItems.length === 0,
          isNoMatch: Boolean(list.filteringText) && filteringType === 'auto' && options.length > 0,
          onRecoveryClick: list.retry,
        })
      : undefined;

    const trigger = (
      <SelectTrigger
        {...list.triggerProps}
        triggerRef={list.triggerRef}
        id={field.controlId}
        open={list.open}
        listId={list.listId}
        disabled={disabled}
        readOnly={readOnly}
        invalid={field.invalid}
        warning={field.warning}
        ariaLabelledby={labelIds}
        ariaDescribedby={field.ariaDescribedby}
        contentId={`${baseId}value`}
      >
        {selectedOption ? (
          <TriggerLabel
            lang={selectedOption.lang}
            iconName={selectedOption.iconName}
            iconAriaLabel={selectedOption.iconAriaLabel}
          >
            {getLabel(selectedOption)}
          </TriggerLabel>
        ) : (
          <TriggerPlaceholder>{placeholder}</TriggerPlaceholder>
        )}
      </SelectTrigger>
    );

    return (
      <div {...rest} className={styles.root} {...list.rootProps}>
        {ariaLabel && !field.ariaLabelledby && (
          <span id={hiddenLabelId} hidden={true}>
            {ariaLabel}
          </span>
        )}
        <Dropdown
          open={list.open}
          trigger={trigger}
          header={
            list.hasFilter ? (
              <FilterInput
                filterRef={list.filterRef}
                value={list.filteringText}
                listId={list.listId}
                activeDescendant={activeDescendant}
                placeholder={filteringPlaceholder}
                ariaLabel={filteringAriaLabel}
                onChange={list.onFilterChange}
              />
            ) : undefined
          }
          footer={status}
          onOutsideClick={list.onOutsideClick}
          onContentScroll={list.onContentScroll}
          className={styles.dropdown}
        >
          <OptionList
            id={list.listId}
            listRef={list.listRef}
            items={list.items}
            getOptionId={list.getOptionId}
            highlight={list.highlight}
            indicator="check"
            getOptionState={item => ({ selected: isSameOption(item.option, selectedOption) })}
            onOptionClick={list.choose}
            focusable={!list.hasFilter}
            ariaLabelledby={labelIds}
          />
        </Dropdown>
      </div>
    );
  }
);
