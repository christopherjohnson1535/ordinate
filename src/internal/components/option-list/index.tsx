// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../../../icon/internal';
import { OptionDefinition } from './interfaces';
import { HighlightState } from './use-highlight';
import { getLabel, ListItem, OptionItem } from './utils';

import styles from './styles.css.js';

/**
 * How an option shows that it is selected: a check after the label for single selection,
 * a checkbox before the label for multiple selection, or nothing for suggestions.
 */
export type OptionIndicator = 'check' | 'checkbox' | 'none';

export interface OptionState {
  selected: boolean;
  /**
   * Draws a partly checked checkbox, as for a "Select all" row when only some options are selected.
   */
  indeterminate?: boolean;
}

export interface OptionListProps {
  id: string;
  listRef?: React.Ref<HTMLUListElement>;
  items: ReadonlyArray<ListItem>;
  getOptionId(index: number): string;
  highlight: HighlightState;
  indicator: OptionIndicator;
  getOptionState(item: OptionItem, index: number): OptionState;
  onOptionClick(index: number): void;
  multiselectable?: boolean;
  /**
   * Lets the list itself hold focus and point at the highlighted option. Leave it off when focus stays in
   * an input that points at the option instead.
   */
  focusable?: boolean;
  ariaLabelledby?: string;
  ariaLabel?: string;
}

export function OptionContent({ option, disabled }: { option: OptionDefinition; disabled: boolean }) {
  return (
    <span className={styles['option-content']}>
      <span className={styles['option-main']}>
        {option.iconName && (
          <InternalIcon
            className={styles['option-icon']}
            name={option.iconName}
            ariaLabel={option.iconAriaLabel}
            variant={disabled ? 'disabled' : 'normal'}
          />
        )}
        <span className={styles['option-label']} lang={option.lang}>
          {getLabel(option)}
        </span>
        {option.labelTag && <span className={styles['option-label-tag']}>{option.labelTag}</span>}
      </span>
      {option.description && <span className={styles['option-description']}>{option.description}</span>}
      {option.tags && option.tags.length > 0 && (
        <span className={styles['option-tags']}>
          {option.tags.map((tag, index) => (
            <span key={index} className={styles['option-tag']}>
              {tag}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}

function Checkbox({ state, disabled }: { state: OptionState; disabled: boolean }) {
  const mark = state.indeterminate ? 'indeterminate' : state.selected ? 'checked' : 'unchecked';
  return (
    <span className={styles['checkbox-line']}>
      <span className={clsx(styles.checkbox, styles[`checkbox-${mark}`], disabled && styles['checkbox-disabled'])}>
        {mark === 'checked' && <InternalIcon name="check" size="small" />}
      </span>
    </span>
  );
}

/**
 * The listbox of a select, multiselect or autosuggest: options, group labels and the selection indicator.
 * The host owns the highlight and the selection, so the same list serves each component's keyboard model.
 */
export function OptionList({
  id,
  listRef,
  items,
  getOptionId,
  highlight,
  indicator,
  getOptionState,
  onOptionClick,
  multiselectable = false,
  focusable = false,
  ariaLabelledby,
  ariaLabel,
}: OptionListProps) {
  const baseId = useId();
  const { highlightedIndex } = highlight;

  const renderOption = (item: OptionItem, index: number) => {
    const state = getOptionState(item, index);
    const highlighted = index === highlightedIndex;
    return (
      <li
        key={`option-${index}`}
        id={getOptionId(index)}
        role="option"
        className={clsx(
          styles.option,
          item.group && styles['option-in-group'],
          item.extra && styles['option-extra'],
          state.selected && indicator === 'check' && styles['option-selected'],
          highlighted && styles['option-highlighted'],
          highlighted && highlight.source === 'keyboard' && styles['option-keyboard'],
          item.disabled && styles['option-disabled']
        )}
        aria-selected={state.selected}
        aria-disabled={item.disabled ? 'true' : undefined}
        data-value={item.option.value}
        onMouseMove={() => highlight.hoverOption(index)}
        onClick={() => onOptionClick(index)}
      >
        {indicator === 'checkbox' && <Checkbox state={state} disabled={item.disabled} />}
        <OptionContent option={item.option} disabled={item.disabled} />
        {indicator === 'check' && (
          <span className={styles['option-check']}>{state.selected && <InternalIcon name="check" />}</span>
        )}
      </li>
    );
  };

  // Options are numbered in the order they appear, across groups, to match the host's flat option list.
  const nodes: React.ReactNode[] = [];
  let optionIndex = 0;
  for (let position = 0; position < items.length; position++) {
    const item = items[position];
    if (item.type === 'option') {
      nodes.push(renderOption(item, optionIndex++));
      continue;
    }
    const groupLabelId = `${baseId}group-${position}`;
    const children: React.ReactNode[] = [];
    while (position + 1 < items.length) {
      const next = items[position + 1];
      if (next.type !== 'option' || next.group !== item.option) {
        break;
      }
      children.push(renderOption(next, optionIndex++));
      position++;
    }
    nodes.push(
      <li key={`group-${position}`} role="presentation" className={styles.group}>
        <div id={groupLabelId} className={clsx(styles['group-label'], item.disabled && styles['option-disabled'])}>
          <OptionContent option={item.option} disabled={item.disabled} />
        </div>
        <ul role="group" aria-labelledby={groupLabelId} className={styles['group-options']}>
          {children}
        </ul>
      </li>
    );
  }

  return (
    <ul
      ref={listRef}
      id={id}
      role="listbox"
      className={styles.list}
      tabIndex={focusable ? -1 : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-multiselectable={multiselectable ? 'true' : undefined}
      aria-activedescendant={focusable && highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined}
    >
      {nodes}
    </ul>
  );
}
