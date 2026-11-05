// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface RouteMapProps extends BaseComponentProps {
  /**
   * The lines of the route, drawn top to bottom. Each runs left to right through its stops, then bends
   * at right angles onto one shared run into the terminus, like a transit map.
   */
  lines: ReadonlyArray<RouteMapProps.Line>;
  /**
   * Where every line ends, drawn as a square station after the shared run.
   */
  terminus?: RouteMapProps.Terminus;
  /**
   * The ID of the line to draw with a highlight band behind it, such as the one whose details are
   * shown next to the map.
   */
  selectedLineId?: string;
  /**
   * The ID of the stop to ring, such as where the user left off.
   */
  currentStopId?: string;
  /**
   * The note above the current stop.
   * Defaults to "You are here".
   */
  currentStopLabel?: string;
  /**
   * Names the map for screen reader users, such as "Course route".
   */
  ariaLabel: string;
  /**
   * Called when the user follows the link of a line or of the terminus. Call `preventDefault()` to
   * handle the navigation yourself, such as with a client-side router. Clicks with a modifier key are
   * left to the browser.
   */
  onFollow?: CancelableEventHandler<RouteMapProps.FollowDetail>;
}

export namespace RouteMapProps {
  export interface Line {
    /**
     * Identifies the line in `selectedLineId` and in the `onFollow` event.
     */
    id: string;
    /**
     * The name of the line, at the start of its row.
     */
    title: string;
    /**
     * A short second line under the title, such as "2 of 7 done".
     */
    description?: string;
    /**
     * Makes the title, description and stops one link to this address.
     */
    href?: string;
    /**
     * The stops along the line, in order.
     */
    stops: ReadonlyArray<RouteMapProps.Stop>;
  }

  export interface Stop {
    /**
     * Identifies the stop in `currentStopId`.
     */
    id: string;
    /**
     * - `planned`: not open yet, drawn faint.
     * - `open`: ready to visit, drawn in ink.
     * - `done`: visited, filled in.
     */
    status: 'planned' | 'open' | 'done';
    /**
     * `station` draws a square instead of a circle, for a stop that matters more than the others, such
     * as the last one on a line.
     * Defaults to `'stop'`.
     */
    type?: 'stop' | 'station';
  }

  export interface Terminus {
    /**
     * The name of the terminus. Long names wrap onto more lines.
     */
    title: string;
    /**
     * A second line under the title. Long text wraps onto more lines.
     */
    description?: string;
    /**
     * Makes the terminus a link to this address.
     */
    href?: string;
  }

  export interface FollowDetail {
    /**
     * The ID of the line followed, or `null` for the terminus.
     */
    lineId: string | null;
    /**
     * The address of the link.
     */
    href: string;
  }
}
