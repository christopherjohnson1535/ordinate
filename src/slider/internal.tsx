// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { warnOnce } from '../internal/logging';
import { SliderProps } from './interfaces';

import styles from './styles.css.js';

// More ticks than this would merge into a solid band.
const maxTicks = 101;

function joinIds(...ids: (string | undefined)[]): string | undefined {
  return ids.filter(Boolean).join(' ') || undefined;
}

function positionStyle(property: string, position: number): React.CSSProperties {
  return { [property]: position } as React.CSSProperties;
}

function getTickPositions(min: number, max: number, step: number): number[] {
  const count = Math.floor((max - min) / step + 1e-9);
  if (count + 1 > maxTicks) {
    warnOnce('Slider', `\`tickMarks\` is ignored when there are more than ${maxTicks} steps.`);
    return [];
  }
  return Array.from({ length: count + 1 }, (_, index) => (index * step) / (max - min));
}

export const InternalSlider = React.forwardRef(
  (
    {
      value,
      min,
      max,
      step = 1,
      onChange,
      disabled = false,
      readOnly = false,
      tickMarks = false,
      hideFillLine = false,
      referenceValues = [],
      valueFormatter,
      ariaLabel,
      ariaDescription,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...rest
    }: SliderProps,
    ref: React.Ref<SliderProps.Ref>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid, warning });
    const descriptionId = `${useId()}description`;

    const range = max - min;
    if (range <= 0) {
      warnOnce('Slider', '`max` must be greater than `min`.');
    }
    const toPosition = (number: number) => (range > 0 ? Math.min(Math.max((number - min) / range, 0), 1) : 0);
    const format = (number: number) => (valueFormatter ? valueFormatter(number) : String(number));

    const ticks = tickMarks && range > 0 && step > 0 ? getTickPositions(min, max, step) : [];
    const references = referenceValues.filter(reference => reference > min && reference < max);
    const status = field.invalid ? 'invalid' : field.warning ? 'warning' : undefined;

    return (
      <div
        {...rest}
        className={clsx(
          styles.root,
          disabled && styles.disabled,
          readOnly && !disabled && styles['read-only'],
          status && styles[status]
        )}
        style={positionStyle('--slider-value', toPosition(value))}
      >
        <div className={styles.control}>
          <div className={styles.track} aria-hidden="true">
            <span className={styles.rail} />
            {!hideFillLine && <span className={styles.fill} />}
            {ticks.map((position, index) => (
              <span key={index} className={styles.tick} style={positionStyle('--slider-tick', position)} />
            ))}
            {references.map(reference => (
              <span
                key={reference}
                className={clsx(styles.tick, styles['tick-reference'])}
                style={positionStyle('--slider-tick', toPosition(reference))}
              />
            ))}
            <span className={styles.readout}>
              <span className={styles['readout-text']}>{format(value)}</span>
            </span>
          </div>
          <input
            ref={inputRef}
            id={field.controlId}
            className={styles.input}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            aria-label={ariaLabel}
            // An ariaLabel set on the slider names it, so it replaces the label from the form field.
            aria-labelledby={ariaLabel && !ariaLabelledby ? undefined : field.ariaLabelledby}
            aria-describedby={joinIds(field.ariaDescribedby, ariaDescription ? descriptionId : undefined)}
            aria-valuetext={valueFormatter ? format(value) : undefined}
            aria-invalid={field.invalid ? 'true' : undefined}
            aria-readonly={readOnly && !disabled ? 'true' : undefined}
            onChange={event => {
              if (!readOnly) {
                fireNonCancelableEvent(onChange, { value: Number(event.target.value) });
              }
            }}
            onFocus={() => fireNonCancelableEvent(onFocus, null)}
            onBlur={() => fireNonCancelableEvent(onBlur, null)}
          />
        </div>
        <div className={styles.labels} aria-hidden="true">
          <span className={styles['label-min']}>{format(min)}</span>
          <span className={styles['label-track']}>
            {references.map(reference => (
              <span
                key={reference}
                className={styles['label-reference']}
                style={positionStyle('--slider-tick', toPosition(reference))}
              >
                {format(reference)}
              </span>
            ))}
          </span>
          <span className={styles['label-max']}>{format(max)}</span>
        </div>
        {ariaDescription && (
          <span id={descriptionId} hidden={true}>
            {ariaDescription}
          </span>
        )}
      </div>
    );
  }
);
