// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events';
import { isPlainLeftClick } from '../internal/link-click';
import { AnchorNavigationProps } from './interfaces';
import { useScrollSpy } from './use-scroll-spy';
import { AnchorNode, buildAnchorTree, toFollowDetail } from './utils';

import styles from './styles.css.js';

function AnchorList({
  nodes,
  activeHref,
  onFollow,
  nested = false,
}: {
  nodes: ReadonlyArray<AnchorNode>;
  activeHref: string | undefined;
  onFollow: (event: React.MouseEvent, anchor: AnchorNavigationProps.Anchor) => void;
  nested?: boolean;
}) {
  return (
    <ol className={clsx(styles.list, nested && styles['list-nested'])}>
      {nodes.map(({ anchor, children }, index) => {
        const active = anchor.href === activeHref;
        return (
          <li key={`${anchor.href}-${index}`} className={styles.item}>
            <div className={styles['link-row']}>
              <a
                className={clsx(styles.link, active && styles['link-active'])}
                href={anchor.href}
                aria-current={active ? 'true' : undefined}
                onClick={event => {
                  if (isPlainLeftClick(event)) {
                    onFollow(event, anchor);
                  }
                }}
              >
                {anchor.text}
              </a>
              {anchor.info && <span className={styles.info}>{anchor.info}</span>}
            </div>
            {children.length > 0 && (
              <AnchorList nodes={children} activeHref={activeHref} onFollow={onFollow} nested={true} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function InternalAnchorNavigation({
  anchors,
  activeHref: controlledActiveHref,
  scrollSpyOffset = 0,
  onFollow,
  onActiveHrefChange,
  ariaLabelledby,
  ...rest
}: AnchorNavigationProps) {
  const isControlled = controlledActiveHref !== undefined;
  const [trackedHref, setTrackedHref] = useScrollSpy(
    anchors.map(anchor => anchor.href),
    scrollSpyOffset,
    !isControlled
  );
  const activeHref = isControlled ? controlledActiveHref : trackedHref;

  const reportedHref = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (isControlled || trackedHref === undefined || trackedHref === reportedHref.current) {
      return;
    }
    reportedHref.current = trackedHref;
    const anchor = anchors.find(candidate => candidate.href === trackedHref);
    if (anchor) {
      fireNonCancelableEvent(onActiveHrefChange, toFollowDetail(anchor));
    }
  });

  const follow = (event: React.MouseEvent, anchor: AnchorNavigationProps.Anchor) => {
    const cancelled = fireCancelableEvent(onFollow, toFollowDetail(anchor), event);
    // A section near the end of the page may never scroll up to the line, so mark it right away.
    if (!cancelled && !isControlled) {
      setTrackedHref(anchor.href);
    }
  };

  return (
    <nav {...rest} className={styles.root} aria-labelledby={ariaLabelledby}>
      <AnchorList nodes={buildAnchorTree(anchors)} activeHref={activeHref} onFollow={follow} />
    </nav>
  );
}
