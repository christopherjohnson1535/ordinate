// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import OpeningHours from '@ordinate/components/opening-hours';
import StyleScope from '@ordinate/components/style-scope';

export default function Inverted() {
  return (
    <StyleScope styleName="shopfront">
      <OpeningHours
        variant="inverted"
        caption="When we are in"
        closedText="Closed, riding"
        highlightToday={true}
        days={[
          { day: 'monday', opens: '10:00', closes: '18:00' },
          { day: 'tuesday', opens: '08:00', closes: '18:00' },
          { day: 'wednesday', opens: '08:00', closes: '18:00' },
          { day: 'thursday', opens: '08:00', closes: '20:00' },
          { day: 'friday', opens: '08:00', closes: '18:00' },
          { day: 'saturday', opens: '09:00', closes: '16:30' },
          { day: 'sunday' },
        ]}
      />
    </StyleScope>
  );
}
