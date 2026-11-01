// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface StampProps extends BaseComponentProps {
  /**
   * The words on the stamp, such as "Approved", "Running" or "Draft". Keep it to one or two words.
   * It is drawn in capitals, but screen readers read it as written.
   */
  children?: React.ReactNode;
  /**
   * What the stamp says about the thing it marks:
   * * `success`, `warning`, `error` and `info` for a status, in the matching status color.
   * * `neutral` for a state with no judgement in it, such as "Archived".
   * * `draft` for work not issued yet. It is drawn with a dashed rule.
   */
  type?: StampProps.Type;
  /**
   * `slight` sets the stamp a little askew, as if pressed by hand; `none` keeps it level. The tilt is
   * only drawn: the text stays in the reading order.
   */
  rotation?: StampProps.Rotation;
  /**
   * `small` for use in a line of text or a table cell, `medium` beside a page or section title.
   */
  size?: StampProps.Size;
}

export namespace StampProps {
  export type Type = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'draft';
  export type Rotation = 'none' | 'slight';
  export type Size = 'small' | 'medium';
}
