// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface SchematicProps extends BaseComponentProps {
  /**
   * The width of the drawing in drawing units. Every coordinate in `parts` and `wires` is in the same
   * units. The drawing scales to the width of its container and keeps its proportions.
   */
  width: number;
  /**
   * The height of the drawing in drawing units.
   */
  height: number;
  /**
   * The boxes of the drawing, such as the components of a system. Later parts are drawn on top of
   * earlier ones.
   */
  parts: ReadonlyArray<SchematicProps.Part>;
  /**
   * The wires between parts, drawn under every part.
   */
  wires?: ReadonlyArray<SchematicProps.Wire>;
  /**
   * What the drawing shows now, by part or wire ID. A part or wire that is not listed is hidden.
   *
   * Change it to move the drawing from one state to the next, such as the steps of a walkthrough: a
   * part that appears draws its outline on, one that goes away takes it off, and the rest keep their
   * place. When `scene` is not set, everything is shown.
   */
  scene?: Readonly<Record<string, SchematicProps.State>>;
  /**
   * How the drawing is drawn. The parts, wires and scene are the same in every variant.
   *
   * - `schematic`: square ink outlines and right-angle wiring on a dot grid. Accent parts are hatched in
   *   the accent color.
   * - `sketch`: the same shapes drawn by hand, with hand lettering and hachure fills.
   * - `chalkboard`: clean strokes on a dark board in a book face. Accent parts are drawn in the accent
   *   color.
   *
   * The `sketch` and `chalkboard` faces ship in `@ordinate/global-styles/drawing-fonts.css`. Import it
   * when you use those variants.
   * Defaults to `'schematic'`.
   */
  variant?: SchematicProps.Variant;
  /**
   * Describes what the drawing shows now, for people who cannot see it. Update it with the scene.
   */
  ariaLabel: string;
  /**
   * The ID of an element with a longer description of the drawing, such as the text of the current
   * step.
   */
  ariaDescribedby?: string;
}

export namespace SchematicProps {
  export type Variant = 'schematic' | 'sketch' | 'chalkboard';

  export interface Part {
    /**
     * Identifies the part in `scene`. Unique among parts and wires.
     */
    id: string;
    /**
     * The left edge in drawing units.
     */
    x: number;
    /**
     * The top edge in drawing units.
     */
    y: number;
    /**
     * The width in drawing units.
     */
    width: number;
    /**
     * The height in drawing units.
     */
    height: number;
    /**
     * The name of the part, centered in the box.
     */
    label: string;
    /**
     * A second, smaller line under the label in a typewriter face, such as a status or a count.
     */
    detail?: string;
    /**
     * `small` sets the lettering for boxes with room for a word or two, such as one of a row of
     * replicas.
     * Defaults to `'normal'`.
     */
    size?: 'normal' | 'small';
  }

  export interface Wire {
    /**
     * Identifies the wire in `scene`. Unique among parts and wires.
     */
    id: string;
    /**
     * The points the wire runs through, in drawing units. Keep consecutive points on the same row or
     * column for right-angle wiring. The wire ends in an arrowhead at the last point.
     */
    points: ReadonlyArray<SchematicProps.Point>;
    /**
     * Points where the wire branches off a shared run, drawn as dots.
     */
    junctions?: ReadonlyArray<SchematicProps.Point>;
    /**
     * Sends dots along the wire while it is shown, such as requests flowing to a service. The wire is
     * drawn in the accent color. The dots stay still when the user prefers reduced motion.
     */
    flow?: boolean;
  }

  /**
   * An `[x, y]` pair in drawing units.
   */
  export type Point = readonly [number, number];

  export interface State {
    /**
     * Marks the new or focused thing: hatched in the `schematic` and `sketch` variants, in the accent
     * color on a `chalkboard`.
     */
    accent?: boolean;
    /**
     * Pushes the part or wire back, such as something being replaced.
     */
    dimmed?: boolean;
    /**
     * `pending` draws a part that is starting up more faintly. `removed` crosses it out.
     */
    status?: 'pending' | 'removed';
  }
}
