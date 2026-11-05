// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ButtonProps } from '@ordinate/components/button';
import clsx from 'clsx';

import { DetailPopover, DetailPopoverProps } from '../components/detail-popover';
import { fillFor, Marker, PatternDefinition } from '../components/marks';
import { getLogicalArrowStep } from '../direction';
import { useContainerWidth, useIsRtl, useSvgId } from '../hooks';
import { ChartMessages } from '../i18n';
import { ChartValue, ScaleType } from '../utils/scales';
import { estimateTextWidth, truncateText } from '../utils/text';
import { getPositionDetails } from './details';
import { TickFormatter } from './interfaces';
import { CartesianModel, ChartSeries, computeCartesianModel, nearestPosition, Tick } from './model';

import styles from './styles.css.js';

export interface CartesianPlotProps<T extends ChartValue> {
  allSeries: ReadonlyArray<ChartSeries<T>>;
  visibleSeries: ReadonlyArray<ChartSeries<T>>;
  xScaleType: ScaleType;
  yScaleType: 'linear' | 'log';
  xDomain?: ReadonlyArray<T>;
  yDomain?: readonly [number, number];
  xTicks?: ReadonlyArray<T>;
  yTicks?: ReadonlyArray<number>;
  stackedBars: boolean;
  horizontal: boolean;
  /** Adds a total to the detail popover, for stacked series. */
  showTotal: boolean;
  emphasizeBaselineAxis: boolean;
  xTitle?: string;
  yTitle?: string;
  xTickFormatter?: TickFormatter<T>;
  yTickFormatter?: TickFormatter<number>;
  height: number;
  highlightedSeriesId: string | null;
  onHighlightSeries: (id: string | null) => void;
  detailPopoverSize: DetailPopoverProps['size'];
  detailPopoverFooter?: (xValue: T) => React.ReactNode;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescription?: string;
  messages: ChartMessages;
}

// Width to draw at before the container is measured, for example on the server.
const defaultWidth = 600;
const tickSize = 4;
const labelGap = 4;
const labelHeight = 14;
const titleHeight = 24;
const topPadding = 8;
// Line markers are thinned out so that they stay at least this far apart.
const markerSpacing = 28;

interface Layout {
  svgWidth: number;
  svgHeight: number;
  left: number;
  top: number;
  plotWidth: number;
  categoryLabelWidth: number;
}

function widestLabel(ticks: ReadonlyArray<Tick>): number {
  return Math.max(0, ...ticks.filter(tick => tick.showLabel).map(tick => estimateTextWidth(tick.label)));
}

function computeLayout<T extends ChartValue>(
  draft: CartesianModel<T>,
  svgWidth: number,
  height: number,
  rtl: boolean,
  startTitle: boolean,
  bottomTitle: boolean
): Layout {
  const lastLabel = (ticks: ReadonlyArray<Tick>) => {
    const shown = ticks.filter(tick => tick.showLabel);
    return shown.length ? estimateTextWidth(shown[shown.length - 1].label) : 0;
  };
  let start: number;
  let end: number;
  let categoryLabelWidth = 0;
  if (draft.horizontal) {
    categoryLabelWidth = Math.min(widestLabel(draft.categoryTicks), Math.round(svgWidth * 0.35));
    start = categoryLabelWidth + tickSize + labelGap * 2;
    end = Math.max(8, Math.ceil(lastLabel(draft.valueTicks) / 2));
  } else {
    start = widestLabel(draft.valueTicks) + tickSize + labelGap * 2;
    end = draft.categoryScale.type === 'categorical' ? 8 : Math.max(8, Math.ceil(lastLabel(draft.categoryTicks) / 2));
  }
  const top = topPadding + (startTitle ? titleHeight : 0);
  const bottom = tickSize + labelGap + labelHeight + (bottomTitle ? titleHeight : 0) + 2;
  return {
    svgWidth,
    svgHeight: top + height + bottom,
    left: rtl ? end : start,
    top,
    plotWidth: Math.max(1, svgWidth - start - end),
    categoryLabelWidth,
  };
}

/**
 * The plot of a cartesian chart: grid, marks, axes and the detail popover. It is one focus
 * stop; the arrow keys move between x positions and series, Enter pins the popover and
 * Escape dismisses it.
 */
