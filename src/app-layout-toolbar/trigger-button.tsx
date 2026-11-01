// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { IconProps } from '../icon/interfaces';
import { InternalTooltip } from '../tooltip/internal';

import styles from './styles.css.js';

export interface TriggerButtonProps {
  ariaLabel?: string;
  iconName?: IconProps.Name;
  iconSvg?: React.ReactNode;
  /**
   * Whether the panel the trigger opens is open. The trigger is drawn pressed.
   */
  expanded: boolean;
  badge?: boolean;
  ariaControls?: string;
  /**
   * Shows the accessible name in a tooltip on this side, for triggers in a rail where
   * there is no room for text.
   */
  tooltipPosition?: 'left' | 'right';
  onClick: () => void;
  className?: string;
  'data-trigger-id'?: string;
}

/**
 * An icon button that opens and closes one of the app layout's panels.
 */
export const TriggerButton = React.forwardRef(
  (
    {
      ariaLabel,
      iconName,
      iconSvg,
      expanded,
      badge = false,
      ariaControls,
      tooltipPosition,
      onClick,
      className,
      ...rest
    }: TriggerButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const button = (
      <span className={clsx(styles.trigger, className)}>
        <InternalButton
          {...rest}
          ref={ref}
          className={clsx(styles['trigger-button'], expanded && styles['trigger-expanded'])}
          variant="icon"
          formAction="none"
          iconName={iconName}
          iconSvg={iconSvg}
          ariaLabel={ariaLabel}
          ariaExpanded={expanded}
          ariaControls={ariaControls}
          onClick={() => onClick()}
        />
        {badge && <span className={styles.badge} aria-hidden="true" />}
      </span>
    );
    if (!tooltipPosition || !ariaLabel) {
      return button;
    }
    return (
      <InternalTooltip content={ariaLabel} position={tooltipPosition} describesTrigger={false}>
        {button}
      </InternalTooltip>
    );
  }
);
