// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '@ordinate/components/alert';
import I18nProvider, { I18nProviderProps } from '@ordinate/components/i18n';
import Pagination from '@ordinate/components/pagination';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

// The application's own German messages. Labels it leaves out fall back to English.
const german: I18nProviderProps.Messages = {
  '@ordinate/components': {
    de: {
      alert: { cautionLabel: 'Achtung', dismissAriaLabel: 'Schließen' },
      pagination: {
        paginationLabel: 'Seiten',
        previousPageLabel: 'Vorherige Seite',
        nextPageLabel: 'Nächste Seite',
        pageLabel: 'Seite {pageNumber} von {pagesCount}',
      },
    },
  },
};

export default function TranslatedLabels() {
  const [locale, setLocale] = useState('de');
  const [page, setPage] = useState(3);

  return (
    <SpaceBetween size="l">
      <SegmentedControl
        label="Locale"
        selectedId={locale}
        options={[
          { id: 'en', text: 'English' },
          { id: 'de', text: 'Deutsch' },
        ]}
        onChange={event => setLocale(event.detail.selectedId ?? 'en')}
      />
      <I18nProvider locale={locale} messages={[german]}>
        <SpaceBetween size="l">
          <Alert type="caution" header={locale === 'de' ? 'Wartung am Samstag' : 'Maintenance on Saturday'}>
            {locale === 'de'
              ? 'north-annex ist von 02:00 bis 04:00 Uhr nicht erreichbar.'
              : 'north-annex is unavailable from 02:00 to 04:00.'}
          </Alert>
          <Pagination
            currentPageIndex={page}
            pagesCount={12}
            showPageLabel={true}
            onChange={event => setPage(event.detail.currentPageIndex)}
          />
        </SpaceBetween>
      </I18nProvider>
    </SpaceBetween>
  );
}
