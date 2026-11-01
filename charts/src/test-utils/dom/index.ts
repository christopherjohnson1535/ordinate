// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@ordinate/components/test-utils/dom';

import AreaChartWrapper from './area-chart';
import BarChartWrapper from './bar-chart';
import { DetailPopoverWrapper } from './internal/chart';
import LineChartWrapper from './line-chart';
import MixedLineBarChartWrapper from './mixed-line-bar-chart';
import PieChartWrapper from './pie-chart';

export {
  AreaChartWrapper,
  BarChartWrapper,
  DetailPopoverWrapper,
  LineChartWrapper,
  MixedLineBarChartWrapper,
  PieChartWrapper,
};

// Importing this module adds chart finders to the components' wrappers, so a test reaches charts
// the same way it reaches components: `createWrapper().findLineChart()`.
declare module '@ordinate/components/test-utils/dom/core' {
  // Merging with the class needs the same type parameter, even though these methods do not use it.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ElementWrapper<E extends Element = HTMLElement> {
    findAreaChart(selector?: string): AreaChartWrapper | null;
    findAllAreaCharts(selector?: string): AreaChartWrapper[];
    findBarChart(selector?: string): BarChartWrapper | null;
    findAllBarCharts(selector?: string): BarChartWrapper[];
    findLineChart(selector?: string): LineChartWrapper | null;
    findAllLineCharts(selector?: string): LineChartWrapper[];
    findMixedLineBarChart(selector?: string): MixedLineBarChartWrapper | null;
    findAllMixedLineBarCharts(selector?: string): MixedLineBarChartWrapper[];
    findPieChart(selector?: string): PieChartWrapper | null;
    findAllPieCharts(selector?: string): PieChartWrapper[];
  }
}

ElementWrapper.prototype.findAreaChart = function (this: ElementWrapper<Element>, selector?: string) {
  return this.findComponent(AreaChartWrapper, selector);
};
ElementWrapper.prototype.findAllAreaCharts = function (this: ElementWrapper<Element>, selector?: string) {
  return this.findAllComponents(AreaChartWrapper, selector);
};
ElementWrapper.prototype.findBarChart = function (this: ElementWrapper<Element>, selector?: string) {
  return this.findComponent(BarChartWrapper, selector);
};
ElementWrapper.prototype.findAllBarCharts = function (this: ElementWrapper<Element>, selector?: string) {
  return this.findAllComponents(BarChartWrapper, selector);
};
ElementWrapper.prototype.findLineChart = function (this: ElementWrapper<Element>, selector?: string) {
  return this.findComponent(LineChartWrapper, selector);
};
ElementWrapper.prototype.findAllLineCharts = function (this: ElementWrapper<Element>, selector?: string) {
  return this.findAllComponents(LineChartWrapper, selector);
};
ElementWrapper.prototype.findMixedLineBarChart = function (this: ElementWrapper<Element>, selector?: string) {
  return this.findComponent(MixedLineBarChartWrapper, selector);
};
ElementWrapper.prototype.findAllMixedLineBarCharts = function (this: ElementWrapper<Element>, selector?: string) {
  return this.findAllComponents(MixedLineBarChartWrapper, selector);
};
ElementWrapper.prototype.findPieChart = function (this: ElementWrapper<Element>, selector?: string) {
  return this.findComponent(PieChartWrapper, selector);
};
ElementWrapper.prototype.findAllPieCharts = function (this: ElementWrapper<Element>, selector?: string) {
  return this.findAllComponents(PieChartWrapper, selector);
};
