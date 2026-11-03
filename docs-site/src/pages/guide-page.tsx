// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { href } from '../app/router';
import { PageFrame } from '../parts/page-frame';
import { PagerLinks } from '../parts/pager';
import { GuideEntry, guides, sheetOf } from '../registry/guides';

export default function GuidePage({ guide }: { guide: GuideEntry }) {
  const index = guides.indexOf(guide);
  const previous = guides[index - 1];
  const next = guides[index + 1];
  return (
    <PageFrame code={sheetOf(guide)} title={guide.title} description={guide.summary}>
      <guide.Page />
      <PagerLinks
        previous={previous && { text: previous.title, href: href(previous.path) }}
        next={next && { text: next.title, href: href(next.path) }}
      />
    </PageFrame>
  );
}
