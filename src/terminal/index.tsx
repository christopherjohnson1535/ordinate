// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TerminalProps } from './interfaces';
import { InternalTerminal } from './internal';

export type { TerminalProps };

/**
 * A transcript of terminal commands and their output, on the terminal colors in both modes. Lines can
 * be commands, output, table headers, results and notes.
 */
export default function Terminal({ lines, wrapLines = true, ariaLabel, ariaLabelledby, ...props }: TerminalProps) {
  return (
    <InternalTerminal
      {...getBaseProps(props)}
      lines={lines}
      wrapLines={wrapLines}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
    />
  );
}
