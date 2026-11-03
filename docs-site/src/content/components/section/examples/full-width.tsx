// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Media from '@ordinate/components/media';
import Section from '@ordinate/components/section';
import StyleScope from '@ordinate/components/style-scope';

// A stand-in for a photograph, so the example needs no network.
const harbourPhoto = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <rect width="1200" height="800" fill="#e6e8e9"/>
    <rect y="520" width="1200" height="280" fill="#7d93a6"/>
    <rect x="140" y="300" width="220" height="240" fill="#3f4a55"/>
    <rect x="380" y="240" width="160" height="300" fill="#c9b79c"/>
    <rect x="560" y="330" width="260" height="210" fill="#9a5b3c"/>
    <rect x="840" y="280" width="200" height="260" fill="#e8e1d4"/>
  </svg>`
)}`;

export default function FullWidth() {
  return (
    <StyleScope styleName="studio">
      <Section heading="Shore Road" description="Four houses rebuilt behind their old fronts, 2025." spacing="small" />
      <Section width="full" spacing="none">
        <Media
          src={harbourPhoto}
          alt="Four narrow houses facing the harbour, in grey, sand, rust and white"
          aspectRatio="16:9"
        />
      </Section>
    </StyleScope>
  );
}
