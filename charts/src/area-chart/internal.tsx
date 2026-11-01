// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalCartesianChart } from '../internal/cartesian';
import { AreaChartProps } from './interfaces';

import styles from './styles.css.js';

export function InternalAreaChart<T extends AreaChartProps.DataTypes>(props: AreaChartProps<T>) {
  return (
    <InternalCartesianChart<T, AreaChartProps.SeriesSpec<T>>
      {...props}
      chartName="area-chart"
      rootClassName={styles.root}
      showTotal={true}
    />
  );
}
