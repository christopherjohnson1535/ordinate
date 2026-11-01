// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalButtonDropdown } from '../button-dropdown/internal';
import { InternalIcon } from '../icon/internal';
import { TopNavigationProps } from './interfaces';

import styles from './styles.css.js';

export interface UtilityProps {
  utility: TopNavigationProps.Utility;
  /**
   * Shows only the icon, when the utility has one.
   */
  collapsed: boolean;
}

export function canCollapseText(utility: TopNavigationProps.Utility): boolean {
  return Boolean(utility.iconName && utility.text) && !utility.disableTextCollapse;
}

function MenuHeader({ title, description }: { title?: string; description?: string }) {
  return (
    <div className={styles['menu-header']}>
      {title && <div className={styles['menu-title']}>{title}</div>}
      {description && <div className={styles['menu-description']}>{description}</div>}
    </div>
  );
}

/**
 * One utility of the bar, as a quiet button, a primary button or a menu.
 */
export function Utility({ utility, collapsed }: UtilityProps) {
  const iconOnly = (collapsed && canCollapseText(utility)) || !utility.text;
  const ariaLabel = utility.ariaLabel ?? (iconOnly ? utility.text : undefined);
  const primary = utility.type === 'button' && utility.variant === 'primary-button';
  const className = clsx(styles.utility, primary && styles['utility-primary'], iconOnly && styles['icon-only']);

  let control: React.ReactNode;
  if (utility.type === 'menu-dropdown') {
    control = (
      <InternalButtonDropdown
        triggerClassName={className}
        variant={iconOnly ? 'icon' : 'normal'}
        triggerIconName={utility.iconName}
        items={utility.items}
        expandableGroups={utility.expandableGroups}
        onItemClick={utility.onItemClick}
        onItemFollow={utility.onItemFollow}
        ariaLabel={ariaLabel}
        menuHeader={
          utility.title || utility.description ? (
            <MenuHeader title={utility.title} description={utility.description} />
          ) : undefined
        }
      >
        <span className={styles['utility-label']}>
          {utility.iconName && <InternalIcon name={utility.iconName} />}
          {utility.text}
        </span>
      </InternalButtonDropdown>
    );
  } else {
    control = (
      <InternalButton
        className={className}
        variant={primary ? 'primary' : iconOnly ? 'icon' : 'normal'}
        formAction="none"
        iconName={utility.iconName}
        href={utility.href}
        external={utility.external && !iconOnly}
        externalIconAriaLabel={utility.externalIconAriaLabel}
        target={utility.external ? '_blank' : undefined}
        ariaLabel={ariaLabel}
        onClick={utility.onClick}
      >
        {iconOnly ? undefined : utility.text}
      </InternalButton>
    );
  }

  return (
    <span className={styles['utility-slot']}>
      {control}
      {utility.badge && (
        <span className={clsx(styles.badge, iconOnly && styles['badge-centered'])} aria-hidden="true" />
      )}
    </span>
  );
}
