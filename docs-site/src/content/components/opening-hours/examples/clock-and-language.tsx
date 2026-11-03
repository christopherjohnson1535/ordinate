// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import OpeningHours, { OpeningHoursProps } from '@ordinate/components/opening-hours';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

const cafeWeek: OpeningHoursProps.Day[] = [
  { day: 'wednesday', opens: '07:30', closes: '15:00' },
  { day: 'thursday', opens: '07:30', closes: '15:00' },
  { day: 'friday', opens: '07:30', closes: '22:00', note: 'Kitchen closes at 9' },
  { day: 'saturday', opens: '09:00', closes: '22:00', note: 'Kitchen closes at 9' },
  { day: 'sunday', opens: '09:00', closes: '14:00' },
];

const languages: Record<string, { caption: string; closedText: string }> = {
  'en-US': { caption: 'Café hours', closedText: 'Closed' },
  'en-GB': { caption: 'Café hours', closedText: 'Closed' },
  'de-DE': { caption: 'Öffnungszeiten', closedText: 'Geschlossen' },
};

export default function ClockAndLanguage() {
  const [locale, setLocale] = useState('en-US');

  return (
    <StyleScope styleName="editorial">
      <SpaceBetween size="l">
        <SegmentedControl
          label="Language"
          selectedId={locale}
          onChange={event => setLocale(event.detail.selectedId)}
          options={[
            { id: 'en-US', text: 'en-US' },
            { id: 'en-GB', text: 'en-GB' },
            { id: 'de-DE', text: 'de-DE' },
          ]}
        />
        <OpeningHours locale={locale} days={cafeWeek} {...languages[locale]} />
        <OpeningHours caption="Always on a 24-hour clock" locale={locale} timeFormat="24h" days={cafeWeek.slice(2)} />
      </SpaceBetween>
    </StyleScope>
  );
}
