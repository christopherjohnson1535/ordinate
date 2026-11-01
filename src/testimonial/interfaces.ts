// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

/**
 * Use only real words from a real customer, and only with their permission to show them and their
 * name. Shorten a quote if you must, but never change what it says.
 */
export interface TestimonialProps extends BaseComponentProps {
  /**
   * What the customer said, without quotation marks. It must be their real words, used with their
   * permission.
   */
  quote: React.ReactNode;
  /**
   * The customer's name, as they agreed to have it shown, such as "Priya S.".
   */
  name?: React.ReactNode;
  /**
   * A detail that places the customer, such as their neighbourhood ("Riverside") or their role
   * ("Owner, Corner Books").
   */
  detail?: React.ReactNode;
  /**
   * A small picture of the customer beside their name, usually a square `Media`. Use a photo only
   * with their permission, and give it an empty `alt` because the name is right next to it.
   */
  media?: React.ReactNode;
  /**
   * * `default` is a plain card.
   * * `accent` sits on the style's accent color.
   */
  tone?: TestimonialProps.Tone;
}

export namespace TestimonialProps {
  export type Tone = 'default' | 'accent';
}
