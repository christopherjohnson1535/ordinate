// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalAppLayoutToolbar } from '../app-layout-toolbar/internal';
import { ButtonProps } from '../button/interfaces';
import { clampSize } from '../internal/components/resize-handle';
import { SplitPanelContext, SplitPanelContextValue } from '../internal/context/split-panel-context';
import { fireNonCancelableEvent } from '../internal/events';
import { useControllable } from '../internal/hooks/use-controllable';
import { useResizeObserver } from '../internal/hooks/use-resize-observer';
import { useInternalI18n } from '../internal/i18n/context';
import {
  defaultMinContentWidth,
  defaultNavigationWidth,
  defaultToolsWidth,
  getContentTypeDefaults,
  minContentHeight,
  minDrawerSize,
  splitPanelLimits,
  toolsDrawerId,
} from './defaults';
import { AppLayoutProps } from './interfaces';
import { ActivePanel, NavigationPanel, NavigationRail, PanelDefinition, PanelRail } from './panels';
import { useLayoutGeometry, useMeasuredHeight } from './use-layout-geometry';

import styles from './styles.css.js';

type FocusTarget = 'navigation-toggle' | 'navigation-close' | 'panel-close' | { trigger: string };

export const InternalAppLayout = React.forwardRef(
  (
    {
      content,
      contentType = 'default',
      variant = 'default',
      navigation,
      navigationOpen: navigationOpenProp,
      onNavigationChange,
      navigationHide = false,
      navigationWidth = defaultNavigationWidth,
      breadcrumbs,
      notifications,
      stickyNotifications = false,
      tools,
      toolsOpen: toolsOpenProp,
      onToolsChange,
      toolsHide = false,
      toolsWidth = defaultToolsWidth,
      splitPanel,
      splitPanelOpen: splitPanelOpenProp,
      onSplitPanelToggle,
      splitPanelSize: splitPanelSizeProp,
      onSplitPanelResize,
      splitPanelPreferences: splitPanelPreferencesProp,
      onSplitPanelPreferencesChange,
      drawers = [],
      activeDrawerId: activeDrawerIdProp,
      onDrawerChange,
      headerSelector,
      footerSelector,
      disableBodyScroll = false,
      maxContentWidth,
      minContentWidth = defaultMinContentWidth,
      disableContentPaddings = false,
      ariaLabels,
      ...rest
    }: AppLayoutProps,
    ref: React.Ref<AppLayoutProps.Ref>
  ) => {
    const i18n = useInternalI18n('app-layout');
    const defaults = getContentTypeDefaults(contentType);
    const idPrefix = useId();
    const navigationId = `${idPrefix}navigation`;
    const panelId = `${idPrefix}panel`;

    const rootRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLElement>(null);
    const splitPanelSideRef = useRef<HTMLDivElement>(null);
    const navigationToggleRef = useRef<ButtonProps.Ref>(null);
    const navigationCloseRef = useRef<ButtonProps.Ref>(null);
    const panelCloseRef = useRef<ButtonProps.Ref>(null);
    const triggerRefs = useRef(new Map<string, ButtonProps.Ref>());
    const pendingFocus = useRef<FocusTarget | null>(null);
    const splitPanelPendingFocus = useRef<'preferences' | null>(null);

    const [navigationOpen, setNavigationOpen] = useControllable(navigationOpenProp, defaults.navigationOpen);
    const [toolsOpen, setToolsOpen] = useControllable(toolsOpenProp, defaults.toolsOpen);
    const [activeDrawerId, setActiveDrawerId] = useControllable<string | null>(activeDrawerIdProp, null);
    const [splitPanelOpen, setSplitPanelOpen] = useControllable(splitPanelOpenProp, false);
    const [splitPanelPreferences, setSplitPanelPreferences] = useControllable<AppLayoutProps.SplitPanelPreferences>(
      splitPanelPreferencesProp,
      { position: 'bottom' }
    );
    const [splitPanelSizes, setSplitPanelSizes] = useState({
      bottom: splitPanelLimits.bottom.defaultSize,
      side: splitPanelLimits.side.defaultSize,
    });
    const [drawerSizes, setDrawerSizes] = useState<Record<string, number>>({});
    const [toolbarRef, toolbarHeight] = useMeasuredHeight();
    const [contentAreaWidth, setContentAreaWidth] = useState(0);

    const hasNavigation = !navigationHide && navigation !== undefined;
    const hasTools = !toolsHide && tools !== undefined;

    const panels: PanelDefinition[] = [
      ...(hasTools
        ? [
            {
              id: toolsDrawerId,
              content: tools,
              name: i18n('tools', ariaLabels?.tools) ?? '',
              triggerLabel: i18n('toolsToggle', ariaLabels?.toolsToggle) ?? '',
              closeLabel: i18n('toolsClose', ariaLabels?.toolsClose) ?? '',
              resizeLabel: '',
              iconName: 'status-info' as const,
              badge: false,
              resizable: false,
              size: toolsWidth,
            },
          ]
        : []),
      ...drawers.map(drawer => {
        const drawerName = drawer.ariaLabels.drawerName;
        return {
          id: drawer.id,
          content: drawer.content,
          name: drawerName,
          triggerLabel: drawer.ariaLabels.triggerButton ?? drawerName,
          closeLabel: i18n('drawerCloseButton', drawer.ariaLabels.closeButton, { drawerName }) ?? '',
          resizeLabel: i18n('drawerResizeHandle', drawer.ariaLabels.resizeHandle, { drawerName }) ?? '',
          iconName: drawer.trigger.iconName,
          iconSvg: drawer.trigger.iconSvg,
          badge: Boolean(drawer.badge),
          resizable: Boolean(drawer.resizable),
          size: drawerSizes[drawer.id] ?? drawer.defaultSize ?? toolsWidth,
        };
      }),
    ];
    const openDrawerId = drawers.some(drawer => drawer.id === activeDrawerId) ? activeDrawerId : null;
    const activePanelId = openDrawerId ?? (hasTools && toolsOpen ? toolsDrawerId : null);
    const activePanel = panels.find(panel => panel.id === activePanelId);

    const changeNavigation = (open: boolean, moveFocus: boolean) => {
      setNavigationOpen(open);
      fireNonCancelableEvent(onNavigationChange, { open });
      if (moveFocus) {
        pendingFocus.current = open ? 'navigation-close' : 'navigation-toggle';
      }
    };

    // The help panel and the drawers share one place, so opening one closes the other.
    const changePanel = (id: string | null, moveFocus: boolean) => {
      if (id === activePanelId) {
        return;
      }
      const nextToolsOpen = id === toolsDrawerId;
      if (hasTools && toolsOpen !== nextToolsOpen) {
        setToolsOpen(nextToolsOpen);
        fireNonCancelableEvent(onToolsChange, { open: nextToolsOpen });
      }
      const nextDrawerId = id === toolsDrawerId ? null : id;
      if (nextDrawerId !== openDrawerId) {
        setActiveDrawerId(nextDrawerId);
        fireNonCancelableEvent(onDrawerChange, { activeDrawerId: nextDrawerId });
      }
      if (moveFocus) {
        pendingFocus.current = id !== null ? 'panel-close' : activePanelId ? { trigger: activePanelId } : null;
      }
    };

    const geometry = useLayoutGeometry(rootRef, {
      headerSelector,
      footerSelector,
      onMobileChange: isMobile => {
        if (!isMobile) {
          return;
        }
        if (hasNavigation && navigationOpen) {
          changeNavigation(false, false);
        }
        if (activePanelId) {
          changePanel(null, false);
        }
      },
    });
    const { isMobile } = geometry;
    const toolbarVisible = isMobile || variant === 'toolbar';
    const overlayOpen = isMobile && ((hasNavigation && navigationOpen) || activePanel !== undefined);

    // The side split panel may take the content's width beyond its minimum, so the space it can use is
    // the content column plus whatever the panel already takes.
    useResizeObserver(mainRef, () =>
      setContentAreaWidth((mainRef.current?.offsetWidth ?? 0) + (splitPanelSideRef.current?.offsetWidth ?? 0))
    );

    useEffect(() => {
      const target = pendingFocus.current;
      if (!target) {
        return;
      }
      pendingFocus.current = null;
      if (target === 'navigation-toggle') {
        navigationToggleRef.current?.focus();
      } else if (target === 'navigation-close') {
        navigationCloseRef.current?.focus();
      } else if (target === 'panel-close') {
        panelCloseRef.current?.focus();
      } else {
        triggerRefs.current.get(target.trigger)?.focus();
      }
    });

    useImperativeHandle(ref, () => ({
      openTools: () => {
        if (!hasTools) {
          return;
        }
        if (activePanelId === toolsDrawerId) {
          panelCloseRef.current?.focus();
        } else {
          changePanel(toolsDrawerId, true);
        }
      },
      closeNavigationIfNecessary: () => {
        if (isMobile && hasNavigation && navigationOpen) {
          changeNavigation(false, false);
        }
      },
      focusToolsClose: () => {
        if (activePanelId === toolsDrawerId) {
          panelCloseRef.current?.focus();
        }
      },
    }));

    const triggerRef = (id: string) => (button: ButtonProps.Ref | null) => {
      if (button) {
        triggerRefs.current.set(id, button);
      } else {
        triggerRefs.current.delete(id);
      }
    };

    // Until the layout is measured, the side position counts as available and sizes are not limited.
    const sideMaxSize = contentAreaWidth - minContentWidth;
    const isSidePositionUnavailable = isMobile || (contentAreaWidth > 0 && sideMaxSize < splitPanelLimits.side.minSize);
    const splitPanelPosition = isSidePositionUnavailable ? 'bottom' : splitPanelPreferences.position;
    const limits = splitPanelLimits[splitPanelPosition];
    const availableHeight = disableBodyScroll
      ? geometry.height - (toolbarVisible ? toolbarHeight : 0)
      : geometry.viewportHeight - geometry.headerHeight - geometry.footerHeight - (toolbarVisible ? toolbarHeight : 0);
    const requestedSplitPanelSize = splitPanelSizeProp ?? splitPanelSizes[splitPanelPosition];
    let splitPanelMaxSize: number;
    if (splitPanelPosition === 'side') {
      splitPanelMaxSize = contentAreaWidth > 0 ? sideMaxSize : requestedSplitPanelSize;
    } else {
      splitPanelMaxSize = availableHeight > 0 ? availableHeight - minContentHeight : requestedSplitPanelSize;
    }
    const splitPanelContext: SplitPanelContextValue = {
      position: splitPanelPosition,
      isOpen: splitPanelOpen,
      size: clampSize(requestedSplitPanelSize, limits.minSize, splitPanelMaxSize),
      minSize: limits.minSize,
      maxSize: Math.max(limits.minSize, splitPanelMaxSize),
      isSidePositionUnavailable,
      pendingFocusRef: splitPanelPendingFocus,
      onToggle: () => {
        setSplitPanelOpen(!splitPanelOpen);
        fireNonCancelableEvent(onSplitPanelToggle, { open: !splitPanelOpen });
      },
      onResize: size => {
        setSplitPanelSizes(current => ({ ...current, [splitPanelPosition]: size }));
        fireNonCancelableEvent(onSplitPanelResize, { size });
      },
      onPreferencesChange: preferences => {
        setSplitPanelPreferences(preferences);
        fireNonCancelableEvent(onSplitPanelPreferencesChange, preferences);
      },
    };

    const activePanelSize = activePanel?.size ?? 0;
    const panelMaxSize = Math.max(
      minDrawerSize,
      contentAreaWidth > 0 ? contentAreaWidth + activePanelSize - minContentWidth : activePanelSize
    );
    const resizeActivePanel = (size: number) => {
      if (!activePanel || activePanel.id === toolsDrawerId) {
        return;
      }
      setDrawerSizes(current => ({ ...current, [activePanel.id]: size }));
      const drawer = drawers.find(item => item.id === activePanel.id);
      fireNonCancelableEvent(drawer?.onResize, { id: activePanel.id, size });
    };

    const panelTop = disableBodyScroll ? 0 : geometry.headerHeight + (toolbarVisible ? toolbarHeight : 0);
    const rootStyle = {
      '--ord-app-layout-header-offset': `${disableBodyScroll ? 0 : geometry.headerHeight}px`,
      '--ord-app-layout-footer-offset': `${disableBodyScroll ? 0 : geometry.footerHeight}px`,
      '--ord-app-layout-panel-top': `${panelTop}px`,
      '--ord-app-layout-min-content-width': `${minContentWidth}px`,
    } as React.CSSProperties;

    const effectiveMaxContentWidth = maxContentWidth ?? defaults.maxContentWidth;

    return (
      <div
        {...rest}
        ref={rootRef}
        className={clsx(
          styles.root,
          isMobile && styles.mobile,
          disableBodyScroll && styles['disable-body-scroll'],
          variant === 'toolbar' && styles['variant-toolbar']
        )}
        style={rootStyle}
      >
        {toolbarVisible && (
          <div ref={toolbarRef} className={styles.toolbar} inert={overlayOpen}>
            <InternalAppLayoutToolbar
              breadcrumbs={breadcrumbs}
              navigationHide={!hasNavigation}
              navigationOpen={navigationOpen}
              onNavigationChange={event => changeNavigation(event.detail.open, true)}
              drawers={panels.map(panel => ({
                id: panel.id,
                ariaLabel: panel.triggerLabel,
                iconName: panel.iconName,
                iconSvg: panel.iconSvg,
                badge: panel.badge,
              }))}
              activeDrawerId={activePanelId}
              onDrawerChange={event => changePanel(event.detail.activeDrawerId, true)}
              ariaLabels={{
                navigationToggle: i18n('navigationToggle', ariaLabels?.navigationToggle),
                navigationClose: i18n('navigationClose', ariaLabels?.navigationClose),
                drawers: i18n('drawers', ariaLabels?.drawers),
              }}
              navigationToggleRef={navigationToggleRef}
              drawerTriggerRef={triggerRef}
              navigationControlsId={navigationOpen ? navigationId : undefined}
              drawerControlsId={panelId}
            />
          </div>
        )}

        {hasNavigation && (
          <NavigationPanel
            id={navigationId}
            open={navigationOpen}
            width={navigationWidth}
            ariaLabel={i18n('navigation', ariaLabels?.navigation)}
            closeLabel={i18n('navigationClose', ariaLabels?.navigationClose)}
            showCloseButton={!toolbarVisible || isMobile}
            closeButtonRef={navigationCloseRef}
            overlay={isMobile}
            onClose={() => changeNavigation(false, true)}
          >
            {navigation}
          </NavigationPanel>
        )}
        {hasNavigation && !navigationOpen && !toolbarVisible && (
          <NavigationRail
            label={i18n('navigationToggle', ariaLabels?.navigationToggle)}
            toggleRef={navigationToggleRef}
            onOpen={() => changeNavigation(true, true)}
          />
        )}

        <main ref={mainRef} className={styles.main} inert={overlayOpen}>
          {notifications && (
            <div
              role="region"
              aria-label={i18n('notifications', ariaLabels?.notifications)}
              className={clsx(styles.notifications, stickyNotifications && styles['sticky-notifications'])}
            >
              {notifications}
            </div>
          )}
          {breadcrumbs && !toolbarVisible && <div className={styles.breadcrumbs}>{breadcrumbs}</div>}
          <div
            className={clsx(
              styles.sheet,
              disableContentPaddings && styles['no-paddings'],
              (notifications || (breadcrumbs && !toolbarVisible)) && styles['sheet-below-frame'],
              hasNavigation && !isMobile && styles['sheet-after-navigation']
            )}
          >
            <div
              className={styles.content}
              style={effectiveMaxContentWidth === undefined ? undefined : { maxInlineSize: effectiveMaxContentWidth }}
            >
              {content}
            </div>
          </div>
        </main>

        {splitPanel && (
          <SplitPanelContext.Provider value={splitPanelContext}>
            {splitPanelPosition === 'side' ? (
              <div ref={splitPanelSideRef} className={styles['split-panel-side']}>
                {splitPanel}
              </div>
            ) : (
              <div className={styles['split-panel-bottom']} inert={overlayOpen}>
                {splitPanel}
              </div>
            )}
          </SplitPanelContext.Provider>
        )}

        {activePanel && (
          <ActivePanel
            id={panelId}
            panel={activePanel}
            minSize={minDrawerSize}
            maxSize={panelMaxSize}
            closeButtonRef={panelCloseRef}
            overlay={isMobile}
            onClose={() => changePanel(null, true)}
            onResize={resizeActivePanel}
          />
        )}
        {panels.length > 0 && !toolbarVisible && (
          <PanelRail
            panels={panels}
            activePanelId={activePanelId}
            panelElementId={panelId}
            triggerRef={triggerRef}
            onChange={id => changePanel(id, true)}
          />
        )}
      </div>
    );
  }
);
