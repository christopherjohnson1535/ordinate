// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SegmentedControlProps } from './interfaces';
import { InternalSegmentedControl } from './internal';

export type { SegmentedControlProps };

const SegmentedControl = React.forwardRef(
  (
    { options = [], selectedId, onChange, label, ariaLabelledby, ...props }: SegmentedControlProps,
    ref: React.Ref<SegmentedControlProps.Ref>
  ) => (
    <InternalSegmentedControl
      {...getBaseProps(props)}
      ref={ref}
      options={options}
      selectedId={selectedId}
      onChange={onChange}
      label={label}
      ariaLabelledby={ariaLabelledby}
    />
  )
);

SegmentedControl.displayName = 'SegmentedControl';

export default SegmentedControl;
