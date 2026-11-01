// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TestimonialProps } from './interfaces';
import { InternalTestimonial } from './internal';

export type { TestimonialProps };

/**
 * A card with a customer's words, their name and where they are from. The quote must be real and
 * used with the customer's permission.
 */
export default function Testimonial({ quote, name, detail, media, tone = 'default', ...props }: TestimonialProps) {
  return (
    <InternalTestimonial {...getBaseProps(props)} quote={quote} name={name} detail={detail} media={media} tone={tone} />
  );
}
