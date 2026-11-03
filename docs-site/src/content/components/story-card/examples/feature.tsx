// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Grid from '@ordinate/components/grid';
import Media from '@ordinate/components/media';
import SpaceBetween from '@ordinate/components/space-between';
import StoryCard from '@ordinate/components/story-card';
import StyleScope from '@ordinate/components/style-scope';

// A stand-in for a photograph, so the example needs no network.
const harbour = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <rect width="1200" height="800" fill="#dfe5ea"/><rect y="520" width="1200" height="280" fill="#7d93a6"/>
    <rect x="140" y="300" width="220" height="240" fill="#3f4a55"/><rect x="380" y="240" width="160" height="300" fill="#c9b79c"/>
    <rect x="560" y="330" width="260" height="210" fill="#9a5b3c"/><rect x="840" y="280" width="200" height="260" fill="#e8e1d4"/>
  </svg>`
)}`;

export default function Feature() {
  return (
    <StyleScope styleName="editorial">
      <Grid gridDefinition={[{ colspan: { default: 12, s: 8 } }, { colspan: { default: 12, s: 4 } }]}>
        <StoryCard
          variant="feature"
          headingLevel={2}
          href="https://example.com/stories/harbour"
          media={<Media src={harbour} alt="" aspectRatio="16:9" />}
          kicker="Cover story"
          title="A harbour learns to live with the sea again"
          summary="After the storm of 2023, the town chose to let the marsh return. Three years on, the fish and the visitors have both come back."
          meta={
            <>
              By <a href="https://example.com/authors/mara-lindqvist">Mara Lindqvist</a> · 12 May 2026
            </>
          }
        />
        <SpaceBetween size="l">
          <StoryCard
            headingLevel={2}
            href="https://example.com/stories/walking"
            kicker="Essay"
            title="On walking slowly"
            summary="Why the long way round is sometimes the only way."
            meta="Ada Frost · 4 min read"
          />
          <StoryCard
            headingLevel={2}
            href="https://example.com/stories/letters"
            kicker="Letters"
            title="Your notes on the spring issue"
            summary="On sea kale, a correction about tide tables, and one very good dog."
            meta="12 letters"
          />
        </SpaceBetween>
      </Grid>
    </StyleScope>
  );
}
