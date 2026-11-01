// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface MeasureProps extends BaseComponentProps {
  /**
   * What is measured, such as "Nodes in service". Leave it out when the measure sits in a key-value
   * pair that already names it.
   */
  label?: React.ReactNode;
  /**
   * The reading. A number is formatted with `format`; text, such as "99.98%", is shown as it is.
   */
  value: number | string;
  /**
   * The unit after the reading, such as "ms" or "nodes".
   */
  unit?: React.ReactNode;
  /**
   * A short note below the reading, such as "last 24 hours".
   */
  description?: React.ReactNode;
  /**
   * The end of the scale. With it, the reading says "of" the maximum, as in "20 of 32 nodes", and a
   * ruler is drawn from zero to the maximum with the run up to the reading filled in.
   */
  max?: number;
  /**
   * Where the filled run of the ruler ends, when `value` is not a number or is rounded for display.
   * Defaults to `value` when it is a number. Keep the two saying the same thing, because the ruler
   * is only drawn and the text is what screen readers read.
   */
  current?: number;
  /**
   * A limit or target on the scale, drawn as a dashed mark across the ruler and named by `limitLabel`.
   * It needs `max`.
   */
  limit?: number;
  /**
   * The text that names the limit, such as "target 200 ms". Defaults to "Limit" and the formatted limit.
   */
  limitLabel?: React.ReactNode;
  /**
   * Formats the numbers: the reading, the maximum and the limit. Defaults to the number format of
   * the `I18nProvider` locale or the page language, such as "4,210".
   */
  format?: (value: number) => string;
  /**
   * Replaces the built-in text.
   */
  i18nStrings?: MeasureProps.I18nStrings;
}

export namespace MeasureProps {
  export interface I18nStrings {
    /**
     * The words after the reading that name the maximum, given the formatted maximum, as in "of 32".
     */
    ofMax?: (formattedMax: string) => string;
    /**
     * The name of a limit without a `limitLabel`, given the formatted limit.
     */
    limitLabel?: (formattedLimit: string) => string;
  }
}
