// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useFormatLocale } from '../file-token-group/format';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { MeasureProps } from './interfaces';
import { getTicks, toPosition } from './scale';

import styles from './styles.css.js';

export interface InternalMeasureProps extends MeasureProps {
  /**
   * Lets other components position the measure. Not part of the public API.
   */
  className?: string;
}

interface RulerProps {
  max: number;
  current: number | undefined;
  limit: number | undefined;
  formattedZero: string;
  formattedMax: string;
}

/**
 * The ruler under the reading. It only repeats numbers the text already says, so it is hidden from
 * screen readers.
 */
function Ruler({ max, current, limit, formattedZero, formattedMax }: RulerProps) {
  return (
    <div className={styles.ruler} aria-hidden="true">
      <div className={styles.scale}>
        {current !== undefined && (
          <span className={styles.run} style={{ inlineSize: `${toPosition(current, max)}%` }} />
        )}
        {getTicks(max).map(({ position, major }) => (
          <span
            key={position}
            className={clsx(styles.tick, major && styles['tick-major'])}
            style={{ insetInlineStart: `${position}%` }}
          />
        ))}
        {limit !== undefined && (
          <span className={styles['limit-mark']} style={{ insetInlineStart: `${toPosition(limit, max)}%` }} />
        )}
      </div>
      <div className={styles.ends}>
        <span>{formattedZero}</span>
        <span>{formattedMax}</span>
      </div>
    </div>
  );
}

export function InternalMeasure({
  label,
  value,
  unit,
  description,
  max,
  current,
  limit,
  limitLabel,
  format,
  i18nStrings,
  className,
  ...rest
}: InternalMeasureProps) {
  const i18n = useInternalI18n('measure');
  const locale = useFormatLocale();
  const formatNumber = format ?? new Intl.NumberFormat(locale).format;

  const hasScale = max !== undefined && max > 0 && Number.isFinite(max);
  if (max !== undefined && !hasScale) {
    warnOnce('Measure', '`max` must be a number above zero to draw a ruler.');
  }
  if (limit !== undefined && !hasScale) {
    warnOnce('Measure', '`limit` needs `max` to be placed on the ruler.');
  }

  const formattedMax = hasScale ? formatNumber(max) : '';
  const run = current ?? (typeof value === 'number' ? value : undefined);
  const showLimit = hasScale && limit !== undefined;
  const limitPosition = showLimit ? toPosition(limit, max) : 0;
  const limitText = showLimit
    ? (limitLabel ?? i18n('limitLabel', i18nStrings?.limitLabel?.(formatNumber(limit)), { limit: formatNumber(limit) }))
    : null;

  return (
    <div {...rest} className={clsx(styles.root, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.reading}>
        <span className={styles.value}>{typeof value === 'number' ? formatNumber(value) : value}</span>
        {hasScale && (
          <>
            {' '}
            <span className={styles.of}>
              {i18n('ofMax', i18nStrings?.ofMax?.(formattedMax), { max: formattedMax })}
            </span>
          </>
        )}
        {unit && (
          <>
            {' '}
            <span className={styles.unit}>{unit}</span>
          </>
        )}
      </div>
      {hasScale && (
        <Ruler
          max={max}
          current={run}
          limit={showLimit ? limit : undefined}
          formattedZero={formatNumber(0)}
          formattedMax={formattedMax}
        />
      )}
      {limitText && (
        <div className={styles['limit-row']}>
          {/* The name of the limit starts or ends at its mark, toward whichever side has more room. */}
          <span
            className={clsx(styles['limit-label'], limitPosition > 50 && styles['limit-label-end'])}
            style={
              limitPosition <= 50
                ? { marginInlineStart: `${limitPosition}%` }
                : { marginInlineStart: 'auto', marginInlineEnd: `${100 - limitPosition}%` }
            }
          >
            {limitText}
          </span>
        </div>
      )}
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
}
