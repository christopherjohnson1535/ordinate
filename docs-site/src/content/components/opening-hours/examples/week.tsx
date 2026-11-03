// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import OpeningHours, { OpeningHoursProps } from '@ordinate/components/opening-hours';
import StyleScope from '@ordinate/components/style-scope';

const workshopWeek: OpeningHoursProps.Day[] = [
  { day: 'monday', closed: true, note: 'Workshop day' },
  { day: 'tuesday', opens: '08:00', closes: '18:00' },
  { day: 'wednesday', opens: '08:00', closes: '18:00' },
  { day: 'thursday', opens: '08:00', closes: '20:00', note: 'Late repairs until 8' },
  { day: 'friday', opens: '08:00', closes: '18:00' },
  { day: 'saturday', opens: '09:00', closes: '16:30' },
  { day: 'sunday', opens: '10:00', closes: '14:00' },
];

export default function Week() {
  return (
    <StyleScope styleName="shopfront">
      <OpeningHours caption="Opening hours" days={workshopWeek} highlightToday={true} />
    </StyleScope>
  );
}
