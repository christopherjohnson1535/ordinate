// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ButtonProps } from '@ordinate/components/button';
import clsx from 'clsx';

import { DetailPopover, DetailRow } from '../components/detail-popover';
import { fillFor, PatternDefinition, Swatch } from '../components/marks';
import { getLogicalArrowStep } from '../direction';
import { useContainerWidth, useIsRtl, useSvgId } from '../hooks';
import { ChartMessages } from '../i18n';
import { SeriesStyle } from '../series-style';
import { formatNumber, formatPercentage } from '../utils/format';
import { polarToCartesian } from '../utils/paths';
import { estimateTextWidth, truncateText } from '../utils/text';
import { computeSlices, PieGeometry, placeLabels, sliceCentroid, slicePath } from './layout';

import styles from './styles.css.js';

export interface PieSegment<T> {
  id: string;
  datum: T;
  title: string;
  value: number;
  style: SeriesStyle;
}

export interface PiePlotProps<T> {
  segments: ReadonlyArray<PieSegment<T>>;
  variant: 'pie' | 'donut';
  size: 'small' | 'medium' | 'large';
  innerMetricValue?: string;
  innerMetricDescription?: string;
  segmentDescription?: (datum: T, sum: number) => string;
  hideTitles: boolean;
  hideDescriptions: boolean;
  highlightedId: string | null;
  onHighlight: (id: string | null) => void;
  detailPopoverContent?: (datum: T, sum: number) => ReadonlyArray<{ key: string; value: string }>;
  detailPopoverFooter?: (datum: T) => React.ReactNode;
  detailPopoverSize: 'small' | 'medium' | 'large';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescription?: string;
  messages: ChartMessages;
}

const radii = { small: 56, medium: 96, large: 136 };
const defaultWidth = 600;
const minRadius = 40;
const labelColumn = 22;
const labelLine = 16;
// Room beside the pie for a label; longer titles are cut short with an ellipsis.
const labelSpace = 150;
const padding = 12;

/**
 * The drawing of a pie chart: patterned segments with leader-line labels, the inner metric of a
 * donut, and the detail popover. It is one focus stop; the arrow keys move between segments.
 */
