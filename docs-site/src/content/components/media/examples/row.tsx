// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Media from '@ordinate/components/media';

// Stand-ins for photographs, drawn inline so the example needs no network.
const picture = (body: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">${body}</svg>`
  )}`;

const harbour = picture(
  `<rect width="1200" height="800" fill="#dfe5ea"/><rect y="520" width="1200" height="280" fill="#7d93a6"/>
   <rect x="140" y="300" width="220" height="240" fill="#3f4a55"/><rect x="380" y="240" width="160" height="300" fill="#c9b79c"/>
   <rect x="560" y="330" width="260" height="210" fill="#9a5b3c"/><rect x="840" y="280" width="200" height="260" fill="#e8e1d4"/>`
);

const loaves = picture(
  `<rect width="1200" height="800" fill="#efe7da"/><rect y="560" width="1200" height="240" fill="#b98f62"/>
   <ellipse cx="380" cy="520" rx="230" ry="110" fill="#8a5a33"/><ellipse cx="800" cy="530" rx="200" ry="95" fill="#a36d3f"/>
   <path d="M250 500q130-60 260 0M680 515q120-50 240 0" stroke="#e9cfa6" stroke-width="14" fill="none"/>`
);

const workshop = picture(
  `<rect width="1200" height="800" fill="#e4e2dc"/><rect x="0" y="600" width="1200" height="200" fill="#9b968c"/>
   <circle cx="420" cy="500" r="150" fill="none" stroke="#2f3337" stroke-width="18"/>
   <circle cx="820" cy="500" r="150" fill="none" stroke="#2f3337" stroke-width="18"/>
   <path d="M420 500l120-200h170l110 200M540 300l60 200" stroke="#c4462b" stroke-width="22" fill="none"/>`
);

export default function Row() {
  return (
    <ColumnLayout columns={3}>
      <Media src={harbour} alt="Four narrow houses facing the harbour at low tide" aspectRatio="4:5" />
      <Media src={loaves} alt="Two sourdough loaves cooling on the counter" aspectRatio="4:5" />
      <Media src={workshop} alt="A red town bicycle on the workshop floor" aspectRatio="4:5" />
    </ColumnLayout>
  );
}
