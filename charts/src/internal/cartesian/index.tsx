// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import { getBaseProps } from '../base';
import { ChartFrame, ChartStatus, ChartStatusKind } from '../components/chart-frame';
import { Legend } from '../components/legend';
import { SeriesFilter } from '../components/series-filter';
import { fireNonCancelableEvent } from '../events';
import { ChartName, resolveI18nStrings } from '../i18n';
import { ChartValue } from '../utils/scales';
import { swatchKind } from './details';
import { CartesianChartProps, CartesianSeries } from './interfaces';
import { normalizeSeries } from './model';
import { CartesianPlot } from './plot';

export interface InternalCartesianChartProps<
  T extends ChartValue,
  S extends CartesianSeries<T>,
> extends CartesianChartProps<T, S> {
  chartName: ChartName;
  /** The public chart's root class, for its test-utils wrapper. */
  rootClassName: string;
  stackedBars?: boolean;
  horizontalBars?: boolean;
  /** Adds a total to the detail popover, for charts that stack their series. */
  showTotal?: boolean;
}

export type { CartesianChartProps, CartesianSeries };

// Series are matched by identity, or by title when the consumer rebuilds the series objects.
export function matchesSeries<S extends { title: string }>(source: S, candidate: S | null | undefined): boolean {
  return candidate === source || (candidate !== null && candidate !== undefined && candidate.title === source.title);
}

/**
 * The chart behind the line, area, bar and mixed charts: filter, plot, legend and states. The
 * public charts only choose the series types and defaults.
 */
export function InternalCartesianChart<T extends ChartValue, S extends CartesianSeries<T>>(
  props: InternalCartesianChartProps<T, S>
) {
  const {
    series,
    chartName,
    rootClassName,
    statusType = 'finished',
    hideFilter = false,
    hideLegend = false,
    height = 300,
    xScaleType = 'linear',
    yScaleType = 'linear',
    detailPopoverSize = 'medium',
    emphasizeBaselineAxis = true,
  } = props;
  const messages = resolveI18nStrings(chartName, props.i18nStrings);
  const allSeries = useMemo(() => normalizeSeries<T>(series), [series]);

  const [hiddenTitles, setHiddenTitles] = useState<ReadonlySet<string>>(() => new Set());
  const [ownHighlight, setOwnHighlight] = useState<string | null>(null);

  const visibleSeries = useMemo(
    () =>
      props.visibleSeries
        ? allSeries.filter(item => props.visibleSeries!.some(candidate => matchesSeries(item.source, candidate)))
        : allSeries.filter(item => !hiddenTitles.has(item.title)),
    [allSeries, props.visibleSeries, hiddenTitles]
  );
  const highlightedSeriesId =
    props.highlightedSeries !== undefined
      ? (allSeries.find(item => matchesSeries(item.source, props.highlightedSeries))?.id ?? null)
      : (allSeries.find(item => item.title === ownHighlight)?.id ?? null);

  const highlight = (id: string | null) => {
    if (id === highlightedSeriesId) {
      return;
    }
    const item = allSeries.find(candidate => candidate.id === id) ?? null;
    setOwnHighlight(item?.title ?? null);
    fireNonCancelableEvent(props.onHighlightChange, { highlightedSeries: (item?.source ?? null) as S | null });
  };

  const changeFilter = (ids: string[]) => {
    const selected = new Set(ids);
    const next = allSeries.filter(item => selected.has(item.id));
    setHiddenTitles(new Set(allSeries.filter(item => !selected.has(item.id)).map(item => item.title)));
    fireNonCancelableEvent(props.onFilterChange, { visibleSeries: next.map(item => item.source as S) });
  };

  const hasData = allSeries.some(item => item.kind === 'threshold' || item.data.length > 0);
  let status: ChartStatusKind | null = null;
  if (statusType === 'loading' || statusType === 'error') {
    status = statusType;
  } else if (!hasData) {
    status = 'empty';
  } else if (visibleSeries.length === 0) {
    status = 'no-match';
  }
  const showControls = status === null || status === 'no-match';

  const filter = !hideFilter && showControls && (
    <SeriesFilter
      items={allSeries.map(item => ({ id: item.id, title: item.title }))}
      selectedIds={visibleSeries.map(item => item.id)}
      onChange={changeFilter}
      label={messages.filterLabel}
      placeholder={messages.filterPlaceholder}
      selectedAriaLabel={messages.filterSelectedAriaLabel}
    />
  );

  const legend = !hideLegend && status === null && (
    <Legend
      items={visibleSeries.map(item => ({
        id: item.id,
        title: item.title,
        kind: swatchKind(item.kind),
        style: item.style,
      }))}
      title={props.legendTitle}
      ariaLabel={messages.legendAriaLabel}
      highlightedId={highlightedSeriesId}
      onHighlight={highlight}
    />
  );

  return (
    <ChartFrame baseProps={getBaseProps(props)} className={rootClassName} filter={filter} legend={legend}>
      {status !== null ? (
        <ChartStatus
          kind={status}
          height={height}
          withAxes={true}
          loadingText={props.loadingText}
          errorText={props.errorText}
          recoveryText={props.recoveryText}
          onRecoveryClick={props.onRecoveryClick}
          empty={props.empty}
          noMatch={props.noMatch}
        />
      ) : (
        <CartesianPlot<T>
          allSeries={allSeries}
          visibleSeries={visibleSeries}
          xScaleType={xScaleType}
          yScaleType={yScaleType}
          xDomain={props.xDomain}
          yDomain={props.yDomain}
          xTicks={props.xTicks}
          yTicks={props.yTicks}
          stackedBars={props.stackedBars ?? false}
          horizontal={props.horizontalBars ?? false}
          showTotal={props.showTotal ?? false}
          emphasizeBaselineAxis={emphasizeBaselineAxis}
          xTitle={props.xTitle}
          yTitle={props.yTitle}
          xTickFormatter={props.xTickFormatter}
          yTickFormatter={props.yTickFormatter}
          height={height}
          highlightedSeriesId={highlightedSeriesId}
          onHighlightSeries={highlight}
          detailPopoverSize={detailPopoverSize}
          detailPopoverFooter={props.detailPopoverFooter}
          ariaLabel={props.ariaLabel}
          ariaLabelledby={props.ariaLabelledby}
          ariaDescription={props.ariaDescription}
          messages={messages}
        />
      )}
    </ChartFrame>
  );
}
