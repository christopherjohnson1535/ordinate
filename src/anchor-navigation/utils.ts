// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AnchorNavigationProps } from './interfaces';

export interface AnchorNode {
  anchor: AnchorNavigationProps.Anchor;
  children: AnchorNode[];
}

/**
 * Nests the flat list of anchors by level: an anchor goes under the closest earlier anchor with a
 * lower level. A jump of several levels nests only one step deeper, so no list is left empty.
 */
export function buildAnchorTree(anchors: ReadonlyArray<AnchorNavigationProps.Anchor>): AnchorNode[] {
  const roots: AnchorNode[] = [];
  const open: AnchorNode[] = [];
  for (const anchor of anchors) {
    const node: AnchorNode = { anchor, children: [] };
    while (open.length > 0 && open[open.length - 1].anchor.level >= anchor.level) {
      open.pop();
    }
    const parent = open[open.length - 1];
    (parent ? parent.children : roots).push(node);
    open.push(node);
  }
  return roots;
}

/**
 * The element an in-page link points at, or null when the link is not a fragment link.
 */
export function getAnchorTarget(href: string): HTMLElement | null {
  if (!href.startsWith('#') || href.length < 2) {
    return null;
  }
  try {
    return document.getElementById(decodeURIComponent(href.slice(1)));
  } catch {
    return null;
  }
}

export function toFollowDetail({
  text,
  href,
  level,
}: AnchorNavigationProps.Anchor): AnchorNavigationProps.FollowDetail {
  return { text, href, level };
}
