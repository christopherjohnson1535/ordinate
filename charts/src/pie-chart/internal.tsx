// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import { getBaseProps } from '../internal/base';
import { matchesSeries } from '../internal/cartesian';
import { ChartFrame, ChartStatus, ChartStatusKind } from '../internal/components/chart-frame';
import { Legend } from '../internal/components/legend';
import { SeriesFilter } from '../internal/components/series-filter';
import { fireNonCancelableEvent } from '../internal/events';
import { resolveI18nStrings } from '../internal/i18n';
import { PiePlot, PieSegment } from '../internal/pie/plot';
import { getSeriesStyle } from '../internal/series-style';
import { PieChartProps } from './interfaces';

import styles from './styles.css.js';

export function InternalPieChart<T extends PieChartProps.Datum>(props: PieChartProps<T>) {
  const {
    data,
    variant = 'pie',
    size = 'medium',
    statusType = 'finished',
    hideFilter = false,
    hideLegend = false,
    hideTitles = false,
    hideDescriptions = false,
    detailPopoverSize = 'medium',
  } = props;
  const messages = resolveI18nStrings('pie-chart', props.i18nStrings);

  const allSegments: PieSegment<T>[] = useMemo(
    () =>
      data.map((datum, index) => ({
        id: `segment-${index}`,
        datum,
        title: datum.title,
        value: datum.value,
        style: getSeriesStyle(index, datum.color),
      })),
    [data]
  );

  const [hiddenTitles, setHiddenTitles] = useState<ReadonlySet<string>>(() => new Set());
  const [ownHighlight, setOwnHighlight] = useState<string | null>(null);

  const visibleSegments = useMemo(
    () =>
      props.visibleSegments
        ? allSegments.filter(segment =>
            props.visibleSegments!.some(candidate => matchesSeries(segment.datum, candidate))
          )
        : allSegments.filter(segment => !hiddenTitles.has(segment.title)),
    [allSegments, props.visibleSegments, hiddenTitles]
  );
  const highlightedId =
    props.highlightedSegment !== undefined
      ? (allSegments.find(segment => matchesSeries(segment.datum, props.highlightedSegment))?.id ?? null)
      : (allSegments.find(segment => segment.title === ownHighlight)?.id ?? null);

  const highlight = (id: string | null) => {
    if (id === highlightedId) {
      return;
    }
    const segment = allSegments.find(candidate => candidate.id === id) ?? null;
    setOwnHighlight(segment?.title ?? null);
    fireNonCancelableEvent(props.onHighlightChange, { highlightedSegment: segment?.datum ?? null });
  };

  const changeFilter = (ids: string[]) => {
    const selected = new Set(ids);
    setHiddenTitles(new Set(allSegments.filter(segment => !selected.has(segment.id)).map(segment => segment.title)));
    fireNonCancelableEvent(props.onFilterChange, {
      visibleSegments: allSegments.filter(segment => selected.has(segment.id)).map(segment => segment.datum),
    });
  };

  const hasData = allSegments.some(segment => segment.value > 0);
  let status: ChartStatusKind | null = null;
  if (statusType === 'loading' || statusType === 'error') {
    status = statusType;
  } else if (!hasData) {
    status = 'empty';
  } else if (!visibleSegments.some(segment => segment.value > 0)) {
    status = 'no-match';
  }
  const showControls = status === null || status === 'no-match';
  const statusHeight = { small: 160, medium: 240, large: 320 }[size];

  return (
    <ChartFrame
      baseProps={getBaseProps(props)}
      className={styles.root}
      filter={
        !hideFilter &&
        showControls && (
          <SeriesFilter
            items={allSegments.map(segment => ({ id: segment.id, title: segment.title }))}
            selectedIds={visibleSegments.map(segment => segment.id)}
            onChange={changeFilter}
            label={messages.filterLabel}
            placeholder={messages.filterPlaceholder}
            selectedAriaLabel={messages.filterSelectedAriaLabel}
          />
        )
      }
      legend={
        !hideLegend &&
        status === null && (
          <Legend
            items={visibleSegments.map(segment => ({
              id: segment.id,
              title: segment.title,
              kind: 'fill',
              style: segment.style,
            }))}
            title={props.legendTitle}
            ariaLabel={messages.legendAriaLabel}
            highlightedId={highlightedId}
            onHighlight={highlight}
          />
        )
      }
    >
      {status !== null ? (
        <ChartStatus
          kind={status}
          height={statusHeight}
          loadingText={props.loadingText}
          errorText={props.errorText}
          recoveryText={props.recoveryText}
          onRecoveryClick={props.onRecoveryClick}
          empty={props.empty}
          noMatch={props.noMatch}
        />
      ) : (
        <PiePlot<T>
          segments={visibleSegments}
          variant={variant}
          size={size}
          innerMetricValue={props.innerMetricValue}
          innerMetricDescription={props.innerMetricDescription}
          segmentDescription={props.segmentDescription}
          hideTitles={hideTitles}
          hideDescriptions={hideDescriptions}
          highlightedId={highlightedId}
          onHighlight={highlight}
          detailPopoverContent={props.detailPopoverContent}
          detailPopoverFooter={props.detailPopoverFooter}
          detailPopoverSize={detailPopoverSize}
          ariaLabel={props.ariaLabel}
          ariaLabelledby={props.ariaLabelledby}
          ariaDescription={props.ariaDescription}
          messages={messages}
        />
      )}
    </ChartFrame>
  );
}
