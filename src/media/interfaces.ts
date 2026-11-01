// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface MediaProps extends BaseComponentProps {
  /**
   * The address of the image to show.
   */
  src?: string;
  /**
   * Describes the image for people who cannot see it, such as "Fresh loaves on the counter". Required
   * whenever `src` is set. Use an empty string only when the image is decoration and the text around
   * it already says everything.
   */
  alt?: string;
  /**
   * The shape of the frame, as width to height. The image is cropped or fitted into it, so a row of
   * pictures stays even. `auto` keeps the image's own shape.
   */
  aspectRatio?: MediaProps.AspectRatio;
  /**
   * How the image fills the frame:
   * * `cover` fills the whole frame and crops what does not fit. Good for photos.
   * * `contain` shows the whole image and leaves space around it. Good for logos and product shots.
   */
  fit?: MediaProps.Fit;
  /**
   * Your own content for the frame instead of an image, such as a `<video>`, an `<iframe>` with a map
   * or an SVG drawing. It is sized to fill the frame. Give it its own accessible name.
   */
  children?: React.ReactNode;
  /**
   * A short note shown on the empty frame while there is no image yet, such as "Photo of the shop
   * front". It is for drafts and is hidden from screen readers.
   */
  placeholderText?: string;
}

export namespace MediaProps {
  export type AspectRatio = '1:1' | '4:3' | '3:2' | '16:9' | '4:5' | 'auto';
  export type Fit = 'cover' | 'contain';
}
