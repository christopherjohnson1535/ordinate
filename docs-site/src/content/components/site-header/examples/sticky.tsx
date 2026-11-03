// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Section from '@ordinate/components/section';
import SiteHeader from '@ordinate/components/site-header';
import StyleScope from '@ordinate/components/style-scope';
import TextContent from '@ordinate/components/text-content';

const notes = [
  { heading: 'The first frost', text: 'The dahlias went black overnight, and by ten the whole row had been lifted.' },
  { heading: 'Sweet peas in October', text: 'Plot 14 is trying an autumn sowing for the first time.' },
  { heading: 'Leek and potato soup', text: 'With the last of the parsley, for the end of a cold day on the plots.' },
];

export default function Sticky() {
  return (
    <StyleScope styleName="editorial">
      <SiteHeader
        sticky={true}
        brand={{ name: 'The Plot', href: '#/components/site-header' }}
        links={[
          { text: 'Essays', href: '#/components/site-header' },
          { text: 'Field notes', href: '#/components/site-header', current: true },
          { text: 'Recipes', href: '#/components/site-header' },
          { text: 'Archive', href: '#/components/site-header' },
        ]}
      />
      {notes.map(note => (
        <Section key={note.heading} rule="bottom" width="narrow" heading={note.heading}>
          <TextContent>
            <p>{note.text}</p>
          </TextContent>
        </Section>
      ))}
    </StyleScope>
  );
}
