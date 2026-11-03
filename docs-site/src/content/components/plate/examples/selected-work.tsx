// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Media from '@ordinate/components/media';
import Plate from '@ordinate/components/plate';
import StyleScope from '@ordinate/components/style-scope';

// Stand-ins for photographs, drawn inline so the example needs no network.
const picture = (body: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">${body}</svg>`
  )}`;

const work = [
  {
    slug: 'harbour-house',
    label: 'Plate I',
    title: 'Harbour House',
    meta: 'Lisbon, 2025',
    description: 'A net loft turned into a family home, keeping the original timber frame.',
    src: picture(
      `<rect width="800" height="1000" fill="#dfe5ea"/><rect y="700" width="800" height="300" fill="#7d93a6"/>
       <rect x="180" y="340" width="440" height="380" fill="#3f4a55"/><path d="M160 350l240-170 240 170z" fill="#9a5b3c"/>`
    ),
  },
  {
    slug: 'oak-chair',
    label: 'Plate II',
    title: 'Oak chair, no. 4',
    meta: 'Furniture, 2024',
    description: 'Made from one board of Borders oak, pegged rather than glued.',
    src: picture(
      `<rect width="800" height="1000" fill="#ece8e1"/><rect y="760" width="800" height="240" fill="#d8d1c5"/>
       <rect x="250" y="260" width="300" height="320" fill="#8c6a4f"/><rect x="250" y="560" width="300" height="60" fill="#6f533d"/>
       <rect x="262" y="620" width="24" height="220" fill="#4b3a2c"/><rect x="514" y="620" width="24" height="220" fill="#4b3a2c"/>`
    ),
  },
  {
    slug: 'reading-room',
    label: 'Plate III',
    title: 'Reading room',
    meta: 'Porto, 2023',
    description: 'A small public library behind a shop front on Rua das Flores.',
    src: picture(
      `<rect width="800" height="1000" fill="#e9e4da"/><rect x="120" y="200" width="560" height="600" fill="#c9b79c"/>
       <path d="M160 260h480M160 380h480M160 500h480M160 620h480" stroke="#6f533d" stroke-width="16"/>`
    ),
  },
];

export default function SelectedWork() {
  return (
    <StyleScope styleName="studio">
      <ColumnLayout columns={3}>
        {work.map(item => (
          <Plate
            key={item.label}
            href={`https://example.com/work/${item.slug}`}
            media={<Media src={item.src} alt="" aspectRatio="4:5" />}
            label={item.label}
            title={item.title}
            meta={item.meta}
            description={item.description}
          />
        ))}
      </ColumnLayout>
    </StyleScope>
  );
}
