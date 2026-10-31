// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { LinkProps } from './interfaces';
import { InternalLink } from './internal';

export type { LinkProps };

const Link = React.forwardRef(
  (
    {
      children,
      variant = 'secondary',
      href,
      external = false,
      externalIconAriaLabel,
      target,
      rel,
      fontSize = 'body-m',
      color = 'normal',
      ariaLabel,
      onFollow,
      onClick,
      ...props
    }: LinkProps,
    ref: React.Ref<LinkProps.Ref>
  ) => (
    <InternalLink
      {...getBaseProps(props)}
      ref={ref}
      variant={variant}
      href={href}
      external={external}
      externalIconAriaLabel={externalIconAriaLabel}
      target={target}
      rel={rel}
      fontSize={fontSize}
      color={color}
      ariaLabel={ariaLabel}
      onFollow={onFollow}
      onClick={onClick}
    >
      {children}
    </InternalLink>
  )
);

Link.displayName = 'Link';

export default Link;
