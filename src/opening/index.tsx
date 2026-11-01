// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { OpeningProps } from './interfaces';
import { InternalOpening } from './internal';

export type { OpeningProps };

export default function Opening({
  variant = 'statement',
  title,
  kicker,
  meta,
  description,
  actions,
  links,
  navigationAriaLabel,
  onFollow,
  badge,
  media,
  mediaCaption,
  mediaPosition = 'end',
  headingLevel = 1,
  ...props
}: OpeningProps) {
  return (
    <InternalOpening
      {...getBaseProps(props)}
      variant={variant}
      title={title}
      kicker={kicker}
      meta={meta}
      description={description}
      actions={actions}
      links={links}
      navigationAriaLabel={navigationAriaLabel}
      onFollow={onFollow}
      badge={badge}
      media={media}
      mediaCaption={mediaCaption}
      mediaPosition={mediaPosition}
      headingLevel={headingLevel}
    />
  );
}
