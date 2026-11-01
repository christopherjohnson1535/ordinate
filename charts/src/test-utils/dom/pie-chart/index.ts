// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@ordinate/components/test-utils/dom';

import { ChartWrapper } from '../internal/chart';

import pieStyles from '../../../internal/pie/styles.css.js';
import styles from '../../../pie-chart/styles.css.js';

export default class PieChartWrapper extends ChartWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the drawn segments in order. Segments with no value are not drawn.
   */
  findSegments(): ElementWrapper<SVGPathElement>[] {
    return this.findAllByClassName<SVGPathElement>(pieStyles.segment);
  }

  /**
   * Returns the label beside each segment, with its title and description.
   */
  findSegmentLabels(): ElementWrapper<SVGGElement>[] {
    return this.findAllByClassName<SVGGElement>(pieStyles.label);
  }

  findInnerMetricValue(): ElementWrapper<SVGTextElement> | null {
    return this.findByClassName<SVGTextElement>(pieStyles['inner-value']);
  }

  findInnerMetricDescription(): ElementWrapper<SVGTextElement> | null {
    return this.findByClassName<SVGTextElement>(pieStyles['inner-description']);
  }
}
