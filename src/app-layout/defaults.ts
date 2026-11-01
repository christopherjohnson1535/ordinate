// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AppLayoutProps } from './interfaces';

/**
 * Below this width the side panels cover the content instead of sitting beside it.
 */
export const mobileBreakpoint = 688;

export const defaultNavigationWidth = 280;
export const defaultToolsWidth = 290;
export const defaultMinContentWidth = 280;

export const splitPanelLimits = {
  bottom: { defaultSize: 240, minSize: 160 },
  side: { defaultSize: 360, minSize: 280 },
};

// The bottom split panel always leaves at least this much of the content in view.
export const minContentHeight = 160;

export const minDrawerSize = 240;

export const notesMarginWidth = 320;
// Notifications move into the margin only when the sheet beside them keeps at least this width.
export const minSheetWidthBesideNotes = 640;

/**
 * The help panel shares its place with the drawers under this ID.
 */
export const toolsDrawerId = 'ord-app-layout-tools';

interface ContentTypeDefaults {
  maxContentWidth: number | undefined;
  navigationOpen: boolean;
  toolsOpen: boolean;
}

const contentTypeDefaults: Record<AppLayoutProps.ContentType, ContentTypeDefaults> = {
  default: { maxContentWidth: 1280, navigationOpen: true, toolsOpen: false },
  table: { maxContentWidth: undefined, navigationOpen: true, toolsOpen: false },
  cards: { maxContentWidth: undefined, navigationOpen: true, toolsOpen: false },
  dashboard: { maxContentWidth: undefined, navigationOpen: true, toolsOpen: false },
  form: { maxContentWidth: 800, navigationOpen: false, toolsOpen: true },
  wizard: { maxContentWidth: 1080, navigationOpen: false, toolsOpen: true },
};

export function getContentTypeDefaults(contentType: AppLayoutProps.ContentType): ContentTypeDefaults {
  return contentTypeDefaults[contentType] ?? contentTypeDefaults.default;
}
