// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ActionCardProps } from './interfaces';
import { InternalActionCard } from './internal';

export type { ActionCardProps };

const ActionCard = React.forwardRef(
  (
    {
      header,
      description,
      children,
      iconName,
      kind = 'neutral',
      href,
      target,
      onClick,
      onFollow,
      disabled = false,
      ariaLabel,
      ...props
    }: ActionCardProps,
    ref: React.Ref<ActionCardProps.Ref>
  ) => (
    <InternalActionCard
      {...getBaseProps(props)}
      ref={ref}
      header={header}
      description={description}
      iconName={iconName}
      kind={kind}
      href={href}
      target={target}
      onClick={onClick}
      onFollow={onFollow}
      disabled={disabled}
      ariaLabel={ariaLabel}
    >
      {children}
    </InternalActionCard>
  )
);

ActionCard.displayName = 'ActionCard';

export default ActionCard;
