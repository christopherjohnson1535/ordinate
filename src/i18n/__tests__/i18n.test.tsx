// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';

import I18nProvider, { I18nProviderProps } from '../../../lib/components/i18n';
import english from '../../../lib/components/i18n/messages/all.en';
import { formatMessage } from '../../../lib/components/internal/i18n/format';
import Modal from '../../../lib/components/modal';

const namespace = '@ordinate-ui/components';
// Applications bring their own translations; the library ships English only.
const german: I18nProviderProps.Messages = { [namespace]: { de: { modal: { closeAriaLabel: 'Schließen' } } } };

afterEach(() => {
  document.documentElement.lang = '';
});

const renderModal = (wrapper?: (children: React.ReactElement) => React.ReactElement, closeAriaLabel?: string) => {
  const modal = (
    <Modal visible={true} header="Delete instance" closeAriaLabel={closeAriaLabel}>
      Content
    </Modal>
  );
  return render(wrapper ? wrapper(modal) : modal);
};

describe('built-in messages', () => {
  test('ship English only', () => {
    expect(Object.keys(english[namespace])).toEqual(['en']);
  });

  test('every English message is valid', () => {
    for (const values of Object.values(english[namespace].en)) {
      for (const template of Object.values(values)) {
        expect(() => formatMessage(template, { count: 2 }, 'en')).not.toThrow();
      }
    }
  });
});

describe('I18nProvider', () => {
  test('components fall back to English without a provider', () => {
    renderModal();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  test('supplies messages for the chosen locale', () => {
    renderModal(children => (
      <I18nProvider locale="de" messages={[german]}>
        {children}
      </I18nProvider>
    ));
    expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument();
  });

  test('a prop wins over the provider', () => {
    renderModal(
      children => (
        <I18nProvider locale="de" messages={[german]}>
          {children}
        </I18nProvider>
      ),
      'Dialog schließen'
    );
    expect(screen.getByRole('button', { name: 'Dialog schließen' })).toBeInTheDocument();
  });

  test('uses the page language when no locale is set', () => {
    document.documentElement.lang = 'de-AT';
    renderModal(children => <I18nProvider messages={[german]}>{children}</I18nProvider>);
    expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument();
  });

  test('later message sets win, and missing messages fall back to English', () => {
    const custom: I18nProviderProps.Messages = { [namespace]: { de: { modal: { closeAriaLabel: 'Zu' } } } };
    const partial: I18nProviderProps.Messages = { [namespace]: { fr: { alert: { dismissAriaLabel: 'Ignorer' } } } };
    const { unmount } = renderModal(children => (
      <I18nProvider locale="de" messages={[german, custom]}>
        {children}
      </I18nProvider>
    ));
    expect(screen.getByRole('button', { name: 'Zu' })).toBeInTheDocument();
    unmount();
    renderModal(children => (
      <I18nProvider locale="fr" messages={[partial]}>
        {children}
      </I18nProvider>
    ));
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});

describe('formatMessage', () => {
  test('fills simple arguments', () => {
    expect(formatMessage('Page {page} of {total}', { page: 2, total: 9 })).toBe('Page 2 of 9');
  });

  test('chooses plural forms, with exact matches first and # as the number', () => {
    const template = '{count, plural, =0 {No items} one {# item} other {# items}} selected';
    expect(formatMessage(template, { count: 0 })).toBe('No items selected');
    expect(formatMessage(template, { count: 1 })).toBe('1 item selected');
    expect(formatMessage(template, { count: 1200 })).toBe('1,200 items selected');
    expect(formatMessage(template, { count: 1200 }, 'de')).toBe('1.200 items selected');
  });

  test('chooses select options and falls back to other', () => {
    const template = '{status, select, done {Finished} other {Working}}';
    expect(formatMessage(template, { status: 'done' })).toBe('Finished');
    expect(formatMessage(template, { status: 'queued' })).toBe('Working');
  });

  test('rejects malformed templates', () => {
    expect(() => formatMessage('{count, plural, one {# item}}')).toThrow(/other/);
    expect(() => formatMessage('{name')).toThrow(/Unclosed/);
    expect(() => formatMessage('{n, number}')).toThrow(/Unsupported/);
  });
});
