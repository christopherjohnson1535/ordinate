// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import AnchorNavigation, { AnchorNavigationProps } from '@ordinate/components/anchor-navigation';
import Header from '@ordinate/components/header';

import { goToAnchor } from '../app/router';

import styles from './page-frame.module.scss';

// Sections mark their headings with data-anchor (the label) and data-anchor-level, and the frame
// lists them in "On this sheet". Reading them from the page keeps the list right when a section is
// added, removed or loads late.
function readAnchors(root: HTMLElement): AnchorNavigationProps.Anchor[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-anchor][id]')).map(element => ({
    text: element.dataset.anchor ?? element.textContent ?? '',
    href: `#${element.id}`,
    level: Number(element.dataset.anchorLevel ?? 1),
  }));
}

const sameAnchors = (a: AnchorNavigationProps.Anchor[], b: AnchorNavigationProps.Anchor[]) =>
  a.length === b.length && a.every((anchor, index) => anchor.href === b[index].href && anchor.text === b[index].text);

function useAnchors(root: React.RefObject<HTMLElement | null>) {
  const [anchors, setAnchors] = useState<AnchorNavigationProps.Anchor[]>([]);
  useEffect(() => {
    const element = root.current;
    if (!element) {
      return;
    }
    const update = () => {
      const next = readAnchors(element);
      setAnchors(current => (sameAnchors(current, next) ? current : next));
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(element, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [root]);
  return anchors;
}

export interface PageFrameProps {
  /** The sheet number, such as `C-014`, set above the title. */
  code: string;
  title: string;
  description?: React.ReactNode;
  /** Content between the title and the first section, such as the import line or badges. */
  lead?: React.ReactNode;
  /** Hides "On this sheet", for pages that are one long drawing. */
  hideAnchors?: boolean;
  children: React.ReactNode;
}

/** The frame of every page: the title with its sheet number, the sections, and "On this sheet". */
export function PageFrame({ code, title, description, lead, hideAnchors = false, children }: PageFrameProps) {
  const body = useRef<HTMLDivElement>(null);
  const anchors = useAnchors(body);
  const showAnchors = !hideAnchors && anchors.length > 1;

  return (
    <div className={showAnchors ? `${styles.page} ${styles['with-anchors']}` : styles.page}>
      <div className={styles.main}>
        <div className={styles.head}>
          <Header variant="h1" code={`Sheet ${code}`} description={description}>
            {title}
          </Header>
          {lead && <div className={styles.lead}>{lead}</div>}
        </div>
        <div ref={body} className={styles.body}>
          {children}
        </div>
      </div>
      {showAnchors && (
        <nav className={styles.anchors} aria-labelledby="on-this-sheet">
          <h2 id="on-this-sheet" className={styles['anchors-title']}>
            On this sheet
          </h2>
          <AnchorNavigation
            ariaLabelledby="on-this-sheet"
            anchors={anchors}
            scrollSpyOffset={120}
            onFollow={event => {
              event.preventDefault();
              goToAnchor(event.detail.href.replace(/^#/, ''));
            }}
          />
        </nav>
      )}
    </div>
  );
}
