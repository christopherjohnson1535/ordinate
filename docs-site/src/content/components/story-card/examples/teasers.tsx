// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Media from '@ordinate/components/media';
import StoryCard from '@ordinate/components/story-card';
import StyleScope from '@ordinate/components/style-scope';

// Stand-ins for photographs, drawn inline so the example needs no network.
const picture = (body: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">${body}</svg>`
  )}`;

const stories = [
  {
    slug: 'bread',
    kicker: 'Food',
    title: 'Bread, the slow way',
    summary: 'A bakery on the hill proves its dough for two days, and the queue starts at seven.',
    meta: 'Ines Moreau · 5 min read',
    src: picture(
      `<rect width="1200" height="800" fill="#efe7da"/><rect y="560" width="1200" height="240" fill="#b98f62"/>
       <ellipse cx="420" cy="520" rx="230" ry="110" fill="#8a5a33"/><ellipse cx="820" cy="530" rx="200" ry="95" fill="#a36d3f"/>`
    ),
  },
  {
    slug: 'tide',
    kicker: 'Field notes',
    title: 'What the tide leaves behind',
    summary: 'A morning on the mudflats with the people who count the birds.',
    meta: 'Lena Ortiz · 6 min read',
    src: picture(
      `<rect width="1200" height="800" fill="#dfe5ea"/><rect y="460" width="1200" height="340" fill="#a7a08f"/>
       <path d="M0 520 C 300 480 700 560 1200 500" stroke="#7d93a6" stroke-width="40" fill="none"/>`
    ),
  },
  {
    slug: 'sail',
    kicker: 'Interview',
    title: 'The last sail maker on the east quay',
    summary: 'Forty years of canvas, thread and weather.',
    meta: 'Tomás Reyes · 9 min read',
    src: picture(
      `<rect width="1200" height="800" fill="#e8e1d4"/><path d="M600 120 L600 680 L260 680 Z" fill="#c9b79c"/>
       <path d="M630 180 L630 680 L900 680 Z" fill="#9a5b3c"/><rect y="680" width="1200" height="120" fill="#5f7689"/>`
    ),
  },
];

export default function Teasers() {
  return (
    <StyleScope styleName="editorial">
      <ColumnLayout columns={3} minColumnWidth={180}>
        {stories.map(story => (
          <StoryCard
            key={story.slug}
            href={`https://example.com/stories/${story.slug}`}
            media={<Media src={story.src} alt="" aspectRatio="3:2" />}
            kicker={story.kicker}
            title={story.title}
            summary={story.summary}
            meta={story.meta}
          />
        ))}
      </ColumnLayout>
    </StyleScope>
  );
}
