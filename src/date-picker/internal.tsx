// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { CalendarProps } from '../calendar/interfaces';
import { InternalCalendar } from '../calendar/internal';
import { DateInputProps } from '../date-input/interfaces';
import { InternalDateInput } from '../date-input/internal';
import { Dropdown } from '../internal/components/dropdown';
import { parseIsoValue } from '../internal/dates/iso';
import { formatFullDate, formatMonthYear, resolveLocale } from '../internal/dates/locale';
import { fireNonCancelableEvent } from '../internal/events';
import { wrapTabFocus } from '../internal/focus';
import { useInternalI18n } from '../internal/i18n/context';
import { DatePickerProps } from './interfaces';

import styles from './styles.css.js';

export const InternalDatePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      isDateEnabled,
      dateDisabledReason,
      granularity = 'day',
      placeholder,
      openCalendarAriaLabel,
      locale: localeProp,
      startOfWeek,
      expandToViewport = false,
      disabled = false,
      readOnly = false,
      autoFocus,
      ariaLabel,
      ariaRequired,
      name,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      i18nStrings,
      ...rest
    }: DatePickerProps,
    ref: React.Ref<DatePickerProps.Ref>
  ) => {
    const i18n = useInternalI18n('date-picker');
    const [open, setOpen] = useState(false);
    const inputRef = useRef<DateInputProps.Ref>(null);
    const buttonRef = useRef<ButtonProps.Ref>(null);
    const calendarRef = useRef<CalendarProps.Ref>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

    useEffect(() => {
      if (open) {
        calendarRef.current?.focus();
      }
    }, [open]);

    const close = (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) {
        buttonRef.current?.focus();
      }
    };

    const locale = resolveLocale(localeProp);
    const selected = parseIsoValue(value, granularity);
    const selectedText = selected
      ? granularity === 'month'
        ? formatMonthYear(selected, locale)
        : formatFullDate(selected, locale)
      : undefined;
    const buttonLabel =
      openCalendarAriaLabel ??
      (selectedText
        ? i18n('openCalendarSelectedAriaLabel', undefined, { granularity, date: selectedText })
        : i18n('openCalendarAriaLabel', undefined, { granularity }));
    const dialogLabel = i18n('openCalendarAriaLabel', undefined, { granularity });

    const trigger = (
      <div className={styles.trigger}>
        <InternalDateInput
          ref={inputRef}
          className={styles.input}
          value={value}
          onChange={event => fireNonCancelableEvent(onChange, event.detail)}
          granularity={granularity}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          ariaLabel={ariaLabel}
          ariaRequired={ariaRequired}
          name={name}
          onFocus={onFocus}
          onBlur={onBlur}
          controlId={controlId}
          ariaLabelledby={ariaLabelledby}
          ariaDescribedby={ariaDescribedby}
          invalid={invalid}
          warning={warning}
        />
        <InternalButton
          ref={buttonRef}
          className={styles['open-button']}
          formAction="none"
          iconName="calendar"
          ariaLabel={buttonLabel}
          ariaHaspopup="dialog"
          ariaExpanded={open}
          disabled={disabled || readOnly}
          onClick={() => setOpen(current => !current)}
        />
      </div>
    );

    return (
      <div {...rest} className={styles.root}>
        <Dropdown
          open={open}
          trigger={trigger}
          minWidth="small"
          maxWidth="none"
          ariaRole="dialog"
          ariaLabel={dialogLabel}
          expandToViewport={expandToViewport}
          onOutsideClick={() => close(false)}
          className={styles.dropdown}
        >
          <div
            ref={popupRef}
            className={styles.popup}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                close(true);
              } else if (popupRef.current) {
                wrapTabFocus(event, popupRef.current);
              }
            }}
          >
            <InternalCalendar
              ref={calendarRef}
              value={value}
              onChange={event => fireNonCancelableEvent(onChange, event.detail)}
              onPick={() => close(true)}
              isDateEnabled={isDateEnabled}
              dateDisabledReason={dateDisabledReason}
              locale={localeProp}
              startOfWeek={startOfWeek}
              granularity={granularity}
              i18nStrings={i18nStrings}
            />
          </div>
        </Dropdown>
      </div>
    );
  }
);
