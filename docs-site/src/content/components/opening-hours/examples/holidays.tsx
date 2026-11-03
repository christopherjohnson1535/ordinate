// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import OpeningHours from '@ordinate/components/opening-hours';
import StyleScope from '@ordinate/components/style-scope';

export default function Holidays() {
  return (
    <StyleScope styleName="shopfront">
      <OpeningHours
        caption="Over the holidays"
        rows={[
          { label: '24 December', value: '09:00 – 13:00' },
          { label: '25 and 26 December', value: 'Closed' },
          { label: '31 December', value: '09:00 – 15:00' },
          { label: '1 January', value: 'Closed' },
        ]}
      />
    </StyleScope>
  );
}