export function CartesianPlot<T extends ChartValue>(props: CartesianPlotProps<T>) {
  const {
    allSeries,
    visibleSeries,
    horizontal,
    height,
    highlightedSeriesId,
    onHighlightSeries,
    messages,
    xTitle,
    yTitle,
  } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLSpanElement>(null);
  const dismissRef = useRef<ButtonProps.Ref>(null);
  const focusDismissOnPin = useRef(false);
  const highlightFromKeyboard = useRef(false);
  const measuredWidth = useContainerWidth(wrapperRef);
  const rtl = useIsRtl(wrapperRef);
  const idPrefix = useSvgId('ord-chart');
  const descriptionId = `${idPrefix}-description`;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pinned, setPinned] = useState(false);
  const [keyboardActive, setKeyboardActive] = useState(false);

  const startTitle = horizontal ? xTitle : yTitle;
  const bottomTitle = horizontal ? yTitle : xTitle;
  const svgWidth = measuredWidth ?? defaultWidth;

  const { model, layout } = useMemo(() => {
    const input = {
      allSeries,
      visibleSeries,
      xScaleType: props.xScaleType,
      yScaleType: props.yScaleType,
      xDomain: props.xDomain,
      yDomain: props.yDomain,
      xTicks: props.xTicks,
      yTicks: props.yTicks,
      stackedBars: props.stackedBars,
      horizontal,
      height,
      rtl,
      xTickFormatter: props.xTickFormatter,
      yTickFormatter: props.yTickFormatter,
    };
    // A first pass at an estimated width gives the labels, and the labels decide the margins.
    const draft = computeCartesianModel({ ...input, width: Math.max(1, svgWidth - 60) });
    const layout = computeLayout(draft, svgWidth, height, rtl, Boolean(startTitle), Boolean(bottomTitle));
    return { model: computeCartesianModel({ ...input, width: layout.plotWidth }), layout };
  }, [
    allSeries,
    visibleSeries,
    props.xScaleType,
    props.yScaleType,
    props.xDomain,
    props.yDomain,
    props.xTicks,
    props.yTicks,
    props.stackedBars,
    props.xTickFormatter,
    props.yTickFormatter,
    horizontal,
    height,
    rtl,
    svgWidth,
    startTitle,
    bottomTitle,
  ]);

  const positionCount = model.positions.length;
  const safeIndex = activeIndex !== null && activeIndex < positionCount ? activeIndex : null;
  const activePosition = safeIndex === null ? null : model.positions[safeIndex];
  const details = activePosition
    ? getPositionDetails({
        series: visibleSeries,
        position: activePosition,
        xTickFormatter: props.xTickFormatter,
        highlightedId: highlightedSeriesId,
        totalLabel: messages.detailTotalLabel,
        showTotal: props.showTotal,
      })
    : null;

  const clearActive = () => {
    setActiveIndex(null);
    setPinned(false);
    setKeyboardActive(false);
    if (highlightFromKeyboard.current) {
      highlightFromKeyboard.current = false;
      onHighlightSeries(null);
    }
  };

  useEffect(() => {
    if (pinned && focusDismissOnPin.current) {
      focusDismissOnPin.current = false;
      dismissRef.current?.focus();
    }
  }, [pinned]);

  useEffect(() => {
    if (!pinned) {
      return;
    }
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setPinned(false);
        setActiveIndex(null);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [pinned]);

  const coordinateOf = (event: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) {
      return 0;
    }
    return horizontal ? event.clientY - rect.top - layout.top : event.clientX - rect.left - layout.left;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (pinned) {
      return;
    }
    setKeyboardActive(false);
    setActiveIndex(nearestPosition(model.positions, coordinateOf(event)));
  };

  const handleMouseLeave = () => {
    if (!pinned && !keyboardActive) {
      setActiveIndex(null);
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    if (pinned) {
      setPinned(false);
      return;
    }
    setActiveIndex(nearestPosition(model.positions, coordinateOf(event)));
    setPinned(true);
  };

  const dismiss = () => {
    setPinned(false);
    plotRef.current?.focus();
  };

  const cycleSeries = (direction: 1 | -1) => {
    const rows = details?.rows.filter(row => row.kind !== 'threshold') ?? [];
    if (rows.length === 0) {
      return;
    }
    const current = rows.findIndex(row => row.seriesId === highlightedSeriesId);
    const next =
      current === -1 ? (direction === 1 ? 0 : rows.length - 1) : (current + direction + rows.length) % rows.length;
    highlightFromKeyboard.current = true;
    onHighlightSeries(rows[next].seriesId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (positionCount === 0) {
      return;
    }
    const vertical = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    const logical = getLogicalArrowStep(event.key, event.currentTarget);
    const along = horizontal ? vertical : logical;
    const across = horizontal ? logical : vertical;
    const current = safeIndex ?? -1;
    let next: number | null = null;
    if (along !== 0) {
      next = current === -1 ? 0 : Math.min(positionCount - 1, Math.max(0, current + along));
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = positionCount - 1;
    } else if (across !== 0) {
      event.preventDefault();
      if (safeIndex === null) {
        setActiveIndex(0);
      }
      setKeyboardActive(true);
      cycleSeries(across);
      return;
    } else if ((event.key === 'Enter' || event.key === ' ') && safeIndex !== null) {
      event.preventDefault();
      focusDismissOnPin.current = true;
      setPinned(true);
      return;
    } else if (event.key === 'Escape') {
      if (highlightedSeriesId !== null && highlightFromKeyboard.current) {
        highlightFromKeyboard.current = false;
        onHighlightSeries(null);
      } else {
        clearActive();
      }
      return;
    }
    if (next !== null) {
      event.preventDefault();
      setKeyboardActive(true);
      setPinned(false);
      setActiveIndex(next);
    }
  };

  const handleFocus = () => {
    if (safeIndex === null && positionCount > 0) {
      setKeyboardActive(true);
      setActiveIndex(0);
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && panelRef.current?.contains(next)) {
      return;
    }
    if (!pinned) {
      clearActive();
    }
  };

  const handlePanelBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && (panelRef.current?.contains(next) || plotRef.current?.contains(next))) {
      return;
    }
    clearActive();
  };

  const handlePanelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      dismiss();
    }
  };

  const { plotWidth } = layout;
  const plotHeight = height;
  const valueAxisAt = horizontal ? plotHeight : rtl ? plotWidth : 0;
  const categoryAxisAt = horizontal ? (rtl ? plotWidth : 0) : plotHeight;
  // The side of the plot the start axis labels sit on, as a sign along x.
  const outward = rtl ? 1 : -1;
  const patternId = (series: ChartSeries<T>) => `${idPrefix}-${series.id}`;
  const dimmed = (series: ChartSeries<T>) => highlightedSeriesId !== null && highlightedSeriesId !== series.id;
  const fillSeries = [...model.areas.map(mark => mark.series), ...model.bars.map(mark => mark.series)];

  const lineAcross = (position: number, className: string, dash?: string, key?: string) =>
    horizontal ? (
      <line key={key} x1={position} x2={position} y1={0} y2={plotHeight} className={className} strokeDasharray={dash} />
    ) : (
      <line key={key} x1={0} x2={plotWidth} y1={position} y2={position} className={className} strokeDasharray={dash} />
    );
  const lineAlong = (position: number, className: string, dash?: string, key?: string) =>
    horizontal ? (
      <line key={key} x1={0} x2={plotWidth} y1={position} y2={position} className={className} strokeDasharray={dash} />
    ) : (
      <line key={key} x1={position} x2={position} y1={0} y2={plotHeight} className={className} strokeDasharray={dash} />
    );

  const categorySpacing =
    positionCount > 1 ? (horizontal ? plotHeight : plotWidth) / (positionCount - 1) : markerSpacing;
  const markerEvery = Math.max(1, Math.ceil(markerSpacing / categorySpacing));
  const bandSize = model.bandSize;

  const valueAxis = (
    <g
      role="group"
      aria-roledescription={messages.yAxisAriaRoleDescription}
      aria-label={yTitle}
      className={styles['y-axis']}
    >
      {horizontal ? (
        <line x1={0} x2={plotWidth} y1={valueAxisAt} y2={valueAxisAt} className={styles['axis-line']} />
      ) : (
        <line x1={valueAxisAt} x2={valueAxisAt} y1={0} y2={plotHeight} className={styles['axis-line']} />
      )}
      {model.valueTicks.map(tick =>
        horizontal ? (
          <g key={tick.key}>
            <line
              x1={tick.position}
              x2={tick.position}
              y1={plotHeight}
              y2={plotHeight + tickSize}
              className={styles.tick}
            />
            <text
              x={tick.position}
              y={plotHeight + tickSize + labelGap}
              dy="0.71em"
              textAnchor="middle"
              className={styles['tick-label']}
            >
              {tick.label}
            </text>
          </g>
        ) : (
          <g key={tick.key}>
            <line
              x1={valueAxisAt}
              x2={valueAxisAt + outward * tickSize}
              y1={tick.position}
              y2={tick.position}
              className={styles.tick}
            />
            <text
              x={valueAxisAt + outward * (tickSize + labelGap)}
              y={tick.position}
              dy="0.32em"
              textAnchor="end"
              className={styles['tick-label']}
            >
              {tick.label}
            </text>
          </g>
        )
      )}
    </g>
  );

  const categoryAxis = (
    <g
      role="group"
      aria-roledescription={messages.xAxisAriaRoleDescription}
      aria-label={xTitle}
      className={styles['x-axis']}
    >
      {horizontal ? (
        <line x1={categoryAxisAt} x2={categoryAxisAt} y1={0} y2={plotHeight} className={styles['axis-line']} />
      ) : (
        <line x1={0} x2={plotWidth} y1={categoryAxisAt} y2={categoryAxisAt} className={styles['axis-line']} />
      )}
      {model.categoryTicks.map(tick =>
        horizontal ? (
          <g key={tick.key}>
            <line
              x1={categoryAxisAt}
              x2={categoryAxisAt + outward * tickSize}
              y1={tick.position}
              y2={tick.position}
              className={styles.tick}
            />
            {tick.showLabel && (
              <text
                x={categoryAxisAt + outward * (tickSize + labelGap)}
                y={tick.position}
                dy="0.32em"
                textAnchor="end"
                className={styles['tick-label']}
              >
                {truncateText(tick.label, layout.categoryLabelWidth)}
                {truncateText(tick.label, layout.categoryLabelWidth) !== tick.label && <title>{tick.label}</title>}
              </text>
            )}
          </g>
        ) : (
          <g key={tick.key}>
            <line
              x1={tick.position}
              x2={tick.position}
              y1={plotHeight}
              y2={plotHeight + tickSize}
              className={styles.tick}
            />
            {tick.showLabel && (
              <text
                x={tick.position}
                y={plotHeight + tickSize + labelGap}
                dy="0.71em"
                textAnchor="middle"
                className={styles['tick-label']}
              >
                {tick.label}
              </text>
            )}
          </g>
        )
      )}
    </g>
  );

  const anchorStyle: React.CSSProperties | undefined = activePosition
    ? horizontal
      ? {
          left: layout.left,
          top: layout.top + activePosition.position - bandSize / 2,
          width: plotWidth,
          height: Math.max(1, bandSize),
        }
      : {
          left: layout.left + activePosition.position - bandSize / 2,
          top: layout.top,
          width: Math.max(1, bandSize),
          height: plotHeight,
        }
    : undefined;

  return (
    <div ref={wrapperRef} className={styles.plot}>
      <div
        ref={plotRef}
        role="application"
        tabIndex={0}
        aria-roledescription={messages.chartAriaRoleDescription}
        aria-label={props.ariaLabel}
        aria-labelledby={props.ariaLabelledby}
        aria-describedby={props.ariaDescription ? descriptionId : undefined}
        className={styles['plot-focus']}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <svg ref={svgRef} width={layout.svgWidth} height={layout.svgHeight} className={styles.svg} focusable="false">
          <defs>
            {fillSeries.map(series => (
              <PatternDefinition
                key={series.id}
                id={patternId(series)}
                pattern={series.style.pattern}
                color={series.style.color}
              />
            ))}
          </defs>
          {startTitle && (
            <text
              x={rtl ? layout.svgWidth : 0}
              y={topPadding}
              dy="0.71em"
              textAnchor="start"
              className={styles['axis-title']}
            >
              {startTitle}
            </text>
          )}
          {bottomTitle && (
            <text
              x={layout.left + plotWidth / 2}
              y={layout.svgHeight - 4}
              textAnchor="middle"
              className={styles['axis-title']}
            >
              {bottomTitle}
            </text>
          )}
          <g transform={`translate(${layout.left},${layout.top})`}>
            <g aria-hidden="true">
              {model.valueTicks
                .filter(tick => Math.abs(tick.position - valueAxisAt) > 0.5)
                .map(tick => lineAcross(tick.position, styles['grid-rule'], undefined, tick.key))}
              {model.categoryScale.type !== 'categorical' &&
                model.categoryTicks
                  .filter(tick => Math.abs(tick.position - categoryAxisAt) > 0.5)
                  .map(tick => lineAlong(tick.position, styles['grid-rule'], undefined, tick.key))}
              {activePosition &&
                (bandSize > 0 ? (
                  horizontal ? (
                    <rect
                      x={0}
                      y={activePosition.position - bandSize / 2}
                      width={plotWidth}
                      height={bandSize}
                      className={styles['highlight-band']}
                    />
                  ) : (
                    <rect
                      x={activePosition.position - bandSize / 2}
                      y={0}
                      width={bandSize}
                      height={plotHeight}
                      className={styles['highlight-band']}
                    />
                  )
                ) : (
                  lineAlong(activePosition.position, styles.crosshair)
                ))}
              {model.areas.map(mark => (
                <g
                  key={mark.series.id}
                  className={clsx(styles.series, dimmed(mark.series) && styles.dimmed)}
                  style={{ color: mark.series.style.color }}
                >
                  <path
                    d={mark.path}
                    fill={fillFor(mark.series.style, patternId(mark.series))}
                    className={styles['area-fill']}
                  />
                  <path d={mark.topPath} className={styles['area-line']} />
                </g>
              ))}
              {model.bars.map(mark => (
                <g
                  key={mark.series.id}
                  className={clsx(styles.series, dimmed(mark.series) && styles.dimmed)}
                  style={{ color: mark.series.style.color }}
                >
                  {mark.rects.map(rect => (
                    <rect
                      key={rect.positionIndex}
                      x={rect.x}
                      y={rect.y}
                      width={rect.width}
                      height={rect.height}
                      fill={fillFor(mark.series.style, patternId(mark.series))}
                      className={styles.bar}
                    />
                  ))}
                </g>
              ))}
              {model.baseline !== null &&
                props.emphasizeBaselineAxis &&
                Math.abs(model.baseline - valueAxisAt) > 0.5 &&
                lineAcross(model.baseline, styles.baseline)}
              {model.thresholds.map(mark => (
                <g
                  key={mark.series.id}
                  className={clsx(styles.series, dimmed(mark.series) && styles.dimmed)}
                  style={{ color: mark.series.style.color }}
                >
                  {mark.axis === 'value'
                    ? lineAcross(mark.position, styles.threshold, mark.series.style.dash)
                    : lineAlong(mark.position, styles.threshold, mark.series.style.dash)}
                </g>
              ))}
              {model.lines.map(mark => (
                <g
                  key={mark.series.id}
                  className={clsx(styles.series, dimmed(mark.series) && styles.dimmed)}
                  style={{ color: mark.series.style.color }}
                >
                  <path d={mark.path} className={styles['line-halo']} />
                  <path d={mark.path} strokeDasharray={mark.series.style.dash} className={styles.line} />
                  {mark.points
                    .filter(point => point.positionIndex % markerEvery === 0)
                    .map(point => (
                      <Marker
                        key={point.positionIndex}
                        shape={mark.series.style.marker}
                        x={point.x}
                        y={point.y}
                        color={mark.series.style.color}
                      />
                    ))}
                </g>
              ))}
            </g>
            {valueAxis}
            {categoryAxis}
            {safeIndex !== null && (
              <g aria-hidden="true">
                {[...model.areas, ...model.lines].map(mark => {
                  const point = mark.points.find(candidate => candidate.positionIndex === safeIndex);
                  return point && !dimmed(mark.series) ? (
                    <Marker
                      key={mark.series.id}
                      shape={mark.series.style.marker}
                      x={point.x}
                      y={point.y}
                      color={mark.series.style.color}
                      emphasized={true}
                    />
                  ) : null;
                })}
              </g>
            )}
            <rect
              x={0}
              y={0}
              width={plotWidth}
              height={plotHeight}
              className={styles.overlay}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            />
          </g>
        </svg>
      </div>
      {props.ariaDescription && (
        <div id={descriptionId} className={styles['screenreader-only']}>
          {props.ariaDescription}
        </div>
      )}
      <div aria-live="polite" aria-atomic="true" className={styles['screenreader-only']}>
        {keyboardActive && details ? details.announcement : ''}
      </div>
      <span ref={anchorRef} className={styles.anchor} style={anchorStyle} hidden={!activePosition} />
      {activePosition && details && (
        <DetailPopover
          trigger={anchorRef}
          triggerKey={`${safeIndex}-${layout.svgWidth}`}
          panelRef={panelRef}
          dismissButtonRef={dismissRef}
          header={details.header}
          rows={details.rows}
          summary={details.summary}
          footer={props.detailPopoverFooter?.(activePosition.value)}
          size={props.detailPopoverSize}
          pinned={pinned}
          dismissAriaLabel={messages.detailPopoverDismissAriaLabel}
          onDismiss={dismiss}
          onKeyDown={handlePanelKeyDown}
          onBlur={pinned ? handlePanelBlur : undefined}
          className={styles.popover}
        />
      )}
    </div>
  );
}
