// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef } from 'react';

import { InternalFormField } from '../form-field/internal';
import { InternalInput } from '../input/internal';
import { RadioGroupProps } from '../radio-group/interfaces';
import { InternalRadioGroup } from '../radio-group/internal';
import { InternalSelect } from '../select/internal';
import { DateRangePickerProps } from './interfaces';
import { customOptionKey, getUnits, RelativeDraft } from './range';

import styles from './styles.css.js';

export interface RelativeRangeLabels {
  heading?: string;
  customOptionLabel?: string;
  customOptionDescription?: string;
  durationLabel?: string;
  durationPlaceholder?: string;
  unitLabel?: string;
  formatRelativeRange(value: DateRangePickerProps.RelativeValue): string | undefined;
  formatUnit(unit: DateRangePickerProps.TimeUnit, amount: number): string | undefined;
}

export interface RelativeRangeProps {
  draft: RelativeDraft;
  onChange(draft: RelativeDraft): void;
  relativeOptions: ReadonlyArray<DateRangePickerProps.RelativeOption>;
  dateOnly: boolean;
  labels: RelativeRangeLabels;
}

export interface RelativeRangeRef {
  focus(): void;
}

/**
 * The relative half of the date range picker: the ready-made ranges and a custom duration.
 */
export const RelativeRange = React.forwardRef(
  ({ draft, onChange, relativeOptions, dateOnly, labels }: RelativeRangeProps, ref: React.Ref<RelativeRangeRef>) => {
    const headingId = `${useId()}heading`;
    const groupRef = useRef<RadioGroupProps.Ref>(null);
    useImperativeHandle(ref, () => ({ focus: () => groupRef.current?.focus() }));

    const items: RadioGroupProps.Item[] = [
      ...relativeOptions.map(option => ({ value: option.key, label: labels.formatRelativeRange(option) })),
      { value: customOptionKey, label: labels.customOptionLabel, description: labels.customOptionDescription },
    ];
    const amount = Number(draft.amount) || 0;
    const unitOptions = getUnits(dateOnly).map(unit => ({ value: unit, label: labels.formatUnit(unit, amount) }));

    return (
      <div className={styles.relative}>
        <div id={headingId} className={styles['relative-heading']}>
          {labels.heading}
        </div>
        <InternalRadioGroup
          ref={groupRef}
          ariaLabelledby={headingId}
          value={draft.selectedKey}
          items={items}
          onChange={event => onChange({ ...draft, selectedKey: event.detail.value })}
        />
        {draft.selectedKey === customOptionKey && (
          <div className={styles.custom}>
            <InternalFormField label={labels.durationLabel} stretch={true}>
              <InternalInput
                type="number"
                inputMode="numeric"
                value={draft.amount}
                placeholder={labels.durationPlaceholder}
                onChange={event => onChange({ ...draft, amount: event.detail.value })}
              />
            </InternalFormField>
            <InternalFormField label={labels.unitLabel} stretch={true}>
              <InternalSelect
                options={unitOptions}
                selectedOption={unitOptions.find(option => option.value === draft.unit) ?? null}
                onChange={event =>
                  onChange({ ...draft, unit: event.detail.selectedOption.value as DateRangePickerProps.TimeUnit })
                }
              />
            </InternalFormField>
          </div>
        )}
      </div>
    );
  }
);
