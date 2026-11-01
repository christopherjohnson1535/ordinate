// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { fireCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { isPlainLeftClick } from '../internal/link-click';
import { RouteMapProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalRouteMapProps extends RouteMapProps {
  /**
   * Lets other components position the route map. Not part of the public API.
   */
  className?: string;
}

// The map is drawn in its own units and scales to the width of its container.
const TITLE_X = 16;
const FIRST_STOP_X = 250;
const STOP_PITCH = 64;
const FIRST_LINE_Y = 50;
const LINE_PITCH = 75;
const STOP_RADIUS = 7;
const STATION_SIZE = 16;
const TERMINUS_SIZE = 44;
const TERMINUS_TEXT = 172;

export function InternalRouteMap({
  lines,
  terminus,
  selectedLineId,
  currentStopId,
  currentStopLabel,
  ariaLabel,
  onFollow,
  className,
  ...rest
}: InternalRouteMapProps) {
  const i18n = useInternalI18n('route-map');
  const mostStops = Math.max(1, ...lines.map(line => line.stops.length));
  const lastStopX = FIRST_STOP_X + (mostStops - 1) * STOP_PITCH;
  const busX = Math.max(900, lastStopX + 2 * STOP_PITCH);
  const terminusX = busX + 148;
  const width = terminus ? terminusX + TERMINUS_SIZE + TERMINUS_TEXT : lastStopX + STOP_PITCH;
  const ys = lines.map((_, index) => FIRST_LINE_Y + index * LINE_PITCH);
  const middleY = lines.length ? (ys[0] + ys[ys.length - 1]) / 2 : FIRST_LINE_Y;
  const height = (ys[ys.length - 1] ?? FIRST_LINE_Y) + FIRST_LINE_Y + 4;

  const routeOf = (line: RouteMapProps.Line, y: number) => {
    if (!terminus) {
      return `M${FIRST_STOP_X} ${y}H${FIRST_STOP_X + Math.max(0, line.stops.length - 1) * STOP_PITCH}`;
    }
    return y === middleY
      ? `M${FIRST_STOP_X} ${y}H${terminusX}`
      : `M${FIRST_STOP_X} ${y}H${busX}V${middleY}H${terminusX}`;
  };

  const follow = (lineId: string | null, href: string) => (event: React.MouseEvent) => {
    if (isPlainLeftClick(event)) {
      fireCancelableEvent(onFollow, { lineId, href }, event);
    }
  };

  const currentLine = lines.findIndex(line => line.stops.some(stop => stop.id === currentStopId));
  const current =
    currentLine >= 0
      ? {
          x: FIRST_STOP_X + lines[currentLine].stops.findIndex(stop => stop.id === currentStopId) * STOP_PITCH,
          y: ys[currentLine],
        }
      : null;

  return (
    <div {...rest} className={clsx(styles.root, className)} role="group" aria-label={ariaLabel}>
      <svg className={styles.map} viewBox={`0 0 ${width} ${height}`} direction="ltr">
        {lines.map((line, index) => (
          <path
            key={line.id}
            className={clsx(styles.band, line.id === selectedLineId && styles['band-selected'])}
            d={routeOf(line, ys[index])}
            aria-hidden="true"
          />
        ))}
        {lines.map((line, index) => {
          const y = ys[index];
          const content = (
            <>
              <text className={styles.title} x={TITLE_X} y={y - 1}>
                {line.title}
              </text>
              {line.description && (
                <text className={styles.description} x={TITLE_X} y={y + 19}>
                  {line.description}
                </text>
              )}
              <path className={styles.line} d={routeOf(line, y)} aria-hidden="true" />
              {line.stops.map((stop, k) => {
                const x = FIRST_STOP_X + k * STOP_PITCH;
                const className = clsx(styles.stop, styles[`stop-${stop.status}`]);
                return stop.type === 'station' ? (
                  <rect
                    key={stop.id}
                    className={clsx(className, styles.station)}
                    data-stop-id={stop.id}
                    x={x - STATION_SIZE / 2}
                    y={y - STATION_SIZE / 2}
                    width={STATION_SIZE}
                    height={STATION_SIZE}
                    aria-hidden="true"
                  />
                ) : (
                  <circle
                    key={stop.id}
                    className={className}
                    data-stop-id={stop.id}
                    cx={x}
                    cy={y}
                    r={STOP_RADIUS}
                    aria-hidden="true"
                  />
                );
              })}
            </>
          );
          return line.href ? (
            <a
              key={line.id}
              className={clsx(styles.row, styles.link)}
              href={line.href}
              data-line-id={line.id}
              onClick={follow(line.id, line.href)}
            >
              {content}
            </a>
          ) : (
            <g key={line.id} className={styles.row} data-line-id={line.id}>
              {content}
            </g>
          );
        })}
        {terminus && lines.length > 1 && (
          <circle className={styles.junction} cx={busX} cy={middleY} r={5} aria-hidden="true" />
        )}
        {terminus && <Terminus terminus={terminus} x={terminusX} y={middleY} onClick={follow} />}
        {current && (
          <g className={styles.current} transform={`translate(${current.x} ${current.y})`}>
            <circle className={styles['current-ring']} r={14} aria-hidden="true" />
            <text className={styles['current-label']} textAnchor="middle" y={-26}>
              {i18n('currentStopLabel', currentStopLabel)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

interface TerminusProps {
  terminus: RouteMapProps.Terminus;
  x: number;
  y: number;
  onClick: (lineId: null, href: string) => (event: React.MouseEvent) => void;
}

function Terminus({ terminus, x, y, onClick }: TerminusProps) {
  const content = (
    <>
      <rect
        className={styles['terminus-mark']}
        x={x}
        y={y - TERMINUS_SIZE / 2}
        width={TERMINUS_SIZE}
        height={TERMINUS_SIZE}
        aria-hidden="true"
      />
      <rect
        className={styles['terminus-inner']}
        x={x + 9}
        y={y - TERMINUS_SIZE / 2 + 9}
        width={TERMINUS_SIZE - 18}
        height={TERMINUS_SIZE - 18}
        aria-hidden="true"
      />
      <text className={styles.title} x={x + TERMINUS_SIZE + 14} y={y - 4}>
        {terminus.title}
      </text>
      {terminus.description && (
        <text className={styles.description} x={x + TERMINUS_SIZE + 14} y={y + 16}>
          {terminus.description}
        </text>
      )}
    </>
  );
  return terminus.href ? (
    <a className={clsx(styles.terminus, styles.link)} href={terminus.href} onClick={onClick(null, terminus.href)}>
      {content}
    </a>
  ) : (
    <g className={styles.terminus}>{content}</g>
  );
}
