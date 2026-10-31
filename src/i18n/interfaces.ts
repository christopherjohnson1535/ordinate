// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export interface I18nProviderProps {
  /**
   * The locale to show, such as `de` or `pt-BR`. When not set, the `lang` attribute of
   * the page is used, and then English.
   */
  locale?: string;
  /**
   * Message sets to use, such as the built-in ones from `@ordinate/components/i18n/messages/all.de`.
   * When several sets define the same message, the later set wins.
   */
  messages: ReadonlyArray<I18nProviderProps.Messages>;
  children?: React.ReactNode;
}

export namespace I18nProviderProps {
  /**
   * Messages for one component, keyed by message name. Values use ICU message syntax:
   * `{name}`, `{count, plural, one {…} other {…}}` and `{value, select, a {…} other {…}}`.
   */
  export type ComponentMessages = Record<string, string>;

  /**
   * Messages for every component in one locale, keyed by component name, such as `modal`.
   */
  export type LocaleMessages = Record<string, ComponentMessages>;

  /**
   * Messages keyed by package, then by locale.
   */
  export type Messages = Record<string, Record<string, LocaleMessages>>;
}
