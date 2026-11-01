// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CartesianChartWrapper } from '../internal/cartesian';

import styles from '../../../line-chart/styles.css.js';

export default class LineChartWrapper extends CartesianChartWrapper {
  static rootSelector = `.${styles.root}`;
}
