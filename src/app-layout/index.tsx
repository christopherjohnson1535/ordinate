// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { AppLayoutProps } from './interfaces';
import { InternalAppLayout } from './internal';

export type { AppLayoutProps };

const AppLayout = React.forwardRef(
  (
    {
      content,
      titleBlock,
      contentType = 'default',
      variant = 'default',
      navigation,
      navigationOpen,
      onNavigationChange,
      navigationHide = false,
      navigationWidth,
      breadcrumbs,
      notifications,
      notificationsPosition = 'margin',
      stickyNotifications = false,
      tools,
      toolsOpen,
      onToolsChange,
      toolsHide = false,
      toolsWidth,
      splitPanel,
      splitPanelOpen,
      onSplitPanelToggle,
      splitPanelSize,
      onSplitPanelResize,
      splitPanelPreferences,
      onSplitPanelPreferencesChange,
      drawers,
      activeDrawerId,
      onDrawerChange,
      headerSelector,
      footerSelector,
      disableBodyScroll = false,
      maxContentWidth,
      minContentWidth,
      disableContentPaddings = false,
      ariaLabels,
      ...props
    }: AppLayoutProps,
    ref: React.Ref<AppLayoutProps.Ref>
  ) => (
    <InternalAppLayout
      {...getBaseProps(props)}
      ref={ref}
      content={content}
      titleBlock={titleBlock}
      contentType={contentType}
      variant={variant}
      navigation={navigation}
      navigationOpen={navigationOpen}
      onNavigationChange={onNavigationChange}
      navigationHide={navigationHide}
      navigationWidth={navigationWidth}
      breadcrumbs={breadcrumbs}
      notifications={notifications}
      notificationsPosition={notificationsPosition}
      stickyNotifications={stickyNotifications}
      tools={tools}
      toolsOpen={toolsOpen}
      onToolsChange={onToolsChange}
      toolsHide={toolsHide}
      toolsWidth={toolsWidth}
      splitPanel={splitPanel}
      splitPanelOpen={splitPanelOpen}
      onSplitPanelToggle={onSplitPanelToggle}
      splitPanelSize={splitPanelSize}
      onSplitPanelResize={onSplitPanelResize}
      splitPanelPreferences={splitPanelPreferences}
      onSplitPanelPreferencesChange={onSplitPanelPreferencesChange}
      drawers={drawers}
      activeDrawerId={activeDrawerId}
      onDrawerChange={onDrawerChange}
      headerSelector={headerSelector}
      footerSelector={footerSelector}
      disableBodyScroll={disableBodyScroll}
      maxContentWidth={maxContentWidth}
      minContentWidth={minContentWidth}
      disableContentPaddings={disableContentPaddings}
      ariaLabels={ariaLabels}
    />
  )
);

AppLayout.displayName = 'AppLayout';

export default AppLayout;
