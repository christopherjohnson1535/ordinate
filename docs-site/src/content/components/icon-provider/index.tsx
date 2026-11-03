// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'IconProvider',
  folder: 'icon-provider',
  group: 'icons',
  summary: 'Replaces built-in icons by name for every component inside it.',
  description: (
    <>
      <p>
        IconProvider renders nothing of its own. Every <a href="#/components/icon">Icon</a> inside it, including the
        icons that other components draw, such as a Button’s icon or a DatePicker’s calendar, looks up its name in{' '}
        <code>icons</code> first and draws your replacement when there is one.
      </p>
      <p>
        Providers nest: an inner provider adds to the replacements of the outer one. Set an icon to <code>null</code> to
        hide it, or pass <code>icons={'{null}'}</code> to bring back the built-in icons for one part of the page.
        Replacements written with an icon’s old name still apply after it was renamed.
      </p>
    </>
  ),
  examples: [
    {
      id: 'replace',
      title: 'Replace an icon',
      description: (
        <p>
          Draw the replacement on a 16 by 16 grid with <code>stroke="currentColor"</code>, so it takes the size, color
          and line weight of the icon it replaces, wherever that icon appears.
        </p>
      ),
    },
    {
      id: 'nested',
      title: 'Nested providers',
      description: (
        <p>
          An inner provider keeps the outer replacements and adds its own. <code>icons={'{null}'}</code> restores the
          built-in icons inside it.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To match an icon to your product’s own meaning, everywhere it appears, including inside other components.',
      'To swap an icon for one part of the page only, such as a tool with its own vocabulary.',
    ],
    avoid: [
      <>
        For a single icon in one place. Pass <code>svg</code> to that <a href="#/components/icon">Icon</a>.
      </>,
      'Replacing an icon with a drawing that means something else. Other components rely on what each name means.',
      'Hiding icons that carry a state, such as fault or caution, without putting that meaning in words.',
    ],
  },
  accessibility: [
    'Replacements take the accessible name that the component gives the icon, so a replaced icon is read the same way as the built-in one.',
    'Give the SVG aria-hidden and focusable="false"; the name comes from the Icon around it.',
  ],
  related: ['icon', 'button'],
  testing: false,
};

export default doc;
