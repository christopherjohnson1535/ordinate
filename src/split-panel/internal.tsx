// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { ResizeHandle } from '../internal/components/resize-handle';
import { defaultSplitPanelContext, useSplitPanelContext } from '../internal/context/split-panel-context';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { InternalTooltip } from '../tooltip/internal';
import { SplitPanelProps } from './interfaces';
import { PreferencesModal } from './preferences';

import styles from './styles.css.js';

export function InternalSplitPanel({
  header,
  headerTag,
  headerDescription,
  headerInfo,
  headerActions,
  children,
  closeBehavior = 'collapse',
  hidePreferencesButton = false,
  i18nStrings,
  ...rest
}: SplitPanelProps) {
  const i18n = useInternalI18n('split-panel');
  const context = useSplitPanelContext();
  const {
    position,
    isOpen,
    size,
    minSize,
    maxSize,
    isSidePositionUnavailable,
    pendingFocusRef,
    onToggle,
    onResize,
    onPreferencesChange,
  } = context ?? defaultSplitPanelContext;
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const panelId = useId();
  const headingId = useId();
  const openButtonRef = useRef<ButtonProps.Ref>(null);
  const closeButtonRef = useRef<ButtonProps.Ref>(null);
  const preferencesButtonRef = useRef<ButtonProps.Ref>(null);
  const toggledByUser = useRef(false);
  const preferencesClosedByUser = useRef(false);

  useEffect(() => {
    if (!context) {
      warnOnce('SplitPanel', 'Place the split panel in the `splitPanel` slot of an app layout.');
    }
  }, [context]);

  // The button the user pressed goes away when the panel opens or closes, so focus follows to its counterpart.
  useEffect(() => {
    if (!toggledByUser.current) {
      return;
    }
    toggledByUser.current = false;
    (isOpen ? closeButtonRef : openButtonRef).current?.focus();
  }, [isOpen]);

  // Focus can only leave the modal dialog once it has closed.
  useEffect(() => {
    if (!preferencesOpen && preferencesClosedByUser.current) {
      preferencesClosedByUser.current = false;
      preferencesButtonRef.current?.focus();
    }
  }, [preferencesOpen]);

  // A new position remounts the panel in another part of the layout; focus returns to the preferences button.
  useEffect(() => {
    if (pendingFocusRef.current === 'preferences') {
      pendingFocusRef.current = null;
      preferencesButtonRef.current?.focus();
    }
  }, [pendingFocusRef]);

  if (!isOpen && closeBehavior === 'hide') {
    return null;
  }

  const toggle = () => {
    toggledByUser.current = true;
    onToggle();
  };

  const openButtonLabel = i18n('openButtonAriaLabel', i18nStrings?.openButtonAriaLabel);

  if (!isOpen && position === 'side') {
    return (
      <div {...rest} className={clsx(styles.root, styles['side-rail'])}>
        <InternalTooltip content={header} position="left">
          <InternalButton
            ref={openButtonRef}
            variant="icon"
            formAction="none"
            iconName="chevron-left"
            ariaLabel={openButtonLabel}
            ariaExpanded={false}
            onClick={toggle}
          />
        </InternalTooltip>
      </div>
    );
  }

  // Drawn like a detail callout: the circled tag, and above the title a label that repeats it. The circle is
  // left out of the accessibility tree, so the tag is read once, in the label.
  const heading = (
    <div className={styles['header-title']}>
      {headerTag && (
        <span className={styles.tag} aria-hidden="true">
          {headerTag}
        </span>
      )}
      <div className={styles['heading-group']}>
        {headerTag && (
          <span className={styles.kicker}>
            {i18n('detailText', i18nStrings?.detailText)} {headerTag}
          </span>
        )}
        <h2 id={headingId} className={styles.heading}>
          {header}
        </h2>
      </div>
      {isOpen && headerInfo && <span className={styles.info}>{headerInfo}</span>}
    </div>
  );

  if (!isOpen) {
    return (
      <aside
        {...rest}
        aria-labelledby={headingId}
        className={clsx(styles.root, styles['position-bottom'], styles.collapsed)}
      >
        <div className={styles.header}>
          <div className={styles['header-main']}>{heading}</div>
          <div className={styles['header-buttons']}>
            <InternalButton
              ref={openButtonRef}
              variant="icon"
              formAction="none"
              iconName="chevron-up"
              ariaLabel={openButtonLabel}
              ariaExpanded={false}
              onClick={toggle}
            />
          </div>
        </div>
      </aside>
    );
  }

  const preferencesTitle = i18n('preferencesTitle', i18nStrings?.preferencesTitle);
  const sizeStyle = position === 'bottom' ? { blockSize: size } : { inlineSize: size };

  return (
    <aside
      {...rest}
      id={rest.id ?? panelId}
      aria-labelledby={headingId}
      className={clsx(styles.root, styles[`position-${position}`], styles.open)}
      style={sizeStyle}
    >
      <ResizeHandle
        edge={position === 'bottom' ? 'block-start' : 'inline-start'}
        size={size}
        minSize={minSize}
        maxSize={maxSize}
        onResize={onResize}
        ariaLabel={i18n('resizeHandleAriaLabel', i18nStrings?.resizeHandleAriaLabel)}
        ariaControls={rest.id ?? panelId}
      />
      <div className={styles.header}>
        <div className={styles['header-main']}>
          {heading}
          {headerDescription && <div className={styles.description}>{headerDescription}</div>}
        </div>
        {headerActions && <div className={styles.actions}>{headerActions}</div>}
        <div className={styles['header-buttons']}>
          {!hidePreferencesButton && (
            <InternalButton
              ref={preferencesButtonRef}
              className={styles['preferences-button']}
              variant="icon"
              formAction="none"
              iconName="adjust"
              ariaLabel={preferencesTitle}
              ariaHaspopup="dialog"
              onClick={() => setPreferencesOpen(true)}
            />
          )}
          <InternalButton
            ref={closeButtonRef}
            className={styles['close-button']}
            variant="icon"
            formAction="none"
            iconName={position === 'bottom' ? 'chevron-down' : 'chevron-right'}
            ariaLabel={i18n('closeButtonAriaLabel', i18nStrings?.closeButtonAriaLabel)}
            ariaExpanded={true}
            ariaControls={rest.id ?? panelId}
            onClick={toggle}
          />
        </div>
      </div>
      <div className={styles.content}>{children}</div>
      {preferencesOpen && (
        <PreferencesModal
          position={position}
          isSidePositionUnavailable={isSidePositionUnavailable}
          strings={{
            title: preferencesTitle,
            positionLabel: i18n('preferencesPositionLabel', i18nStrings?.preferencesPositionLabel),
            positionDescription: i18n('preferencesPositionDescription', i18nStrings?.preferencesPositionDescription),
            positionBottom: i18n('preferencesPositionBottom', i18nStrings?.preferencesPositionBottom),
            positionSide: i18n('preferencesPositionSide', i18nStrings?.preferencesPositionSide),
            positionSideUnavailable: i18n(
              'preferencesPositionSideUnavailable',
              i18nStrings?.preferencesPositionSideUnavailable
            ),
            confirm: i18n('preferencesConfirm', i18nStrings?.preferencesConfirm),
            cancel: i18n('preferencesCancel', i18nStrings?.preferencesCancel),
          }}
          onDismiss={() => {
            preferencesClosedByUser.current = true;
            setPreferencesOpen(false);
          }}
          onConfirm={next => {
            preferencesClosedByUser.current = true;
            setPreferencesOpen(false);
            if (next !== position) {
              pendingFocusRef.current = 'preferences';
              onPreferencesChange({ position: next });
            }
          }}
        />
      )}
    </aside>
  );
}
