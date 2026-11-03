// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Media from '@ordinate/components/media';
import StyleScope from '@ordinate/components/style-scope';
import Testimonial from '@ordinate/components/testimonial';

// A stand-in for a portrait the customer agreed to share, drawn inline so the example needs no network.
const portrait = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#c9b79c"/><circle cx="100" cy="82" r="38" fill="#6f533d"/>
    <path d="M30 200c10-50 40-70 70-70s60 20 70 70z" fill="#3f4a55"/>
  </svg>`
)}`;

// Sample words for this page. On a real site, use real customers' words, with their permission.
export default function WithPhoto() {
  return (
    <StyleScope styleName="shopfront">
      <ColumnLayout columns={2}>
        <Testimonial
          quote="The best sourdough in the neighbourhood. I plan my Saturdays around it."
          name="Sam O."
          detail="Owner, Corner Books"
          media={<Media src={portrait} alt="" aspectRatio="1:1" />}
        />
        <Testimonial
          tone="accent"
          quote={
            <>
              <p>I came in for a flat tyre and left knowing how to fix one myself.</p>
              <p>That is the kind of shop this is.</p>
            </>
          }
          name="Ana R."
          detail="Old Town"
        />
      </ColumnLayout>
    </StyleScope>
  );
}
