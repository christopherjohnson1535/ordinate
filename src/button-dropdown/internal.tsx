// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { IconProps } from '../icon/interfaces';
import { Dropdown } from '../internal/components/dropdown';
import { fireCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { ButtonDropdownProps } from './interfaces';
import { Menu } from './menu';
import { getItemClickDetails, isPlainLeftClick } from './utils';

import styles from './styles.css.js';

type FocusTarget = 'first' | 'last' | 'menu';

export interface InternalButtonDropdownProps extends ButtonDropdownProps {
  /**
   * Lets other components position the dropdown. Not part of the public API.
   */
  className?: string;
  /**
   * Lets other components restyle the button that opens the menu. Not part of the public API.
   */
  triggerClassName?: string;
  /**
   * The icon of the icon variants, instead of the ellipsis. Not part of the public API.
   */
  triggerIconName?: IconProps.Name;
  /**
   * Content fixed above the items, such as the signed-in user's name. Not part of the public API.
   */
  menuHeader?: React.ReactNode;
  /**
   * Lets a composite widget, such as a toolbar, manage the trigger's tab stop. Not part of the public API.
   */
  triggerTabIndex?: number;
  /**
   * Wraps the trigger button alone, without the menu, for example in a tooltip. Not part of the public API.
   */
  wrapTrigger?: (trigger: React.ReactElement) => React.ReactNode;
}

export const InternalButtonDropdown = React.forwardRef(
  (
    {
      items,
      expandableGroups = false,
      onItemClick,
      onItemFollow,
      children,
      variant = 'normal',
      mainAction,
      expandToViewport = false,
      disabled = false,
      loading = false,
      loadingText,
      ariaLabel,
      className,
      triggerClassName,
      triggerIconName,
      menuHeader,
      triggerTabIndex,
      wrapTrigger,
      ...rest
    }: InternalButtonDropdownProps,
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const i18n = useInternalI18n('button-dropdown');
    const baseId = useId();
    const triggerId = `${baseId}trigger`;
    const menuId = `${baseId}menu`;

    const triggerRef = useRef<ButtonProps.Ref>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const [open, setOpen] = useState(false);
    const pendingFocus = useRef<FocusTarget | null>(null);
    const suppressSpaceKeyUp = useRef(false);
    // The trigger's click event carries no click count, so a pointer press is tracked to tell mouse from keyboard.
    const pointerPressed = useRef(false);

    useImperativeHandle(ref, () => ({ focus: () => triggerRef.current?.focus() }));

    const isIconVariant = variant === 'icon' || variant === 'inline-icon';
    const isSplit = mainAction !== undefined && !isIconVariant;
    const inactive = disabled || loading;

    if (mainAction && isIconVariant) {
      warnOnce('ButtonDropdown', 'A main action is only supported with the normal and primary variants.');
    }

    useEffect(() => {
      const target = pendingFocus.current;
      if (!open || !target || !menuRef.current) {
        return;
      }
      pendingFocus.current = null;
      const elements = menuRef.current.querySelectorAll<HTMLElement>('[data-menu-item]');
      const element = target === 'menu' ? menuRef.current : elements[target === 'first' ? 0 : elements.length - 1];
      (element ?? menuRef.current).focus();
    }, [open]);

    const openMenu = (focusTarget: FocusTarget) => {
      if (inactive || open) {
        return;
      }
      pendingFocus.current = focusTarget;
      setOpen(true);
    };

    const closeMenu = (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) {
        triggerRef.current?.focus();
      }
    };

    const handleItemActivate = (item: ButtonDropdownProps.Item, event: React.MouseEvent) => {
      const details = getItemClickDetails(item);
      fireCancelableEvent(onItemClick, details, event);
      if (item.href !== undefined && isPlainLeftClick(event)) {
        fireCancelableEvent(onItemFollow, details, event);
      }
      closeMenu(true);
    };

    const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
      pointerPressed.current = false;
      if (open || inactive) {
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        openMenu(event.key === 'ArrowDown' ? 'first' : 'last');
      }
    };

    const handleTriggerClick = () => {
      const fromPointer = pointerPressed.current;
      pointerPressed.current = false;
      if (open) {
        closeMenu(true);
        return;
      }
      // Keyboard users land on the first item; mouse users get the menu without a highlighted item.
      openMenu(fromPointer ? 'menu' : 'first');
    };

    const triggerVariant: ButtonProps.Variant = isIconVariant ? 'icon' : variant;
    const triggerLabel = isIconVariant || isSplit ? i18n('ariaLabel', ariaLabel) : ariaLabel;

    const trigger = (
      <InternalButton
        ref={triggerRef}
        id={triggerId}
        className={clsx(
          styles.trigger,
          variant === 'inline-icon' && styles['inline-icon'],
          isSplit && styles.segment,
          isSplit && styles['split-trigger'],
          isSplit && variant === 'primary' && styles['split-trigger-primary'],
          triggerClassName
        )}
        variant={triggerVariant}
        formAction="none"
        iconName={isIconVariant ? (triggerIconName ?? 'more') : 'chevron-down'}
        iconAlign="right"
        disabled={disabled}
        loading={loading}
        loadingText={loadingText}
        ariaLabel={triggerLabel}
        ariaExpanded={open}
        ariaHaspopup="menu"
        ariaControls={open ? menuId : undefined}
        tabIndex={triggerTabIndex}
        onClick={handleTriggerClick}
      >
        {isIconVariant || isSplit ? undefined : children}
      </InternalButton>
    );

    const mainActionButton = isSplit && mainAction && (
      <InternalButton
        className={clsx(styles['main-action'], styles.segment)}
        variant={variant === 'primary' ? 'primary' : 'normal'}
        formAction="none"
        iconName={mainAction.iconName}
        href={mainAction.href}
        external={mainAction.external}
        externalIconAriaLabel={mainAction.externalIconAriaLabel}
        disabled={mainAction.disabled}
        loading={mainAction.loading}
        loadingText={mainAction.loadingText}
        ariaLabel={mainAction.ariaLabel}
        onClick={mainAction.onClick}
      >
        {mainAction.text}
      </InternalButton>
    );

    return (
      <div
        {...rest}
        className={clsx(
          styles.root,
          isSplit && styles.split,
          isSplit && variant === 'primary' && styles['split-primary'],
          isSplit && disabled && (mainAction?.disabled ?? false) && styles['split-disabled'],
          className
        )}
        onBlur={event => {
          if (open && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
            closeMenu(false);
          }
        }}
        onKeyUp={event => {
          // Space chose an item and moved focus to the trigger; its keyup must not reopen the menu.
          if (event.key === ' ' && suppressSpaceKeyUp.current) {
            suppressSpaceKeyUp.current = false;
            event.preventDefault();
          }
        }}
      >
        {mainActionButton}
        <Dropdown
          open={open}
          className={styles.dropdown}
          expandToViewport={expandToViewport}
          header={menuHeader}
          trigger={
            <span
              className={styles['trigger-area']}
              onKeyDown={handleTriggerKeyDown}
              onMouseDown={() => (pointerPressed.current = true)}
            >
              {wrapTrigger ? wrapTrigger(trigger) : trigger}
            </span>
          }
          onOutsideClick={() => closeMenu(false)}
        >
          <Menu
            ref={menuRef}
            id={menuId}
            ariaLabelledby={triggerId}
            items={items}
            expandableGroups={expandableGroups}
            onItemActivate={handleItemActivate}
            onDismiss={() => closeMenu(true)}
            onSpaceActivate={() => (suppressSpaceKeyUp.current = true)}
          />
        </Dropdown>
      </div>
    );
  }
);
