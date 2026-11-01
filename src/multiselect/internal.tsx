// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useId, useImperativeHandle, useMemo } from 'react';

import { Dropdown } from '../internal/components/dropdown';
import { OptionList, OptionState } from '../internal/components/option-list';
import { OptionDefinition } from '../internal/components/option-list/interfaces';
import { renderDropdownStatus } from '../internal/components/option-list/status';
import {
  flattenOptions,
  getLabel,
  getOptionItems,
  isSameOption,
  ListItem,
  OptionItem,
} from '../internal/components/option-list/utils';
import { FilterInput, SelectTrigger, TriggerLabel, TriggerPlaceholder } from '../internal/components/select-base';
import { useSelectList } from '../internal/components/select-base/use-select-list';
import { getHiddenTokenCount, TokenList, TokenListItem } from '../internal/components/token-list';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { MultiselectProps } from './interfaces';

import styles from './styles.css.js';

function includesOption(selection: ReadonlyArray<OptionDefinition>, option: OptionDefinition): boolean {
  return selection.some(selected => isSameOption(option, selected));
}

export const InternalMultiselect = React.forwardRef(
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
      ...rest
    }: MultiselectProps,
    ref: React.Ref<MultiselectProps.Ref>
  ) => {
    const i18n = useInternalI18n('multiselect');
    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid, warning });
    const baseId = useId();
    const hiddenLabelId = `${baseId}label`;
    const labelIds = field.ariaLabelledby ?? (ariaLabel ? hiddenLabelId : undefined);

    const selectAllText = i18n('selectAllText', i18nStrings?.selectAllText);
    const selectAllOption = useMemo<OptionDefinition>(() => ({ label: selectAllText }), [selectAllText]);
    const addSelectAllRow = useCallback(
      (rows: ListItem[]): ListItem[] =>
        rows.length === 0
          ? rows
          : [{ type: 'option', option: selectAllOption, group: null, disabled: false, extra: true }, ...rows],
      [selectAllOption]
    );

    const changeSelection = (next: ReadonlyArray<MultiselectProps.Option>) =>
      fireNonCancelableEvent(onChange, { selectedOptions: next });

    const toggleOption = (option: OptionDefinition) =>
      changeSelection(
        includesOption(selectedOptions, option)
          ? selectedOptions.filter(selected => !isSameOption(option, selected))
          : [...selectedOptions, option]
      );

    const list = useSelectList({
      options,
      filteringType,
      disabled,
      readOnly,
      statusType,
      onLoadItems,
      onFocus,
      onBlur,
      addExtraRows: enableSelectAll ? addSelectAllRow : undefined,
      getInitialIndex: () => -1,
      onChoose: (item: OptionItem) => {
        if (item.option === selectAllOption) {
          toggleAll();
        } else {
          toggleOption(item.option);
        }
        return keepOpen;
      },
    });
    useImperativeHandle(ref, () => ({ focus: () => list.triggerRef.current?.focus() }));

    // The options "Select all" applies to: the ones shown, without the disabled ones.
    const selectableShown = list.optionItems.filter(item => !item.extra && !item.disabled);
    const shownSelectedCount = selectableShown.filter(item => includesOption(selectedOptions, item.option)).length;
    const allShownSelected = selectableShown.length > 0 && shownSelectedCount === selectableShown.length;

    function toggleAll() {
      if (allShownSelected) {
        changeSelection(
          selectedOptions.filter(selected => !selectableShown.some(item => isSameOption(item.option, selected)))
        );
      } else {
        const missing = selectableShown.filter(item => !includesOption(selectedOptions, item.option));
        changeSelection([...selectedOptions, ...missing.map(item => item.option)]);
      }
    }

    const getOptionState = (item: OptionItem): OptionState => {
      if (item.option === selectAllOption) {
        return { selected: allShownSelected, indeterminate: shownSelectedCount > 0 && !allShownSelected };
      }
      return { selected: includesOption(selectedOptions, item.option) };
    };

    // Selected options may carry only a value, so tokens take their label and state from the matching option.
    const allOptionItems = useMemo(() => getOptionItems(flattenOptions(options)), [options]);
    const tokens: TokenListItem[] = selectedOptions.map(selected => {
      const match = allOptionItems.find(item => isSameOption(item.option, selected));
      const option = match?.option ?? selected;
      return {
        label: getLabel(option),
        labelTag: option.labelTag,
        description: option.description,
        iconName: option.iconName,
        iconAriaLabel: option.iconAriaLabel,
        lang: option.lang,
        disabled: match?.disabled ?? Boolean(selected.disabled),
        dismissLabel:
          deselectAriaLabel?.(selected) ?? i18n('deselectAriaLabel', undefined, { label: getLabel(option) }),
      };
    });

    const { highlightedIndex } = list.highlight;
    const activeDescendant = highlightedIndex >= 0 ? list.getOptionId(highlightedIndex) : undefined;
    const realOptionCount = list.optionItems.filter(item => !item.extra).length;

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
          isEmpty: realOptionCount === 0,
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
        {selectedOptions.length > 0 ? (
          <TriggerLabel>
            {i18n('selectedCountText', i18nStrings?.selectedCountText, { count: selectedOptions.length })}
          </TriggerLabel>
        ) : (
          <TriggerPlaceholder>{placeholder}</TriggerPlaceholder>
        )}
      </SelectTrigger>
    );

    const hiddenTokenCount = getHiddenTokenCount(tokens.length, tokenLimit);

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
            indicator="checkbox"
            getOptionState={getOptionState}
            onOptionClick={list.choose}
            multiselectable={true}
            focusable={!list.hasFilter}
            ariaLabelledby={labelIds}
          />
        </Dropdown>
        {!hideTokens && (
          <TokenList
            className={styles.tokens}
            items={tokens}
            limit={tokenLimit}
            showMoreText={i18n('tokenLimitShowMore', i18nStrings?.tokenLimitShowMore, { count: hiddenTokenCount })}
            showFewerText={i18n('tokenLimitShowFewer', i18nStrings?.tokenLimitShowFewer)}
            disabled={disabled}
            onDismiss={readOnly ? undefined : index => toggleOption(selectedOptions[index])}
            onEmptied={() => list.triggerRef.current?.focus()}
          />
        )}
      </div>
    );
  }
);
