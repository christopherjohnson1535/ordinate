// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { AppLayoutToolbarProps } from './interfaces';
import { TriggerButton } from './trigger-button';

import styles from './styles.css.js';

export interface InternalAppLayoutToolbarProps extends AppLayoutToolbarProps {
  /**
   * Lets the app layout place the toolbar. Not part of the public API.
   */
  className?: string;
  /**
   * Lets the app layout return focus to the navigation toggle. Not part of the public API.
   */
  navigationToggleRef?: React.Ref<ButtonProps.Ref>;
  /**
   * Lets the app layout return focus to a drawer trigger. Not part of the public API.
   */
  drawerTriggerRef?: (id: string) => React.Ref<ButtonProps.Ref>;
  /**
   * IDs of the panels the toggles control, while they are in the page. Not part of the public API.
   */
  navigationControlsId?: string;
  drawerControlsId?: string;
}

export function InternalAppLayoutToolbar({
  breadcrumbs,
  navigationOpen = false,
  navigationHide = false,
  onNavigationChange,
  drawers = [],
  activeDrawerId = null,
  onDrawerChange,
  ariaLabels,
  className,
  navigationToggleRef,
  drawerTriggerRef,
  navigationControlsId,
  drawerControlsId,
  ...rest
}: InternalAppLayoutToolbarProps) {
  const i18n = useInternalI18n('app-layout-toolbar');

  return (
    <div {...rest} className={clsx(styles.root, className)}>
      {!navigationHide && (
        <TriggerButton
          ref={navigationToggleRef}
          className={styles['navigation-toggle']}
          iconName="menu"
          ariaLabel={
            navigationOpen
              ? i18n('navigationClose', ariaLabels?.navigationClose)
              : i18n('navigationToggle', ariaLabels?.navigationToggle)
          }
          expanded={navigationOpen}
          ariaControls={navigationControlsId}
          onClick={() => fireNonCancelableEvent(onNavigationChange, { open: !navigationOpen })}
        />
      )}
      <div className={styles.breadcrumbs}>{breadcrumbs}</div>
      {drawers.length > 0 && (
        <div role="group" className={styles.drawers} aria-label={i18n('drawers', ariaLabels?.drawers)}>
          {drawers.map(drawer => {
            const active = drawer.id === activeDrawerId;
            return (
              <TriggerButton
                key={drawer.id}
                ref={drawerTriggerRef?.(drawer.id)}
                data-trigger-id={drawer.id}
                iconName={drawer.iconName}
                iconSvg={drawer.iconSvg}
                ariaLabel={drawer.ariaLabel}
                badge={drawer.badge}
                expanded={active}
                ariaControls={active ? drawerControlsId : undefined}
                onClick={() => fireNonCancelableEvent(onDrawerChange, { activeDrawerId: active ? null : drawer.id })}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
