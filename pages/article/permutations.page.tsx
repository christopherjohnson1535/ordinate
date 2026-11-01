// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Article from '~components/article';

import styles from './styles.module.scss';

// A plan of a small mill in ink lines, so the figure has something to show without a network.
const millDrawing = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" fill="none" stroke="#6b6f76" stroke-width="1.5">
    <rect x="40" y="60" width="140" height="110"/><path d="M40 60l70-40 70 40"/>
    <circle cx="225" cy="115" r="45"/><path d="M225 70v90M180 115h90M193 83l64 64M257 83l-64 64"/>
    <rect x="95" y="120" width="30" height="50"/><path d="M20 170h260"/>
  </svg>`
)}`;

function Essay() {
  return (
    <>
      <p>
        Every miller on the river once knew the sound of a stone that needed dressing. It is a dull, uneven grind, like
        a cart on cobbles, and it means the furrows in the stone have worn smooth. Ruth Okafor hears it before anyone
        else in the yard, and on Thursdays she lifts the runner stone with a chain hoist and recuts the grooves by hand.
      </p>
      <p>
        The work takes most of a day. She chalks the old lines, then follows them with a mill bill, a wedge of steel set
        in a wooden handle, striking a few thousand times. <a href="#article/permutations">We filmed a morning of it</a>{' '}
        and the rhythm never changes.
      </p>
      <h2>Why grind slowly</h2>
      <p>
        A roller mill strips the bran and the germ and runs hot. A stone turns slowly enough that the flour leaves cool,
        with its oils intact, which is why it tastes of something. The trade-off is time:
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
      <figure>
        <img src={millDrawing} alt="Drawing of the mill house beside its water wheel" />
        <figcaption>The mill house and wheel, from the 1887 survey.</figcaption>
      </figure>
      <h3>What the bakers say</h3>
      <p>
        Six bakeries in town buy from the mill. Most say the dough drinks more water and needs a longer rest; one says
        it simply behaves differently every week, and that this is the point.
      </p>
      <ol>
        <li>Soak the flour for an hour before adding the starter.</li>
        <li>Expect a slacker dough than with roller-milled flour.</li>
        <li>Bake hotter and darker than you think.</li>
      </ol>
      <h4>Where to buy</h4>
      <p>
        The mill shop opens on Saturdays. Bring a bag; flour is sold by weight, with <code>T80</code> and wholemeal on
        most weeks.
      </p>
    </>
  );
}

// The lead essay with a drop cap in two narrow columns, a single column at each measure, and a
// phone-width article.
export default function ArticlePermutations() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2>Lead essay: two narrow columns, drop cap, lead and byline</h2>
        <h1 className={styles.title}>The last stone mill on the river</h1>
        <Article
          lead="Ruth Okafor still dresses her millstones by hand. Six bakers explain why their bread depends on it."
          byline="By Tom Lindqvist · Photographs by Ana Ruiz · 4 November 2026"
          dropCap={true}
          columns={2}
          measure="narrow"
        >
          <Essay />
        </Article>
      </section>
      <section className={styles.section}>
        <h2>One column, default measure</h2>
        <Article lead="The same story, set for reading in one column." byline="By Tom Lindqvist">
          <Essay />
        </Article>
      </section>
      <section className={styles.section}>
        <h2>Wide measure, no lead</h2>
        <Article measure="wide">
          <p>
            A wide measure suits short notices and announcements, where lines are few and the reader scans rather than
            reads. The mill is closed on 24 December and reopens on 3 January. Orders placed before 20 December are
            delivered before the break.
          </p>
        </Article>
      </section>
      <section className={styles.section}>
        <h2>Phone width: two columns fall back to one</h2>
        <div className={styles.phone}>
          <Article lead="Two columns need room; here the text stays in one." dropCap={true} columns={2}>
            <Essay />
          </Article>
        </div>
      </section>
    </div>
  );
}
