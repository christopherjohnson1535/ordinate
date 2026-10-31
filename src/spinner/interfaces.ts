// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface SpinnerProps extends BaseComponentProps {
  /**
   * The size of the spinner. `normal` matches the size of an icon in body text.
   */
  size?: SpinnerProps.Size;
  /**
   * The color of the spinner:
   * * `normal` follows the surrounding text color.
   * * `disabled` uses the disabled text color.
   * * `inverted` is for dark fills, such as a primary button.
   *
   * The spinner is decorative and hidden from assistive technology. Pair it with text that says what is loading.
   */
  variant?: SpinnerProps.Variant;
}

export namespace SpinnerProps {
  export type Size = 'normal' | 'big' | 'large';

  export type Variant = 'normal' | 'disabled' | 'inverted';
}
