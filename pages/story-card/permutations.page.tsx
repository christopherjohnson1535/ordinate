// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Media from '~components/media';
import StoryCard from '~components/story-card';

import { harbourPhoto } from '../website-content-samples';

import styles from '../website-content.module.scss';

const alsoInThisIssue = [
  {
    number: '02',
    kicker: 'Field notes',
    title: 'What the tide leaves behind',
    summary: 'A morning on the mudflats with the people who count the birds.',
    meta: 'Lena Ortiz · 6 min read',
  },
  {
    number: '03',
    kicker: 'Interview',
    title: 'The last sail maker on the east quay',
    summary: 'Forty years of canvas, thread and weather.',
    meta: 'Tomás Reyes · 9 min read',
  },
  {
    number: '04',
    kicker: 'Essay',
    title: 'On walking slowly',
    summary: 'Why the long way round is sometimes the only way.',
    meta: 'Ada Frost · 4 min read',
  },
];

export default function StoryCardPermutations() {
  return (
    <article className={styles.page}>
      <h1>Story card permutations</h1>
      <section className={styles.section}>
        <h2>Feature and default with media</h2>
        <div className={styles.split}>
          <StoryCard
            variant="feature"
            headingLevel={2}
            href="#story"
            media={<Media src={harbourPhoto} alt="" aspectRatio="16:9" />}
            kicker="Cover story"
            title="A harbour learns to live with the sea again"
            summary="After the storm of 2023, the town chose to let the marsh return. Three years on, the fish and the visitors have both come back."
            meta={
              <>
                By <a href="#author">Mara Lindqvist</a> · 12 May 2026
              </>
            }
          />
          <div className={styles.stack}>
            <StoryCard
              headingLevel={2}
              href="#story"
              media={<Media placeholderText="Photo" aspectRatio="3:2" />}
              kicker="Food"
              title="Bread, the slow way"
              summary="A bakery that proves its dough for two days."
              meta="Ines Moreau · 5 min read"
            />
            <StoryCard
              headingLevel={2}
              kicker="Letters"
              title="A card without a link"
              summary="The title stays plain text when there is no href."
            />
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Also in this issue: numbered, ruled columns</h2>
        <ol className={styles['ruled-columns']}>
          {alsoInThisIssue.map(story => (
            <li key={story.number}>
              <StoryCard {...story} href="#story" variant="ruled" />
            </li>
          ))}
        </ol>
      </section>
      <section className={styles.section}>
        <h2>Numbered without rules</h2>
        <div className={styles.columns}>
          {alsoInThisIssue.map(story => (
            <StoryCard key={story.number} {...story} href="#story" />
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={styles.narrow}>
          <StoryCard
            variant="feature"
            href="#story"
            number="01"
            media={<Media placeholderText="Photo" aspectRatio="4:3" />}
            kicker="Cover story"
            title="A harbour learns to live with the sea again"
            summary="After the storm, the town chose to let the marsh return."
            meta="Mara Lindqvist · 12 May 2026"
          />
        </div>
      </section>
    </article>
  );
}
