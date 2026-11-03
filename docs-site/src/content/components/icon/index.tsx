// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Icon',
  folder: 'icon',
  group: 'icons',
  summary: 'Draws one of the built-in icons, or your own, in the line weight of the drawing.',
  description: (
    <>
      <p>
        Icons are open strokes on a 16 by 16 grid, drawn in the current text color. The stroke keeps the same weight at
        every size, as lines do on a drawing, so a large icon is not heavier than a small one. Icons that point along
        the reading direction, such as arrows and chevrons, are mirrored in right-to-left pages.
      </p>
      <p>
        Each icon is named for what it means in Ordinate, in plain words: <code>complete</code>, <code>caution</code>,{' '}
        <code>open-outside</code>. See <a href="#/foundations/icons">Icons</a> for every name. Older names still work,
        with a console warning, until the next major version.
      </p>
    </>
  ),
  examples: [
    {
      id: 'basic',
      title: 'Icons beside text',
      description: (
        <p>
          An icon next to words that say the same thing is decorative: leave out <code>ariaLabel</code> and it is hidden
          from screen readers.
        </p>
      ),
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: (
        <p>
          <code>normal</code> matches body text. <code>inherit</code> follows the font size around it, for icons in
          headings. The line weight stays the same at every size.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'variants',
      title: 'Colors',
      description: (
        <p>
          <code>variant</code> colors the icon for its meaning. Put the meaning in words too: color alone does not reach
          everyone.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'custom-svg',
      title: 'Your own icon',
      description: (
        <p>
          Pass an <code>svg</code> drawn on a 16 by 16 grid with <code>stroke="currentColor"</code> and no fill, and it
          takes the size, color and line weight of the built-in icons. Give solid parts <code>className="filled"</code>.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'Beside a label, to help the eye find an action or a state.',
      'Alone, in a small space, when the icon is one people know and it has an accessible name.',
    ],
    avoid: [
      <>
        For a state on its own. Use a <a href="#/components/status-indicator">StatusIndicator</a>, which pairs the icon
        with words.
      </>,
      <>
        As a clickable control. Use a <a href="#/components/button">Button</a> with <code>variant="icon"</code>.
      </>,
      <>
        Replacing one icon everywhere by passing <code>svg</code> to each one. Use an{' '}
        <a href="#/components/icon-provider">IconProvider</a>.
      </>,
      'Icons that mean the same thing in two places drawn differently, or one icon used for two meanings.',
    ],
    writing: ['Name what the icon stands for, not what it shows: "Complete", not "Check mark".'],
  },
  accessibility: [
    <>
      Without <code>ariaLabel</code> the icon is <code>aria-hidden</code>. With it, the icon has <code>role="img"</code>{' '}
      and the label as its name.
    </>,
    'Give an icon a name only when it carries meaning that the text around it does not.',
    'The icon takes the color of the text around it, so it keeps the contrast of that text in both color modes.',
  ],
  related: ['icon-provider', 'button', 'status-indicator'],
};

export default doc;
