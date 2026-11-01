// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@ordinate-ui/components/test-utils/dom';

import { ChartWrapper } from './chart';

import styles from '../../../internal/cartesian/styles.css.js';

/**
 * The parts of a chart with x and y axes.
 */
export class CartesianChartWrapper extends ChartWrapper {
  /**
   * Returns the labels of the x axis, which holds the categories, also when bars run sideways.
   */
  findXAxisTicks(): ElementWrapper<SVGTextElement>[] {
    return this.findAll<SVGTextElement>(`.${styles['x-axis']} .${styles['tick-label']}`);
  }

  /**
   * Returns the labels of the y axis, which holds the values.
   */
  findYAxisTicks(): ElementWrapper<SVGTextElement>[] {
    return this.findAll<SVGTextElement>(`.${styles['y-axis']} .${styles['tick-label']}`);
  }

  /**
   * Returns one group per drawn series, in drawing order: areas, then bars, then thresholds,
   * then lines, each kind in the order it is listed.
   */
  findSeries(): ElementWrapper<SVGGElement>[] {
    return this.findAllByClassName<SVGGElement>(styles.series);
  }

  findBars(): ElementWrapper<SVGRectElement>[] {
    return this.findAllByClassName<SVGRectElement>(styles.bar);
  }
}
