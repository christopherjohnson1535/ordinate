// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import DatePicker from '@ordinate/components/date-picker';
import Icon from '@ordinate/components/icon';
import IconProvider from '@ordinate/components/icon-provider';
import SpaceBetween from '@ordinate/components/space-between';

// A spoked wheel in the same open strokes as the built-in icons, standing in for "adjust".
const wheel = (
  <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" />
    <path d="M8 1.75v12.5M1.75 8h12.5M3.6 3.6l8.8 8.8M12.4 3.6l-8.8 8.8" />
  </svg>
);

// A site diary instead of a calendar page.
const diary = (
  <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
    <path d="M3.5 1.5h9v13h-9zM5.5 1.5v13M7.5 5h3M7.5 7.5h3" />
  </svg>
);

export default function Replace() {
  const [date, setDate] = useState('2026-11-20');

  return (
    <IconProvider icons={{ adjust: wheel, calendar: diary }}>
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <Icon name="adjust" ariaLabel="Workshop settings" />
        <Button iconName="adjust">Workshop settings</Button>
        <DatePicker
          value={date}
          onChange={event => setDate(event.detail.value)}
          ariaLabel="Diary date"
          expandToViewport={true}
        />
      </SpaceBetween>
    </IconProvider>
  );
}
