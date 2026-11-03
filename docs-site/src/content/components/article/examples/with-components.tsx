// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Article from '@ordinate/components/article';
import Figure from '@ordinate/components/figure';
import Media from '@ordinate/components/media';
import PullQuote from '@ordinate/components/pull-quote';
import StyleScope from '@ordinate/components/style-scope';

// An ink drawing of the mill in the text color, so it reads in light and dark mode.
function MillDrawing() {
  return (
    <svg viewBox="0 0 300 200" role="img" aria-label="The mill house beside its water wheel">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="40" y="60" width="140" height="110" />
        <path d="M40 60l70-40 70 40M20 170h260" />
        <circle cx="225" cy="115" r="45" />
        <path d="M225 70v90M180 115h90M193 83l64 64M257 83l-64 64" strokeWidth="0.75" />
      </g>
    </svg>
  );
}

export default function WithComponents() {
  return (
    <StyleScope styleName="editorial">
      <Article byline="By Tom Lindqvist · 4 November 2026">
        <p>
          The mill house has stood beside the weir since 1887. The wheel was rebuilt in oak in 1990, by the same family
          of wrights who built the one before it.
        </p>
        <Figure
          media={
            <Media aspectRatio="3:2" fit="contain">
              <MillDrawing />
            </Media>
          }
          label="Fig. 1"
          caption="The mill house and wheel, from the 1887 survey."
        />
        <p>Six bakeries in town buy from the mill. Most say the dough drinks more water and needs a longer rest.</p>
        <PullQuote variant="hanging" attribution="Ines Moreau, baker">
          It behaves differently every week, and that is the point.
        </PullQuote>
        <p>The mill shop opens on Saturdays, from nine until the flour runs out.</p>
      </Article>
    </StyleScope>
  );
}
