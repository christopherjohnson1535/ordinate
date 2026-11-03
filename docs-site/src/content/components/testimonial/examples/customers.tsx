// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Testimonial from '@ordinate/components/testimonial';
import StyleScope from '@ordinate/components/style-scope';

// Sample words for this page. On a real site, use real customers' words, with their permission.
export default function Customers() {
  return (
    <StyleScope styleName="shopfront">
      <ColumnLayout columns={3}>
        <Testimonial
          quote="They had my bike back the same afternoon, and explained exactly what they had done."
          name="Priya S."
          detail="Riverside"
        />
        <Testimonial
          tone="accent"
          quote="I came in for a flat tyre and left knowing how to fix one myself."
          name="Ana R."
          detail="Old Town"
        />
        <Testimonial quote="Friendly, quick and fairly priced." name="Jo" detail="Leith" />
      </ColumnLayout>
    </StyleScope>
  );
}
