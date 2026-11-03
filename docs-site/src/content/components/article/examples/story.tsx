// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Article from '@ordinate/components/article';
import StyleScope from '@ordinate/components/style-scope';

export default function Story() {
  return (
    <StyleScope styleName="editorial">
      <Article
        lead="Ruth Okafor still dresses her millstones by hand. Six bakers explain why their bread depends on it."
        byline="By Tom Lindqvist · Photographs by Ana Ruiz · 4 November 2026"
      >
        <p>
          Every miller on the river once knew the sound of a stone that needed dressing. It is a dull, uneven grind,
          like a cart on cobbles, and it means the furrows in the stone have worn smooth.
        </p>
        <p>
          On Thursdays Ruth lifts the runner stone with a chain hoist and recuts the grooves with a mill bill, a wedge of
          steel set in a wooden handle. <a href="https://example.com/mill/film">We filmed a morning of it</a>, and the
          rhythm never changes.
        </p>
        <h2>Why grind slowly</h2>
        <p>
          A roller mill strips the bran and the germ and runs hot. A stone turns slowly enough that the flour leaves
          cool, with its oils intact. The trade-off is time:
        </p>
        <ul>
          <li>a stone mills about 40 kilos an hour,</li>
          <li>a small roller mill manages ten times that,</li>
          <li>and the stone needs dressing every few weeks.</li>
        </ul>
        <blockquote>
          <p>You can taste the difference in a plain loaf. That is the whole argument.</p>
          <footer>Ruth Okafor, miller</footer>
        </blockquote>
        <h3>Where to buy</h3>
        <p>
          The mill shop opens on Saturdays. Bring a bag; flour is sold by weight, with <code>T80</code> and wholemeal
          most weeks.
        </p>
      </Article>
    </StyleScope>
  );
}
