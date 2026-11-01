// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalIcon } from '../icon/internal';
import { Dropdown } from '../internal/components/dropdown';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { getWeekStart, resolveLocale } from '../internal/dates/locale';
import { fireNonCancelableEvent } from '../internal/events';
import { wrapTabFocus } from '../internal/focus';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalSegmentedControl } from '../segmented-control/internal';
import { AbsoluteRange, AbsoluteRangeRef } from './absolute-range';
import { DateRangePickerProps } from './interfaces';
import { applyDraft, createDraft, Draft, formatAbsoluteRange, Mode } from './range';
import { RelativeRange, RelativeRangeRef } from './relative-range';

import styles from './styles.css.js';

type StringKey = Exclude<keyof DateRangePickerProps.I18nStrings, 'formatRelativeRange' | 'formatUnit'>;

const noOptions: ReadonlyArray<DateRangePickerProps.RelativeOption> = [];

export const InternalDateRangePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      relativeOptions = noOptions,
      rangeSelectorMode = 'default',
      isValidRange,
      isDateEnabled,
      dateDisabledReason,
      timeInputFormat = 'hh:mm:ss',
      dateOnly = false,
      showClearButton = true,
      placeholder,
      locale: localeProp,
      startOfWeek,
      expandToViewport = false,
      disabled = false,
      readOnly = false,
      ariaLabel,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      i18nStrings = {},
      ...rest
    }: DateRangePickerProps,
    ref: React.Ref<DateRangePickerProps.Ref>
  ) => {
    const i18n = useInternalI18n('date-range-picker');
    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid, warning });
    const baseId = useId();
    const hiddenLabelId = `${baseId}label`;
    const contentId = `${baseId}value`;
    const labelIds = field.ariaLabelledby ?? (ariaLabel ? hiddenLabelId : undefined);

    const locale = resolveLocale(localeProp);
    const weekStart = startOfWeek ?? getWeekStart(locale);
    const draftOptions = { rangeSelectorMode, relativeOptions, timeInputFormat, dateOnly };

    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<Draft>(() => createDraft(value, draftOptions));
    const [errorText, setErrorText] = useState<string | null>(null);

    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const absoluteRef = useRef<AbsoluteRangeRef>(null);
    const relativeRef = useRef<RelativeRangeRef>(null);
    useImperativeHandle(ref, () => ({ focus: () => triggerRef.current?.focus() }));

    // Focus moves into the popup once it has rendered, onto the calendar or the list of ranges. It
    // happens only on opening: switching modes inside the popup leaves focus on the mode switch.
    const focusOnRender = useRef(false);
    useEffect(() => {
      if (focusOnRender.current && open) {
        focusOnRender.current = false;
        (draft.mode === 'absolute' ? absoluteRef : relativeRef).current?.focus();
      }
    });

    const formatRelativeRange = (range: DateRangePickerProps.RelativeValue) =>
      i18nStrings.formatRelativeRange?.(range) ??
      i18n('relativeRangeText', undefined, { amount: range.amount, unit: range.unit });

    const openPopup = () => {
      setDraft(createDraft(value, draftOptions));
      setErrorText(null);
      setOpen(true);
      focusOnRender.current = true;
    };

    const close = (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) {
        triggerRef.current?.focus();
      }
    };

    const apply = () => {
      const result = applyDraft(draft, draftOptions);
      if ('error' in result) {
        setErrorText(i18n(result.error, i18nStrings[result.error]) ?? null);
        return;
      }
      const validation = isValidRange?.(result.value) ?? { valid: true };
      if (!validation.valid) {
        setErrorText(validation.errorMessage);
        return;
      }
      fireNonCancelableEvent(onChange, { value: result.value });
      close(true);
    };

    const clear = () => {
      fireNonCancelableEvent(onChange, { value: null });
      close(true);
    };

    const updateDraft = (patch: Partial<Draft>) => {
      setDraft(current => ({ ...current, ...patch }));
      setErrorText(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      const popup = rootRef.current?.querySelector('[role="dialog"]');
      if (!open || !popup?.contains(event.target as Node)) {
        return;
      }
      // A nested control, such as the unit select, closes its own list first.
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault();
        close(true);
      } else {
        wrapTabFocus(event, popup);
      }
    };

    let triggerText: string | undefined;
    if (value?.type === 'absolute') {
      triggerText = formatAbsoluteRange(value, locale, dateOnly, timeInputFormat);
    } else if (value?.type === 'relative') {
      triggerText = formatRelativeRange(value);
    }

    const label = (key: StringKey) => i18n(key, i18nStrings[key]);

    const trigger = (
      <button
        ref={triggerRef}
        id={field.controlId}
        type="button"
        className={clsx(
          styles.trigger,
          open && styles['trigger-open'],
          field.invalid && styles.invalid,
          field.warning && !field.invalid && styles.warning,
          readOnly && styles['read-only']
        )}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={labelIds ? `${labelIds} ${contentId}` : undefined}
        aria-describedby={field.ariaDescribedby}
        aria-invalid={field.invalid ? 'true' : undefined}
        aria-disabled={readOnly && !disabled ? 'true' : undefined}
        onClick={() => {
          if (readOnly) {
            return;
          }
          if (open) {
            close(false);
          } else {
            openPopup();
          }
        }}
        onFocus={() => fireNonCancelableEvent(onFocus, null)}
        onBlur={() => fireNonCancelableEvent(onBlur, null)}
      >
        <InternalIcon className={styles['trigger-icon']} name="calendar" />
        <span id={contentId} className={triggerText ? styles['trigger-text'] : styles.placeholder}>
          {triggerText ?? placeholder}
        </span>
      </button>
    );

    const showModeSwitch = rangeSelectorMode === 'default';
    const modeSwitch = showModeSwitch ? (
      <div className={styles.mode}>
        <InternalSegmentedControl
          label={label('modeSelectionLabel')}
          selectedId={draft.mode}
          options={[
            { id: 'relative', text: label('relativeModeTitle') },
            { id: 'absolute', text: label('absoluteModeTitle') },
          ]}
          onChange={event => updateDraft({ mode: event.detail.selectedId as Mode })}
        />
      </div>
    ) : undefined;

    const footer = (
      <div className={styles.footer}>
        {errorText && (
          <div className={styles.error} role="alert">
            <InternalIcon name="status-negative" ariaLabel={label('errorIconAriaLabel')} />
            <span>{errorText}</span>
          </div>
        )}
        <div className={styles.actions}>
          {showClearButton && (
            <InternalButton className={styles.clear} variant="link" formAction="none" onClick={clear}>
              {label('clearButtonLabel')}
            </InternalButton>
          )}
          <InternalButton formAction="none" onClick={() => close(true)}>
            {label('cancelButtonLabel')}
          </InternalButton>
          <InternalButton variant="primary" formAction="none" onClick={apply}>
            {label('applyButtonLabel')}
          </InternalButton>
        </div>
      </div>
    );

    return (
      <div {...rest} ref={rootRef} className={styles.root} onKeyDown={handleKeyDown}>
        {ariaLabel && !field.ariaLabelledby && (
          <span id={hiddenLabelId} hidden={true}>
            {ariaLabel}
          </span>
        )}
        <Dropdown
          open={open}
          trigger={trigger}
          header={modeSwitch}
          footer={footer}
          minWidth="trigger"
          maxWidth="none"
          ariaRole="dialog"
          ariaLabel={label('dialogAriaLabel')}
          expandToViewport={expandToViewport}
          onOutsideClick={() => close(false)}
          className={styles.dropdown}
        >
          <div className={styles.body}>
            {draft.mode === 'absolute' ? (
              <AbsoluteRange
                ref={absoluteRef}
                draft={draft.absolute}
                onChange={absolute => updateDraft({ absolute })}
                locale={locale}
                weekStart={weekStart}
                dateOnly={dateOnly}
                timeInputFormat={timeInputFormat}
                isDateEnabled={isDateEnabled}
                dateDisabledReason={dateDisabledReason}
                labels={{
                  startDateLabel: label('startDateLabel'),
                  endDateLabel: label('endDateLabel'),
                  startTimeLabel: label('startTimeLabel'),
                  endTimeLabel: label('endTimeLabel'),
                  datePlaceholder: label('datePlaceholder'),
                  timePlaceholder: i18n('timePlaceholder', i18nStrings.timePlaceholder, { format: timeInputFormat }),
                  constraintText: dateOnly ? label('dateConstraintText') : label('dateTimeConstraintText'),
                  previousMonthAriaLabel: label('previousMonthAriaLabel'),
                  nextMonthAriaLabel: label('nextMonthAriaLabel'),
                  todayAriaLabel: label('todayAriaLabel'),
                  selectedRangeAnnouncement: (startDate, endDate) =>
                    i18n('selectedRangeAnnouncement', undefined, { startDate, endDate }),
                }}
              />
            ) : (
              <RelativeRange
                ref={relativeRef}
                draft={draft.relative}
                onChange={relative => updateDraft({ relative })}
                relativeOptions={relativeOptions}
                dateOnly={dateOnly}
                labels={{
                  heading: label('relativeRangeSelectionHeading'),
                  customOptionLabel: label('customRelativeRangeOptionLabel'),
                  customOptionDescription: label('customRelativeRangeOptionDescription'),
                  durationLabel: label('customRelativeRangeDurationLabel'),
                  durationPlaceholder: label('customRelativeRangeDurationPlaceholder'),
                  unitLabel: label('customRelativeRangeUnitLabel'),
                  formatRelativeRange,
                  formatUnit: (unit, amount) =>
                    i18nStrings.formatUnit?.(unit, amount) ?? i18n('unitText', undefined, { unit, amount }),
                }}
              />
            )}
          </div>
        </Dropdown>
      </div>
    );
  }
);
