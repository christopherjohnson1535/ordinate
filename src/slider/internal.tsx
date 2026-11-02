// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { warnOnce } from '../internal/logging';
import { SliderProps } from './interfaces';

import styles from './styles.css.js';

// With `tickMarks` left out, a tick is drawn at every step up to this many steps. Past it the scale shows
// its major ticks only, so the graduations do not merge into a solid band.
const autoStepTicks = 40;
// The most step ticks drawn when `tickMarks` asks for them.
const maxStepTicks = 100;

function joinIds(...ids: (string | undefined)[]): string | undefined {
  return ids.filter(Boolean).join(' ') || undefined;
}

function positionStyle(property: string, position: number): React.CSSProperties {
  return { [property]: position } as React.CSSProperties;
}

interface Tick {
  position: number;
  major: boolean;
}

// The graduations of the scale: one at every step when they fit, and a major tick at the minimum, the
// maximum and each reference value. A step that falls on a major position is drawn once, as major.
function getTicks(min: number, max: number, step: number, tickMarks: boolean | undefined, majors: number[]): Tick[] {
  const range = max - min;
  if (range <= 0) {
    return [];
  }
  const ticks = new Map<string, Tick>();
  const add = (position: number, major: boolean) => {
    const key = position.toFixed(6);
    ticks.set(key, { position, major: major || Boolean(ticks.get(key)?.major) });
  };
  const count = step > 0 ? Math.floor(range / step + 1e-9) : 0;
  const limit = tickMarks ? maxStepTicks : autoStepTicks;
  if (tickMarks !== false && count > 0) {
    if (count > limit) {
      if (tickMarks) {
        warnOnce('Slider', `\`tickMarks\` draws major ticks only when there are more than ${maxStepTicks} steps.`);
      }
    } else {
      for (let index = 0; index <= count; index++) {
        add((index * step) / range, false);
      }
    }
  }
  majors.forEach(position => add(position, true));
  return Array.from(ticks.values()).sort((a, b) => a.position - b.position);
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
      tickMarks,
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

    const references = referenceValues.filter(reference => reference > min && reference < max);
    const ticks = getTicks(min, max, step, tickMarks, [0, 1, ...references.map(toPosition)]);
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
            {ticks.map(tick => (
              <span
                key={tick.position}
                className={clsx(styles.tick, tick.major && styles['tick-major'])}
                style={positionStyle('--slider-tick', tick.position)}
              />
            ))}
            <span className={styles.handle} />
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
