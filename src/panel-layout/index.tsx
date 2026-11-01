// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { PanelLayoutProps } from './interfaces';
import { InternalPanelLayout } from './internal';

export type { PanelLayoutProps };

const PanelLayout = React.forwardRef(
  (
    {
      panelContent,
      mainContent,
      panelPosition = 'side-start',
      panelSize,
      defaultPanelSize,
      minPanelSize,
      maxPanelSize,
      resizable = false,
      display = 'all',
      panelFocusable,
      mainFocusable,
      i18nStrings,
      onPanelResize,
      ...props
    }: PanelLayoutProps,
    ref: React.Ref<PanelLayoutProps.Ref>
  ) => (
    <InternalPanelLayout
      {...getBaseProps(props)}
      ref={ref}
      panelContent={panelContent}
      mainContent={mainContent}
      panelPosition={panelPosition}
      panelSize={panelSize}
      defaultPanelSize={defaultPanelSize}
      minPanelSize={minPanelSize}
      maxPanelSize={maxPanelSize}
      resizable={resizable}
      display={display}
      panelFocusable={panelFocusable}
      mainFocusable={mainFocusable}
      i18nStrings={i18nStrings}
      onPanelResize={onPanelResize}
    />
  )
);

PanelLayout.displayName = 'PanelLayout';

export default PanelLayout;
