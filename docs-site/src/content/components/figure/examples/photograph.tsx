// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Figure from '@ordinate/components/figure';
import Media from '@ordinate/components/media';

// A stand-in for a photograph, so the example needs no network.
const harbour = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <rect width="1200" height="800" fill="#dfe5ea"/><rect y="520" width="1200" height="280" fill="#7d93a6"/>
    <rect x="140" y="300" width="220" height="240" fill="#3f4a55"/><rect x="380" y="240" width="160" height="300" fill="#c9b79c"/>
    <rect x="560" y="330" width="260" height="210" fill="#9a5b3c"/><rect x="840" y="280" width="200" height="260" fill="#e8e1d4"/>
    <path d="M0 600 C 300 570 600 630 1200 590 L1200 800 L0 800 Z" fill="#5f7689"/>
  </svg>`
)}`;

export default function Photograph() {
  return (
    <Figure
      media={<Media src={harbour} alt="Four net lofts on the east quay, seen from the water" aspectRatio="16:9" />}
      label="Fig. 1"
      caption="The east quay at low tide, with the net lofts restored in 2024."
      credit="Photo: Ana Ruiz"
    />
  );
}
