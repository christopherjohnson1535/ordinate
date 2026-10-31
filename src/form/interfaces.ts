// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface FormProps extends BaseComponentProps {
  /**
   * The fields of the form, usually form fields grouped in containers.
   */
  children?: React.ReactNode;
  /**
   * The title of the form and an optional description, shown above the content.
   */
  header?: React.ReactNode;
  /**
   * An error that applies to the whole form, such as a failed request. Shown above the
   * actions and announced to screen readers. Say what went wrong and what to do next.
   */
  errorText?: React.ReactNode;
  /**
   * Accessible name of the icon next to `errorText`, such as "Error".
   */
  errorIconAriaLabel?: string;
  /**
   * The main actions, aligned to the end of the footer. Put the primary action last.
   */
  actions?: React.ReactNode;
  /**
   * Less important actions, aligned to the start of the footer.
   */
  secondaryActions?: React.ReactNode;
  /**
   * `full-page` when the form is the whole content of the page, `embedded` when it is part
   * of a page. Both look the same.
   */
  variant?: FormProps.Variant;
}

export namespace FormProps {
  export type Variant = 'full-page' | 'embedded';
}
