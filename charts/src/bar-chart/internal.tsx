// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalCartesianChart } from '../internal/cartesian';
import { BarChartProps } from './interfaces';

import styles from './styles.css.js';

export function InternalBarChart<T extends BarChartProps.DataTypes>(props: BarChartProps<T>) {
  return (
    <InternalCartesianChart<T, BarChartProps.SeriesSpec<T>>
      {...props}
      chartName="bar-chart"
      rootClassName={styles.root}
      showTotal={props.stackedBars}
    />
  );
}
