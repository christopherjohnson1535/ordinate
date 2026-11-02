// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { IconProps } from '../../../icon/interfaces';
import { InternalIcon } from '../../../icon/internal';

import styles from './styles.css.js';

export interface SelectTriggerProps {
  triggerRef: React.Ref<HTMLButtonElement>;
  id?: string;
  open: boolean;
  listId: string;
  disabled: boolean;
  readOnly: boolean;
  invalid?: boolean;
  warning?: boolean;
  /**
   * IDs that name the trigger. The ID of the trigger's content is appended, so the value is read after the label.
   */
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  contentId: string;
  children: React.ReactNode;
  onClick(event: React.MouseEvent): void;
  onKeyDown(event: React.KeyboardEvent): void;
  onKeyUp(event: React.KeyboardEvent): void;
}

/**
 * The button that opens the list of a select or multiselect and shows its value.
 */
export function SelectTrigger({
  triggerRef,
  id,
  open,
  listId,
  disabled,
  readOnly,
  invalid,
  warning,
  ariaLabelledby,
  ariaDescribedby,
  contentId,
  children,
  onClick,
  onKeyDown,
  onKeyUp,
}: SelectTriggerProps) {
  return (
    <button
      ref={triggerRef}
      id={id}
      type="button"
      className={clsx(
        styles.trigger,
        open && styles['trigger-open'],
        invalid && styles.invalid,
        warning && !invalid && styles.warning,
        readOnly && styles['read-only']
      )}
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? listId : undefined}
      aria-labelledby={ariaLabelledby ? `${ariaLabelledby} ${contentId}` : undefined}
      aria-describedby={ariaDescribedby}
      aria-invalid={invalid ? 'true' : undefined}
      aria-disabled={readOnly && !disabled ? 'true' : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    >
      <span id={contentId} className={styles['trigger-content']}>
        {children}
      </span>
      <InternalIcon className={styles['trigger-icon']} name="chevron-down" />
    </button>
  );
}

export interface TriggerLabelProps {
  children: React.ReactNode;
  lang?: string;
  iconName?: IconProps.Name;
  iconAriaLabel?: string;
}

export function TriggerLabel({ children, lang, iconName, iconAriaLabel }: TriggerLabelProps) {
  return (
    <>
      {iconName && <InternalIcon className={styles['trigger-label-icon']} name={iconName} ariaLabel={iconAriaLabel} />}
      <span className={styles['trigger-label']} lang={lang}>
        {children}
      </span>
    </>
  );
}

export function TriggerPlaceholder({ children }: { children: React.ReactNode }) {
  return <span className={styles.placeholder}>{children}</span>;
}

export interface FilterInputProps {
  filterRef: React.Ref<HTMLInputElement>;
  value: string;
  listId: string;
  activeDescendant?: string;
  placeholder?: string;
  ariaLabel?: string;
  onChange(value: string): void;
}

/**
 * The text input at the top of an open list that filters its options. It keeps focus while the
 * arrow keys move the highlight, so it points at the highlighted option.
 */
export function FilterInput({
  filterRef,
  value,
  listId,
  activeDescendant,
  placeholder,
  ariaLabel,
  onChange,
}: FilterInputProps) {
  return (
    <input
      ref={filterRef}
      className={styles['filter-input']}
      type="text"
      role="combobox"
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      aria-label={ariaLabel}
      aria-expanded={true}
      aria-controls={listId}
      aria-autocomplete="list"
      aria-activedescendant={activeDescendant}
      onChange={event => onChange(event.target.value)}
    />
  );
}
