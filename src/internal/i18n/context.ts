// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

import { I18nProviderProps } from '../../i18n/interfaces';
import english from '../../i18n/messages/all.en';
import { formatMessage, MessageParams } from './format';

export const namespace = '@ordinate-ui/components';
const fallbackLocale = 'en';

export interface I18nContextValue {
  locale: string | null;
  messages: Record<string, I18nProviderProps.LocaleMessages>;
}

export const I18nContext = createContext<I18nContextValue>({ locale: null, messages: {} });

function documentLocale(): string | null {
  return typeof document === 'undefined' ? null : document.documentElement.lang || null;
}

/**
 * Picks the closest available locale: an exact match, then the same language
 * (`pt-BR` falls back to `pt`, and `zh` to `zh-CN`), then English.
 */
export function matchLocale(requested: string | null, available: ReadonlyArray<string>): string {
  if (!requested) {
    return fallbackLocale;
  }
  const lower = requested.toLowerCase();
  const language = lower.split('-')[0];
  const candidates = available.map(locale => [locale, locale.toLowerCase()] as const);
  const exact = candidates.find(([, candidate]) => candidate === lower);
  const sameLanguage =
    candidates.find(([, candidate]) => candidate === language) ??
    candidates.find(([, candidate]) => candidate.split('-')[0] === language);
  return (exact ?? sameLanguage)?.[0] ?? fallbackLocale;
}

/**
 * Merges message sets for Ordinate's namespace. Later sets win.
 */
export function mergeMessages(sets: ReadonlyArray<I18nProviderProps.Messages>): I18nContextValue['messages'] {
  const merged: I18nContextValue['messages'] = {};
  for (const set of sets) {
    for (const [locale, components] of Object.entries(set[namespace] ?? {})) {
      const target = (merged[locale] ??= {});
      for (const [component, values] of Object.entries(components)) {
        target[component] = { ...target[component], ...values };
      }
    }
  }
  return merged;
}

export type I18nFormatter = (key: string, provided?: string, params?: MessageParams) => string | undefined;

/**
 * Returns a lookup for one component's messages. A value passed as a prop always wins;
 * otherwise the message comes from the provider's locale, then from English.
 */
export function useInternalI18n(component: string): I18nFormatter {
  const { locale: providerLocale, messages } = useContext(I18nContext);
  return (key, provided, params) => {
    if (provided !== undefined) {
      return provided;
    }
    const locale = matchLocale(providerLocale ?? documentLocale(), Object.keys(messages));
    const template =
      messages[locale]?.[component]?.[key] ?? english[namespace][fallbackLocale][component]?.[key] ?? undefined;
    return template === undefined ? undefined : formatMessage(template, params, locale);
  };
}
