// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalCartesianChart } from '../internal/cartesian';
import { MixedLineBarChartProps } from './interfaces';

import styles from './styles.css.js';

export function InternalMixedLineBarChart<T extends MixedLineBarChartProps.DataTypes>(
  props: MixedLineBarChartProps<T>
) {
  return (
    <InternalCartesianChart<T, MixedLineBarChartProps.SeriesSpec<T>>
      {...props}
      chartName="mixed-line-bar-chart"
      rootClassName={styles.root}
      showTotal={props.stackedBars}
    />
  );
}
