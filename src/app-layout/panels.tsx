// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { TriggerButton } from '../app-layout-toolbar/trigger-button';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { IconProps } from '../icon/interfaces';
import { ResizeHandle } from '../internal/components/resize-handle';

import styles from './styles.css.js';

/**
 * The help panel or a drawer, in the shape the layout renders both.
 */
export interface PanelDefinition {
  id: string;
  content: React.ReactNode;
  name: string;
  triggerLabel: string;
  closeLabel: string;
  resizeLabel: string;
  iconName?: IconProps.Name;
  iconSvg?: React.ReactNode;
  badge: boolean;
  resizable: boolean;
  size: number;
}

interface OverlayProps {
  /**
   * The panel covers the content on a narrow screen, and Escape closes it.
   */
  overlay: boolean;
  onClose: () => void;
}

function closeOnEscape(overlay: boolean, onClose: () => void) {
  return (event: React.KeyboardEvent) => {
    if (overlay && event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    }
  };
}

interface NavigationPanelProps extends OverlayProps {
  id: string;
  open: boolean;
  width: number;
  ariaLabel?: string;
  closeLabel?: string;
  showCloseButton: boolean;
  closeButtonRef: React.Ref<ButtonProps.Ref>;
  children: React.ReactNode;
}

// Stays mounted while closed, so the navigation keeps state such as expanded sections.
export function NavigationPanel({
  id,
  open,
  width,
  ariaLabel,
  closeLabel,
  showCloseButton,
  closeButtonRef,
  overlay,
  onClose,
  children,
}: NavigationPanelProps) {
  return (
    <nav
      id={id}
      aria-label={ariaLabel}
      hidden={!open}
      className={clsx(styles.navigation, overlay && styles.overlay)}
      style={overlay ? undefined : { inlineSize: width }}
      onKeyDown={closeOnEscape(overlay, onClose)}
    >
      {showCloseButton && (
        <div className={styles['navigation-header']}>
          <InternalButton
            ref={closeButtonRef}
            variant="icon"
            formAction="none"
            iconName={overlay ? 'close' : 'chevron-left'}
            ariaLabel={closeLabel}
            ariaExpanded={true}
            ariaControls={id}
            onClick={onClose}
          />
        </div>
      )}
      <div className={styles['navigation-content']}>{children}</div>
    </nav>
  );
}

interface ActivePanelProps extends OverlayProps {
  id: string;
  panel: PanelDefinition;
  minSize: number;
  maxSize: number;
  closeButtonRef: React.Ref<ButtonProps.Ref>;
  onResize: (size: number) => void;
}

export function ActivePanel({
  id,
  panel,
  minSize,
  maxSize,
  closeButtonRef,
  overlay,
  onClose,
  onResize,
}: ActivePanelProps) {
  return (
    <aside
      id={id}
      aria-label={panel.name}
      className={clsx(styles.panel, overlay && styles.overlay)}
      style={overlay ? undefined : { inlineSize: panel.size }}
      data-panel-id={panel.id}
      onKeyDown={closeOnEscape(overlay, onClose)}
    >
      {panel.resizable && !overlay && (
        <ResizeHandle
          edge="inline-start"
          size={panel.size}
          minSize={minSize}
          maxSize={maxSize}
          onResize={onResize}
          ariaLabel={panel.resizeLabel}
          ariaControls={id}
        />
      )}
      <InternalButton
        ref={closeButtonRef}
        className={styles['panel-close']}
        variant="icon"
        formAction="none"
        iconName="close"
        ariaLabel={panel.closeLabel}
        onClick={onClose}
      />
      <div className={styles['panel-content']}>{panel.content}</div>
    </aside>
  );
}

interface PanelRailProps {
  panels: ReadonlyArray<PanelDefinition>;
  activePanelId: string | null;
  panelElementId: string;
  triggerRef: (id: string) => React.Ref<ButtonProps.Ref>;
  onChange: (id: string | null) => void;
}

/**
 * The column of toggles at the end of the line on wide screens.
 */
export function PanelRail({ panels, activePanelId, panelElementId, triggerRef, onChange }: PanelRailProps) {
  return (
    <div className={clsx(styles.rail, styles['panel-rail'])}>
      {panels.map(panel => {
        const active = panel.id === activePanelId;
        return (
          <TriggerButton
            key={panel.id}
            ref={triggerRef(panel.id)}
            data-trigger-id={panel.id}
            iconName={panel.iconName}
            iconSvg={panel.iconSvg}
            ariaLabel={panel.triggerLabel}
            badge={panel.badge}
            expanded={active}
            ariaControls={active ? panelElementId : undefined}
            tooltipPosition="left"
            onClick={() => onChange(active ? null : panel.id)}
          />
        );
      })}
    </div>
  );
}

interface NavigationRailProps {
  label?: string;
  toggleRef: React.Ref<ButtonProps.Ref>;
  onOpen: () => void;
}

/**
 * Takes the place of the closed navigation on wide screens.
 */
export function NavigationRail({ label, toggleRef, onOpen }: NavigationRailProps) {
  return (
    <div className={clsx(styles.rail, styles['navigation-rail'])}>
      <TriggerButton
        ref={toggleRef}
        iconName="menu"
        ariaLabel={label}
        expanded={false}
        tooltipPosition="right"
        onClick={onOpen}
      />
    </div>
  );
}
