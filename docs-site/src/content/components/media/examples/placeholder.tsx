// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Media from '@ordinate/components/media';

export default function Placeholder() {
  return (
    <ColumnLayout columns={3} minColumnWidth={180}>
      <Media aspectRatio="4:5" placeholderText="Shop front, morning light" />
      <Media aspectRatio="4:5" placeholderText="Counter with fresh loaves" />
      <Media aspectRatio="4:5" />
    </ColumnLayout>
  );
}
