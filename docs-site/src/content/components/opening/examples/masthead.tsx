// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Opening, { OpeningProps } from '@ordinate/components/opening';
import StyleScope from '@ordinate/components/style-scope';

const sections = [
  { text: 'Essays', href: 'https://example.com/essays' },
  { text: 'Field notes', href: 'https://example.com/notes' },
  { text: 'Recipes', href: 'https://example.com/recipes' },
  { text: 'Archive', href: 'https://example.com/archive' },
];

export default function Masthead() {
  const [current, setCurrent] = useState('https://example.com/essays');

  const links: OpeningProps.Link[] = sections.map(link => ({ ...link, current: link.href === current }));

  return (
    <StyleScope styleName="editorial">
      <Opening
        variant="masthead"
        meta={
          <>
            <span>Vol. 3 · No. 14</span>
            <span>Autumn 2026</span>
          </>
        }
        title="The Allotment"
        description="A quarterly journal of small gardens, the people who keep them and what they cook at the end of the day."
        links={links}
        navigationAriaLabel="Journal sections"
        onFollow={event => {
          // A router would show the section here instead of loading a new page.
          event.preventDefault();
          setCurrent(event.detail.href);
        }}
      />
    </StyleScope>
  );
}
