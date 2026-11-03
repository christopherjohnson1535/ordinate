// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Plate from '@ordinate/components/plate';
import StyleScope from '@ordinate/components/style-scope';

export default function CaptionOnly() {
  return (
    <StyleScope styleName="studio">
      <ColumnLayout columns={3}>
        <Plate
          label="No. 9"
          title="Kiln shed"
          meta="Selkirk, 2022"
          description="Drawings only. The client built it with friends over one summer."
        />
        <Plate label="No. 10" title="Garden wall" meta="Melrose, 2022" />
        <Plate label="No. 11" title="Studio in the hills" meta="Under construction" />
      </ColumnLayout>
    </StyleScope>
  );
}
