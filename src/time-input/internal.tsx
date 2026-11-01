// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';

import { MaskedInput } from '../internal/components/masked-input';
import { createTimeMask } from '../internal/components/masked-input/masks';
import { splitBaseProps } from '../internal/split-base-props';
import { TimeInputProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTimeInputProps extends TimeInputProps {
  /**
   * Lets other components position the input. Not part of the public API.
   */
  className?: string;
}

export const InternalTimeInput = React.forwardRef(
  (
    { format = 'hh:mm:ss', use24Hour = true, className, ...props }: InternalTimeInputProps,
    ref: React.Ref<TimeInputProps.Ref>
  ) => {
    const [baseProps, inputProps] = splitBaseProps(props);
    const mask = useMemo(() => createTimeMask(format, use24Hour), [format, use24Hour]);
    return (
      <div {...baseProps} className={clsx(styles.root, className)}>
        <MaskedInput {...inputProps} ref={ref} mask={mask} />
      </div>
    );
  }
);
