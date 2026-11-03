// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MarkId } from './types';

export interface Mark {
  id: MarkId;
  name: string;
  /** What the mark says, in a few words. */
  meaning: string;
}

/** The marks of the design language (DL-1), in order. Each mark has one meaning. */
export const marks: ReadonlyArray<Mark> = [
  { id: 'M1', name: 'Construction line', meaning: 'These belong together.' },
  { id: 'M2', name: 'Hash mark', meaning: 'A line ends or meets another here.' },
  { id: 'M3', name: 'Dimension line', meaning: 'How much: a count, progress, a limit or a range.' },
  { id: 'M4', name: 'Margin', meaning: 'A label column against a construction line.' },
  { id: 'M5', name: 'Crop marks', meaning: 'One of a set.' },
  { id: 'M6', name: 'Key square', meaning: 'All, some or none.' },
  { id: 'M7', name: 'Leader', meaning: 'Goes somewhere else, or ties a note to its subject.' },
  { id: 'M8', name: 'Reference', meaning: 'A short code that names a part, in its kind’s color.' },
  { id: 'M9', name: 'Plate', meaning: 'Lifted off the drawing.' },
  { id: 'M10', name: 'Ink fill', meaning: 'On.' },
  { id: 'M11', name: 'Position rule', meaning: 'You are here.' },
  { id: 'M12', name: 'Hatch', meaning: 'Not available, with the reason in words.' },
  { id: 'M13', name: 'Offset', meaning: 'An object above the sheet.' },
];

export const markById = new Map(marks.map(mark => [mark.id, mark]));
