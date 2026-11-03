// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import ColumnLayout from '@ordinate/components/column-layout';
import MenuTile from '@ordinate/components/menu-tile';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

export default function PriceList() {
  const [booking, setBooking] = useState('');

  return (
    <StyleScope styleName="shopfront">
      <SpaceBetween size="m">
        <ColumnLayout columns={3}>
          <MenuTile
            title="Quick fixes"
            description="While you wait, most days."
            items={[
              { label: 'Puncture repair', value: '£12' },
              { label: 'Brake adjustment', value: '£15' },
              { label: 'Chain clean and lube', value: '£10' },
            ]}
          />
          <MenuTile
            tone="emphasis"
            badge="Most booked"
            title="Full service"
            description="Everything checked, cleaned, trued and adjusted."
            items={[
              { label: 'Full service', value: '£75', description: 'Gears, brakes, wheels and bearings.' },
              { label: 'With new cables', value: '£95' },
            ]}
            footer={
              <Button onClick={() => setBooking('Opening the booking form for a full service.')}>Book a service</Button>
            }
          />
          <MenuTile
            tone="accent"
            title="Wheels"
            items={[
              { label: 'Wheel truing', value: '£20' },
              { label: 'Spoke replacement', value: '£6', description: 'Per spoke, after the first.' },
              { label: 'Tubeless setup', value: 'from £30' },
            ]}
            footer="Bring the wheel in on its own if that is easier."
          />
        </ColumnLayout>
        {booking && (
          <Box color="text-body-secondary" fontSize="body-s">
            {booking}
          </Box>
        )}
      </SpaceBetween>
    </StyleScope>
  );
}
