// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import StoryCard from '@ordinate/components/story-card';
import StyleScope from '@ordinate/components/style-scope';

const alsoInThisIssue = [
  {
    slug: 'tide',
    kicker: 'Field notes',
    title: 'What the tide leaves behind',
    summary: 'A morning on the mudflats with the people who count the birds.',
    meta: 'Lena Ortiz · 6 min read',
  },
  {
    slug: 'sail',
    kicker: 'Interview',
    title: 'The last sail maker on the east quay',
    summary: 'Forty years of canvas, thread and weather.',
    meta: 'Tomás Reyes · 9 min read',
  },
  {
    slug: 'walking',
    kicker: 'Essay',
    title: 'On walking slowly',
    summary: 'Why the long way round is sometimes the only way.',
    meta: 'Ada Frost · 4 min read',
  },
];

export default function Numbered() {
  return (
    <StyleScope styleName="editorial">
      <ColumnLayout columns={3}>
        {alsoInThisIssue.map((story, index) => (
          <StoryCard
            key={story.slug}
            variant="ruled"
            href={`https://example.com/stories/${story.slug}`}
            number={String(index + 2).padStart(2, '0')}
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
