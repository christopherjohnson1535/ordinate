// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import AnchorNavigation, { AnchorNavigationProps } from '@ordinate/components/anchor-navigation';
import Box from '@ordinate/components/box';
import Grid from '@ordinate/components/grid';

const anchors: AnchorNavigationProps.Anchor[] = [
  { text: 'Scope of work', href: '#an-panel-scope', level: 1 },
  { text: 'Site and access', href: '#an-panel-site', level: 1 },
  { text: 'Deliveries', href: '#an-panel-deliveries', level: 2 },
  { text: 'Programme', href: '#an-panel-programme', level: 1 },
  { text: 'Handover', href: '#an-panel-handover', level: 1 },
];

const text =
  'The contractor keeps the north annex open to staff throughout. Work that makes noise is done before 10:00 or after 16:00, and every route through the site is kept clear for the fire brigade. Dana Ruiz approves any change to the hours in writing.';

const sectionOf = (anchor: AnchorNavigationProps.Anchor) => document.getElementById(anchor.href.slice(1));

export default function ScrollingPanel() {
  const panel = useRef<HTMLDivElement>(null);
  const [activeHref, setActiveHref] = useState(anchors[0].href);
  // A followed anchor stays marked through the scroll it causes, even when its section cannot reach the top.
  const following = useRef(false);

  // The built-in scroll spy follows the window. This panel scrolls on its own, so it marks the
  // last section whose heading has reached the top of the panel.
  const onScroll = () => {
    const box = panel.current;
    if (!box || following.current) {
      following.current = false;
      return;
    }
    const top = box.getBoundingClientRect().top;
    const atEnd = box.scrollTop + box.clientHeight >= box.scrollHeight - 1;
    const reached = anchors.filter(anchor => (sectionOf(anchor)?.getBoundingClientRect().top ?? Infinity) - top <= 8);
    setActiveHref(atEnd ? anchors[anchors.length - 1].href : (reached.pop() ?? anchors[0]).href);
  };

  const scrollTo = (anchor: AnchorNavigationProps.Anchor) => {
    const box = panel.current;
    const section = sectionOf(anchor);
    if (box && section) {
      const before = box.scrollTop;
      box.scrollTop += section.getBoundingClientRect().top - box.getBoundingClientRect().top;
      following.current = box.scrollTop !== before;
      // Keyboard users carry on reading from the section they jumped to.
      section.parentElement?.focus({ preventScroll: true });
    }
    setActiveHref(anchor.href);
  };

  return (
    <Grid gridDefinition={[{ colspan: { default: 12, xs: 4 } }, { colspan: { default: 12, xs: 8 } }]}>
      <div>
        <Box variant="h4" id="an-panel-title">
          On this sheet
        </Box>
        <AnchorNavigation
          anchors={anchors}
          activeHref={activeHref}
          ariaLabelledby="an-panel-title"
          onFollow={event => {
            event.preventDefault();
            const anchor = anchors.find(candidate => candidate.href === event.detail.href);
            if (anchor) {
              scrollTo(anchor);
            }
          }}
        />
      </div>
      <div
        ref={panel}
        role="region"
        aria-label="Site rules"
        tabIndex={0}
        onScroll={onScroll}
        style={{ blockSize: 260, overflowY: 'auto' }}
      >
        {anchors.map(anchor => (
          <section key={anchor.href} tabIndex={-1}>
            <Box variant={anchor.level === 1 ? 'h3' : 'h4'} id={anchor.href.slice(1)}>
              {anchor.text}
            </Box>
            <Box variant="p">{text}</Box>
          </section>
        ))}
      </div>
    </Grid>
  );
}
