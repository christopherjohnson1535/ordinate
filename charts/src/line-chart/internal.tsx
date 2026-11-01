// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalCartesianChart } from '../internal/cartesian';
import { LineChartProps } from './interfaces';

import styles from './styles.css.js';

export function InternalLineChart<T extends LineChartProps.DataTypes>(props: LineChartProps<T>) {
  return (
    <InternalCartesianChart<T, LineChartProps.SeriesSpec<T>>
      {...props}
      chartName="line-chart"
      rootClassName={styles.root}
    />
  );
}
