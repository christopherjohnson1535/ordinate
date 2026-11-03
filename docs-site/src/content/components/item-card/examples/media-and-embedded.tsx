// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Container from '@ordinate/components/container';
import ItemCard from '@ordinate/components/item-card';
import Link from '@ordinate/components/link';

// A plan of the annex's ground floor, drawn in the current text color so it follows the color mode.
function FloorPlan() {
  return (
    <svg viewBox="0 0 320 120" role="img" aria-label="Ground floor plan" fill="none" stroke="currentColor">
      <rect x="40" y="20" width="240" height="80" strokeWidth="1.5" />
      <path d="M140 20v50M200 70v30M140 70h140" strokeWidth="1" />
      <path d="M40 112h240M40 108v8M280 108v8" strokeWidth="0.75" />
    </svg>
  );
}

export default function MediaAndEmbedded() {
  return (
    <ColumnLayout columns={2}>
      <ItemCard
        media={<FloorPlan />}
        header={<Link href="#/components/item-card">Sheet A-02, ground floor</Link>}
        description="North Annex, revision C"
        reference="R7"
        kind="resource"
        footer="Issued 14 October"
      />
      <Container heading="Linked drawing">
        <ItemCard
          variant="embedded"
          header={<Link href="#/components/item-card">Sheet A-03, first floor</Link>}
          description="North Annex, revision B"
          footer="Issued 2 September"
        />
      </Container>
    </ColumnLayout>
  );
}
