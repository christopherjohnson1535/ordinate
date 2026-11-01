// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useContainerWidth } from '../internal/hooks/use-container-width';
import { useInternalI18n } from '../internal/i18n/context';
import { PanelLayoutProps } from './interfaces';
import { ResizeHandle } from './resize-handle';
import { usePanelSize } from './use-panel-size';

import styles from './styles.css.js';

const fallbackPanelSize = 240;

function focusableAttributes(focusable: PanelLayoutProps.Focusable | undefined) {
  if (!focusable) {
    return {};
  }
  return {
    tabIndex: 0,
    role: 'region',
    'aria-label': focusable.ariaLabel,
    'aria-labelledby': focusable.ariaLabelledby,
  };
}

export const InternalPanelLayout = React.forwardRef(
  (
    {
      panelContent,
      mainContent,
      panelPosition = 'side-start',
      panelSize,
      defaultPanelSize = fallbackPanelSize,
      minPanelSize = 0,
      maxPanelSize,
      resizable = false,
      display = 'all',
      panelFocusable,
      mainFocusable,
      i18nStrings,
      onPanelResize,
      ...rest
    }: PanelLayoutProps,
    ref: React.Ref<PanelLayoutProps.Ref>
  ) => {
    const i18n = useInternalI18n('panel-layout');
    const rootRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const panelId = useId();
    useImperativeHandle(ref, () => ({ focusResizeHandle: () => handleRef.current?.focus() }));

    const containerWidth = useContainerWidth(rootRef);
    const size = usePanelSize({
      panelSize,
      defaultPanelSize,
      minPanelSize,
      maxPanelSize,
      containerWidth,
      onPanelResize,
    });

    const showPanel = display !== 'main-only';
    const showMain = display !== 'panel-only';
    const showSeparator = showPanel && showMain;

    const panel = showPanel && (
      <div key="panel" id={panelId} className={styles.panel} {...focusableAttributes(panelFocusable)}>
        {panelContent}
      </div>
    );
    const separator =
      showSeparator &&
      (resizable ? (
        <ResizeHandle
          key="separator"
          handleRef={handleRef}
          panelId={panelId}
          panelPosition={panelPosition}
          panelSize={size}
          ariaLabel={i18n('resizeHandleAriaLabel', i18nStrings?.resizeHandleAriaLabel)}
        />
      ) : (
        <div key="separator" className={styles.divider} />
      ));
    const main = showMain && (
      <div key="main" className={styles.main} {...focusableAttributes(mainFocusable)}>
        {mainContent}
      </div>
    );

    return (
      <div
        {...rest}
        ref={rootRef}
        className={clsx(styles.root, styles[`display-${display}`])}
        style={{ '--panel-size': `${size.size}px` } as React.CSSProperties}
      >
        {panelPosition === 'side-start' ? [panel, separator, main] : [main, separator, panel]}
      </div>
    );
  }
);