export function PiePlot<T>(props: PiePlotProps<T>) {
  const { segments, variant, hideTitles, hideDescriptions, highlightedId, onHighlight, messages } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLSpanElement>(null);
  const dismissRef = useRef<ButtonProps.Ref>(null);
  const focusDismissOnPin = useRef(false);
  const measuredWidth = useContainerWidth(wrapperRef);
  const rtl = useIsRtl(wrapperRef);
  const idPrefix = useSvgId('ord-pie');
  const descriptionId = `${idPrefix}-description`;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pinned, setPinned] = useState(false);
  const [keyboardActive, setKeyboardActive] = useState(false);

  const width = measuredWidth ?? defaultWidth;
  const sum = segments.reduce((total, segment) => total + Math.max(0, segment.value), 0);
  const descriptions = segments.map(segment =>
    props.segmentDescription && !hideDescriptions ? props.segmentDescription(segment.datum, sum) : ''
  );

  const layout = useMemo(() => {
    const slices = computeSlices(
      segments.map(segment => segment.value),
      rtl
    );
    let showLabels = !hideTitles;
    let outerRadius = Math.min(radii[props.size], (width - (showLabels ? 2 * labelSpace : 2 * padding)) / 2);
    if (showLabels && outerRadius < minRadius) {
      showLabels = false;
      outerRadius = Math.min(radii[props.size], (width - 2 * padding) / 2);
    }
    outerRadius = Math.max(minRadius / 2, outerRadius);
    const innerRadius = variant === 'donut' ? Math.round(outerRadius * 0.62) : 0;
    const labelHeights = segments.map((_, index) => (descriptions[index] ? labelLine * 2 : labelLine));
    const visible = slices.map(slice => slice.fraction > 0);
    const perSide = (side: 'left' | 'right') =>
      slices.reduce(
        (total, slice, index) =>
          visible[index] && Math.sin(slice.midAngle) >= 0 === (side === 'right')
            ? total + labelHeights[index] + 4
            : total,
        0
      );
    const height = Math.ceil(
      Math.max(
        2 * outerRadius + 2 * (showLabels ? padding * 2 : padding),
        showLabels ? Math.max(perSide('left'), perSide('right')) : 0
      )
    );
    const geometry: PieGeometry = { cx: width / 2, cy: height / 2, outerRadius, innerRadius };
    const labels = showLabels
      ? placeLabels(
          slices.map((slice, index) => ({ midAngle: slice.midAngle, height: labelHeights[index] })),
          geometry,
          height,
          { column: labelColumn }
        )
      : [];
    const labelWidth = Math.max(40, (width - 2 * outerRadius) / 2 - labelColumn - 8);
    return { slices, geometry, height, labels, showLabels, labelWidth, visible };
    // `descriptions` is derived from the props listed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments, rtl, hideTitles, hideDescriptions, props.segmentDescription, props.size, variant, width]);

  const { slices, geometry, height, labels, showLabels, labelWidth, visible } = layout;
  const navigable = segments.map((_, index) => index).filter(index => visible[index]);
  const safeIndex = activeIndex !== null && visible[activeIndex] ? activeIndex : null;
  const active = safeIndex === null ? null : segments[safeIndex];

  const activate = (index: number | null, fromKeyboard: boolean) => {
    setActiveIndex(index);
    setKeyboardActive(fromKeyboard);
    onHighlight(index === null ? null : segments[index].id);
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

  const clear = () => {
    setPinned(false);
    if (safeIndex !== null) {
      activate(null, false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (navigable.length === 0) {
      return;
    }
    const step =
      getLogicalArrowStep(event.key, event.currentTarget) ||
      (event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0);
    const current = safeIndex === null ? -1 : navigable.indexOf(safeIndex);
    let next: number | null = null;
    if (step !== 0) {
      next = current === -1 ? 0 : (current + step + navigable.length) % navigable.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = navigable.length - 1;
    } else if ((event.key === 'Enter' || event.key === ' ') && safeIndex !== null) {
      event.preventDefault();
      focusDismissOnPin.current = true;
      setPinned(true);
      return;
    } else if (event.key === 'Escape') {
      clear();
      return;
    }
    if (next !== null) {
      event.preventDefault();
      setPinned(false);
      activate(navigable[next], true);
    }
  };

  const handleFocus = () => {
    if (safeIndex === null && navigable.length > 0) {
      activate(navigable[0], true);
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && panelRef.current?.contains(next)) {
      return;
    }
    if (!pinned) {
      clear();
    }
  };

  const handlePanelBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && (panelRef.current?.contains(next) || plotRef.current?.contains(next))) {
      return;
    }
    clear();
  };

  const dismiss = () => {
    setPinned(false);
    plotRef.current?.focus();
  };

  const rowsFor = (segment: PieSegment<T>, index: number): DetailRow[] => {
    if (props.detailPopoverContent) {
      return props.detailPopoverContent(segment.datum, sum).map((item, row) => ({
        id: `${row}`,
        title: item.key,
        value: item.value,
      }));
    }
    return [
      { id: 'value', title: messages.detailsValue, value: formatNumber(segment.value) },
      { id: 'percentage', title: messages.detailsPercentage, value: formatPercentage(slices[index].fraction) },
    ];
  };

  const announcement =
    active && safeIndex !== null
      ? `${active.title}: ${rowsFor(active, safeIndex)
          .map(row => `${row.title} ${row.value}`)
          .join(', ')}`
      : '';

  const anchorPoint = safeIndex === null ? null : sliceCentroid(slices[safeIndex], geometry);
  const dimmed = (segment: PieSegment<T>) => highlightedId !== null && highlightedId !== segment.id;
  const boundaries = slices.filter((slice, index) => visible[index] && slice.fraction < 1);

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
        onMouseLeave={() => !pinned && !keyboardActive && clear()}
      >
        <svg width={width} height={height} className={styles.svg} focusable="false">
          <defs>
            {segments.map(segment => (
              <PatternDefinition
                key={segment.id}
                id={`${idPrefix}-${segment.id}`}
                pattern={segment.style.pattern}
                color={segment.style.color}
              />
            ))}
          </defs>
          <g>
            {segments.map((segment, index) =>
              visible[index] ? (
                <path
                  key={segment.id}
                  d={slicePath(slices[index], geometry)}
                  role="img"
                  aria-roledescription={messages.segmentAriaRoleDescription}
                  aria-label={`${segment.title} ${formatNumber(segment.value)}`}
                  fill={fillFor(segment.style, `${idPrefix}-${segment.id}`)}
                  style={{ color: segment.style.color }}
                  className={clsx(styles.segment, dimmed(segment) && styles.dimmed)}
                  onMouseEnter={() => !pinned && activate(index, false)}
                  onClick={() => {
                    activate(index, false);
                    setPinned(current => !(current && safeIndex === index));
                  }}
                />
              ) : null
            )}
          </g>
          <g aria-hidden="true">
            {boundaries.map((slice, index) => {
              const [x0, y0] = polarToCartesian(geometry.cx, geometry.cy, geometry.innerRadius, slice.startAngle);
              const [x1, y1] = polarToCartesian(geometry.cx, geometry.cy, geometry.outerRadius + 1, slice.startAngle);
              return <line key={index} x1={x0} y1={y0} x2={x1} y2={y1} className={styles.separator} />;
            })}
            {safeIndex !== null && (
              <path d={slicePath(slices[safeIndex], geometry)} className={styles['segment-active']} />
            )}
            {showLabels &&
              segments.map((segment, index) => {
                if (!visible[index]) {
                  return null;
                }
                const label = labels[index];
                const towardLabel = label.side === 'right' ? 1 : -1;
                const textEnd = label.x - towardLabel * 4;
                const title = truncateText(segment.title, labelWidth, 13);
                // Text runs away from the pie on both sides; in right-to-left text the logical
                // start is on the right, so the anchor flips with the direction.
                const anchor = (label.side === 'right') !== rtl ? 'start' : 'end';
                return (
                  <g key={segment.id} className={clsx(styles.label, dimmed(segment) && styles.dimmed)}>
                    <polyline
                      points={`${label.start.join(',')} ${label.elbow.join(',')} ${textEnd},${label.y}`}
                      className={styles.leader}
                    />
                    <text
                      x={label.x}
                      y={descriptions[index] ? label.y - labelLine / 2 : label.y}
                      dy="0.32em"
                      textAnchor={anchor}
                      className={styles['label-title']}
                    >
                      {title}
                      {title !== segment.title && <title>{segment.title}</title>}
                    </text>
                    {descriptions[index] && (
                      <text
                        x={label.x}
                        y={label.y + labelLine / 2}
                        dy="0.32em"
                        textAnchor={anchor}
                        className={styles['label-description']}
                      >
                        {truncateText(descriptions[index], labelWidth)}
                      </text>
                    )}
                  </g>
                );
              })}
            {variant === 'donut' && (props.innerMetricValue || props.innerMetricDescription) && (
              <g>
                {props.innerMetricValue && (
                  <text
                    x={geometry.cx}
                    y={geometry.cy - (props.innerMetricDescription ? 6 : 0)}
                    dy={props.innerMetricDescription ? undefined : '0.32em'}
                    textAnchor="middle"
                    className={clsx(
                      styles['inner-value'],
                      estimateTextWidth(props.innerMetricValue, 24) > geometry.innerRadius * 1.6 &&
                        styles['inner-value-small']
                    )}
                  >
                    {props.innerMetricValue}
                  </text>
                )}
                {props.innerMetricDescription && (
                  <text
                    x={geometry.cx}
                    y={geometry.cy + (props.innerMetricValue ? 14 : 0)}
                    dy={props.innerMetricValue ? undefined : '0.32em'}
                    textAnchor="middle"
                    className={styles['inner-description']}
                  >
                    {truncateText(props.innerMetricDescription, geometry.innerRadius * 1.7)}
                  </text>
                )}
              </g>
            )}
          </g>
        </svg>
      </div>
      {variant === 'donut' && (props.innerMetricValue || props.innerMetricDescription) && (
        <div className={styles['screenreader-only']}>
          {[props.innerMetricValue, props.innerMetricDescription].filter(Boolean).join(' ')}
        </div>
      )}
      {props.ariaDescription && (
        <div id={descriptionId} className={styles['screenreader-only']}>
          {props.ariaDescription}
        </div>
      )}
      <div aria-live="polite" aria-atomic="true" className={styles['screenreader-only']}>
        {keyboardActive ? announcement : ''}
      </div>
      <span
        ref={anchorRef}
        className={styles.anchor}
        hidden={!anchorPoint}
        style={anchorPoint ? { left: anchorPoint[0] - 1, top: anchorPoint[1] - 1 } : undefined}
      />
      {active && safeIndex !== null && (
        <DetailPopover
          trigger={anchorRef}
          triggerKey={`${safeIndex}-${width}`}
          panelRef={panelRef}
          dismissButtonRef={dismissRef}
          header={
            <span className={styles['popover-header']}>
              <Swatch kind="fill" seriesStyle={active.style} />
              {active.title}
            </span>
          }
          rows={rowsFor(active, safeIndex)}
          footer={props.detailPopoverFooter?.(active.datum)}
          size={props.detailPopoverSize}
          pinned={pinned}
          dismissAriaLabel={messages.detailPopoverDismissAriaLabel}
          onDismiss={dismiss}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              dismiss();
            }
          }}
          onBlur={pinned ? handlePanelBlur : undefined}
        />
      )}
    </div>
  );
}
