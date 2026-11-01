// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CartesianChartWrapper } from '../internal/cartesian';

import styles from '../../../mixed-line-bar-chart/styles.css.js';

export default class MixedLineBarChartWrapper extends CartesianChartWrapper {
  static rootSelector = `.${styles.root}`;
}
