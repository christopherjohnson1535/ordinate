// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { fireCancelableEvent } from '../internal/events';
import { useBrowserLayoutEffect } from '../internal/hooks/use-browser-layout-effect';
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
const TERMINUS_GAP = 14;
const TERMINUS_TEXT_WIDTH = TERMINUS_TEXT - TERMINUS_GAP;
const TERMINUS_TITLE_PITCH = 20;
const TERMINUS_DESCRIPTION_PITCH = 16;
const TEXT_DESCENT = 5;
// Text cannot be measured on the server, so the terminus text is wrapped and the map sized from a
// generous width per character of the title and description fonts. The browser then measures the
// drawn text and grows the map if a font runs wider.
const TITLE_CHAR_WIDTH = 9.5;
const DESCRIPTION_CHAR_WIDTH = 7.2;

interface TerminusLayout {
  titleLines: string[];
  descriptionLines: string[];
  /** Estimated width of the widest line, in drawing units. */
  textWidth: number;
  /** Offset of the last baseline below the middle of the terminus mark. */
  lastBaseline: number;
}

function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const last = lines.length - 1;
    if (last >= 0 && lines[last].length + 1 + word.length <= maxChars) {
      lines[last] += ` ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines;
}

function layOutTerminus({ title, description }: RouteMapProps.Terminus): TerminusLayout {
  const titleLines = wrap(title, Math.floor(TERMINUS_TEXT_WIDTH / TITLE_CHAR_WIDTH));
  const descriptionLines = description
    ? wrap(description, Math.floor(TERMINUS_TEXT_WIDTH / DESCRIPTION_CHAR_WIDTH))
    : [];
  const textWidth = Math.max(
    ...titleLines.map(line => line.length * TITLE_CHAR_WIDTH),
    ...descriptionLines.map(line => line.length * DESCRIPTION_CHAR_WIDTH)
  );
  const lastTitleBaseline = -4 + (titleLines.length - 1) * TERMINUS_TITLE_PITCH;
  const lastBaseline = descriptionLines.length
    ? lastTitleBaseline + TERMINUS_TITLE_PITCH + (descriptionLines.length - 1) * TERMINUS_DESCRIPTION_PITCH
    : lastTitleBaseline;
  return { titleLines, descriptionLines, textWidth, lastBaseline };
}

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
  const terminusLayout = terminus ? layOutTerminus(terminus) : null;
  const ys = lines.map((_, index) => FIRST_LINE_Y + index * LINE_PITCH);
  const middleY = lines.length ? (ys[0] + ys[ys.length - 1]) / 2 : FIRST_LINE_Y;

  // The extent of the drawn terminus, measured in the browser, so that no font clips its text.
  const mapRef = useRef<SVGSVGElement>(null);
  const [measured, setMeasured] = useState({ right: 0, bottom: 0 });
  const width = Math.max(
    terminusLayout
      ? terminusX + TERMINUS_SIZE + Math.max(TERMINUS_TEXT, TERMINUS_GAP + terminusLayout.textWidth + TERMINUS_GAP)
      : lastStopX + STOP_PITCH,
    measured.right
  );
  const height = Math.max(
    (ys[ys.length - 1] ?? FIRST_LINE_Y) + FIRST_LINE_Y + 4,
    terminusLayout ? middleY + terminusLayout.lastBaseline + TEXT_DESCENT + TERMINUS_GAP : 0,
    measured.bottom
  );

  useBrowserLayoutEffect(() => {
    const element = mapRef.current?.querySelector<SVGGraphicsElement>(`.${styles.terminus}`);
    const box = element && typeof element.getBBox === 'function' ? element.getBBox() : null;
    const right = box ? Math.ceil(box.x + box.width + TERMINUS_GAP) : 0;
    const bottom = box ? Math.ceil(box.y + box.height + TERMINUS_GAP) : 0;
    setMeasured(previous => (previous.right === right && previous.bottom === bottom ? previous : { right, bottom }));
  }, [terminus?.title, terminus?.description, middleY, terminusX]);

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
      <svg ref={mapRef} className={styles.map} viewBox={`0 0 ${width} ${height}`} direction="ltr">
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
        {terminus && terminusLayout && (
          <Terminus terminus={terminus} layout={terminusLayout} x={terminusX} y={middleY} onClick={follow} />
        )}
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
  layout: TerminusLayout;
  x: number;
  y: number;
  onClick: (lineId: null, href: string) => (event: React.MouseEvent) => void;
}

function Terminus({ terminus, layout, x, y, onClick }: TerminusProps) {
  const textX = x + TERMINUS_SIZE + TERMINUS_GAP;
  const descriptionY = y - 4 + layout.titleLines.length * TERMINUS_TITLE_PITCH;
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
      <text className={styles.title} x={textX} y={y - 4}>
        <Lines lines={layout.titleLines} x={textX} pitch={TERMINUS_TITLE_PITCH} />
      </text>
      {layout.descriptionLines.length > 0 && (
        <text className={styles.description} x={textX} y={descriptionY}>
          <Lines lines={layout.descriptionLines} x={textX} pitch={TERMINUS_DESCRIPTION_PITCH} />
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

// Each wrapped line but the last keeps its trailing space, so the text still reads as one sentence.
function Lines({ lines, x, pitch }: { lines: string[]; x: number; pitch: number }) {
  return (
    <>
      {lines.map((line, index) => (
        <tspan key={index} x={x} dy={index === 0 ? 0 : pitch}>
          {index < lines.length - 1 ? `${line} ` : line}
        </tspan>
      ))}
    </>
  );
}
