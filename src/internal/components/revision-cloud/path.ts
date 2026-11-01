// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Scallops of about this length, whatever the size of the box, so a small cloud and a large one
// are drawn with the same pen.
const targetChord = 18;
// A radius a little over half the chord draws a shallow arc, as a revision cloud is drawn by hand.
const radiusRatio = 0.62;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * The outline of a revision cloud around a `width` by `height` box: a closed path of arcs bulging
 * outward, drawn clockwise from the top-left corner. Each side is split into whole scallops so the
 * corners meet.
 */
export function cloudPath(width: number, height: number): string {
  if (!(width > 0) || !(height > 0)) {
    return '';
  }
  const corners: Array<[number, number]> = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];
  const commands = [`M0 0`];
  corners.forEach(([fromX, fromY], index) => {
    const [toX, toY] = corners[(index + 1) % corners.length];
    const length = Math.hypot(toX - fromX, toY - fromY);
    const count = Math.max(1, Math.round(length / targetChord));
    const radius = round((length / count) * radiusRatio);
    for (let step = 1; step <= count; step++) {
      const x = round(fromX + ((toX - fromX) * step) / count);
      const y = round(fromY + ((toY - fromY) * step) / count);
      // Sweep flag 1 turns clockwise, which bulges each arc away from the box on a clockwise path.
      commands.push(`A${radius} ${radius} 0 0 1 ${x} ${y}`);
    }
  });
  commands.push('Z');
  return commands.join(' ');
}
