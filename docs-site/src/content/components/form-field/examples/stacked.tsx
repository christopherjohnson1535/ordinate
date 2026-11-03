// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';

export default function Stacked() {
  const [width, setWidth] = useState('12.40');
  const [depth, setDepth] = useState('8.75');
  const [height, setHeight] = useState('3.10');

  return (
    <ColumnLayout columns={3}>
      <FormField label="Width" layout="stacked" constraintText="Meters">
        <Input type="number" inputMode="decimal" value={width} onChange={event => setWidth(event.detail.value)} />
      </FormField>
      <FormField label="Depth" layout="stacked" constraintText="Meters">
        <Input type="number" inputMode="decimal" value={depth} onChange={event => setDepth(event.detail.value)} />
      </FormField>
      <FormField label="Height" layout="stacked" constraintText="Meters">
        <Input type="number" inputMode="decimal" value={height} onChange={event => setHeight(event.detail.value)} />
      </FormField>
    </ColumnLayout>
  );
}
