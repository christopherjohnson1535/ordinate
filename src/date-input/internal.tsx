// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';

import { InternalInputProps } from '../input/internal';
import { MaskedInput } from '../internal/components/masked-input';
import { createDateMask, dateDisplayToValue, dateValueToDisplay } from '../internal/components/masked-input/masks';
import { fireNonCancelableEvent } from '../internal/events';
import { splitBaseProps } from '../internal/split-base-props';
import { DateInputProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalDateInputProps extends DateInputProps {
  /**
   * Lets other components position the input. Not part of the public API.
   */
  className?: string;
  /**
   * Attributes for the native input that other components need. Not part of the public API.
   */
  nativeInputAttributes?: InternalInputProps['nativeInputAttributes'];
}

export const InternalDateInput = React.forwardRef(
  (
    { value, onChange, granularity = 'day', className, ...props }: InternalDateInputProps,
    ref: React.Ref<DateInputProps.Ref>
  ) => {
    const [baseProps, inputProps] = splitBaseProps(props);
    const mask = useMemo(() => createDateMask(granularity), [granularity]);
    return (
      <div {...baseProps} className={clsx(styles.root, className)}>
        <MaskedInput
          {...inputProps}
          ref={ref}
          mask={mask}
          value={dateValueToDisplay(value)}
          onChange={event => fireNonCancelableEvent(onChange, { value: dateDisplayToValue(event.detail.value) })}
        />
      </div>
    );
  }
);
