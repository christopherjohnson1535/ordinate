// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface OpeningHoursProps extends BaseComponentProps {
  /**
   * The opening hours, one entry per day, in the order to show them. Each day has:
   * * `day`: the day of the week in English, from `monday` to `sunday`. It names the row and finds today.
   * * `label` (optional): replaces the day's name, which otherwise comes from the visitor's language.
   * * `opens` and `closes`: times on a 24-hour clock, such as `08:00` and `17:30`. They are shown in the
   *   visitor's format, for example 5:30 PM in the United States.
   * * `closed` (optional): marks the day as closed. A day without times is shown as closed too.
   * * `note` (optional): a short line under the hours, such as "Kitchen closes at 9".
   */
  days?: ReadonlyArray<OpeningHoursProps.Day>;
  /**
   * Free-form rows instead of `days`, for hours that do not fit a weekly pattern, such as holidays.
   * Each row has a `label`, such as "Bank holidays", and a `value`, such as "10:00 to 14:00".
   * Ignored when `days` is set.
   */
  rows?: ReadonlyArray<OpeningHoursProps.Row>;
  /**
   * Marks today's row with the word "Today". Today is worked out in the visitor's browser, from
   * their own clock, so the mark appears once the page has loaded.
   */
  highlightToday?: boolean;
  /**
   * A title for the table, shown above it, such as "Opening hours". Screen readers announce it as the
   * table's name. Without it, give the table a heading nearby.
   */
  caption?: React.ReactNode;
  /**
   * The words shown for a closed day. Defaults to "Closed".
   */
  closedText?: string;
  /**
   * The word that marks today's row. Defaults to "Today".
   */
  todayText?: string;
  /**
   * Shows times on a 12-hour (`12h`, such as 5:30 PM) or a 24-hour clock (`24h`, such as 17:30). By
   * default the clock follows the visitor's language.
   */
  timeFormat?: OpeningHoursProps.TimeFormat;
  /**
   * The language to name days and write times in, such as `en-GB`. Defaults to the page's `lang`, then
   * to the browser's language. Set it when the page is rendered on a server.
   */
  locale?: string;
  /**
   * `inverted` draws the table on its own dark band, like a sign in a shop window. `default` sits on
   * the page.
   */
  variant?: OpeningHoursProps.Variant;
}

export namespace OpeningHoursProps {
  export type DayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

  export interface Day {
    day: DayName;
    label?: React.ReactNode;
    opens?: string;
    closes?: string;
    closed?: boolean;
    note?: React.ReactNode;
  }

  export interface Row {
    label: React.ReactNode;
    value: React.ReactNode;
  }

  export type TimeFormat = '12h' | '24h';

  export type Variant = 'default' | 'inverted';
}
