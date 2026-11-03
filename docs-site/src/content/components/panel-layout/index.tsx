// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'PanelLayout',
  folder: 'panel-layout',
  group: 'layout',
  summary: 'Splits a region into a side panel and a main pane, with a handle to resize the panel.',
  description: (
    <>
      <p>
        A panel layout puts a panel of fixed width beside a main pane that takes the rest of the width. Each pane
        scrolls on its own. Between them is a hairline rule, or, when <code>resizable</code>, a handle drawn as the
        same rule with a small hinge plate at its middle, which fills with ink while it is dragged.
      </p>
      <p>
        The layout fills the height of its parent, so give the parent a height. The panel never gets wider than the
        layout, so the handle stays in reach.
      </p>
    </>
  ),
  examples: [
    {
      id: 'resizable',
      title: 'Resizable panel',
      description: (
        <p>
          A list beside the selected item. Set <code>panelSize</code> and update it in <code>onPanelResize</code> to
          control the width, or leave both out and the layout keeps it, starting at <code>defaultPanelSize</code>.
        </p>
      ),
      layout: 'flush',
      height: 'short',
    },
    {
      id: 'panel-at-end',
      title: 'Panel at the end',
      description: (
        <p>
          <code>panelPosition="side-end"</code> puts the panel after the main pane, for details of what the main pane
          shows. Name the handle after what it resizes with <code>i18nStrings</code>.
        </p>
      ),
      layout: 'flush',
      height: 'short',
    },
    {
      id: 'display',
      title: 'One pane at a time',
      description: (
        <p>
          <code>display</code> shows both panes, or only one at the full width. Use it on narrow screens to show the
          list, then the item the user picked.
        </p>
      ),
      layout: 'flush',
      height: 'short',
    },
  ],
  guidelines: {
    use: [
      'For a list and the item picked from it, side by side, inside a page.',
      'For an editor or a drawing beside its properties or filters.',
    ],
    avoid: [
      <>
        For the frame of a whole application page. Use an <a href="#/components/app-layout">AppLayout</a>.
      </>,
      <>
        For details of a selected table row in a console. Use a <a href="#/components/split-panel">SplitPanel</a>.
      </>,
    ],
  },
  accessibility: [
    <>
      The resize handle is a <code>separator</code> that can be focused. The arrow keys resize the panel by 10 pixels,
      and Home and End set its smallest and largest size. Its value is the panel width in pixels. Its default name is
      “Resize panel”.
    </>,
    <>
      Panes that scroll must be reachable by keyboard. <code>panelFocusable</code> and <code>mainFocusable</code> make
      a pane focusable and a named region; give each an <code>ariaLabel</code> or <code>ariaLabelledby</code>.
    </>,
    'The panes keep their source order for screen readers: with the panel at the end, it is read after the main pane.',
    'The ref has focusResizeHandle(), to move focus to the handle from a control of your own.',
  ],
  related: ['app-layout', 'split-panel', 'grid'],
};

export default doc;
