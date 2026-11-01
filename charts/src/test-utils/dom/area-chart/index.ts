// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CartesianChartWrapper } from '../internal/cartesian';

import styles from '../../../area-chart/styles.css.js';

export default class AreaChartWrapper extends CartesianChartWrapper {
  static rootSelector = `.${styles.root}`;
}
