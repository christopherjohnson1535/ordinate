// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Article from '~components/article';
import Button from '~components/button';
import Figure from '~components/figure';
import IndexList from '~components/index-list';
import Media from '~components/media';
import MenuTile from '~components/menu-tile';
import Plate from '~components/plate';
import PullQuote from '~components/pull-quote';
import StoryCard from '~components/story-card';
import Testimonial from '~components/testimonial';

import { chairPhoto, harbourPhoto, PlanDrawing } from '../../website-content-samples';
import { stayOnPage } from './samples';
import { Cell, Group } from './specimen';

import styles from './specimen.module.scss';

export default function WebsiteContentGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Website content">
      <Cell name="Article" wide={true}>
        <div className={`${styles.site} ${styles.padded}`}>
          <Article
            lead="How a lock-up on Shore Road became a workshop of six."
            byline="By Tom Lindqvist · 12 May 2026"
            dropCap={true}
          >
            <p>
              Two couriers rented the lock-up in 1996 to keep their own bikes running. Within a year the neighbours were
              knocking on the door with buckled wheels and slipping chains, and the kettle was never off.
            </p>
            <p>
              Thirty years on, the workshop still fixes the bikes of the couriers who taught them, and still opens on
              Sundays, because that is when people find out their brakes do not work.
            </p>
          </Article>
        </div>
      </Cell>
      <Cell name="Figure">
        <Figure
          media={<Media src={harbourPhoto} alt="Harbour houses seen from the water" aspectRatio="16:9" />}
          label="Fig. 1"
          caption="The east quay at low tide, with the net lofts restored in 2024."
          credit="Photo: Ana Ruiz"
        />
      </Cell>
      <Cell name="Media">
        <Media aspectRatio="4:3" fit="contain">
          <PlanDrawing title="Plan of Hut No. 3" />
        </Media>
      </Cell>
      <Cell name="Plate">
        <Plate
          headingLevel={4}
          href="#oak-chair"
          onFollow={stayOnPage}
          media={<Media src={chairPhoto} alt="" aspectRatio="4:5" />}
          label="Plate II"
          title="Oak chair, no. 4"
          meta="Furniture, 2024"
          description="Made from one board of Borders oak, pegged rather than glued."
        />
      </Cell>
      <Cell name="StoryCard">
        <StoryCard
          headingLevel={4}
          href="#story"
          onFollow={stayOnPage}
          media={<Media placeholderText="Photo" aspectRatio="3:2" />}
          kicker="Field notes"
          title="Bread, the slow way"
          summary="A bakery on the hill proves its dough for two days, and the queue starts at seven."
          meta="Ines Moreau · 5 min read"
        />
      </Cell>
      <Cell name="MenuTile">
        <MenuTile
          headingLevel={4}
          tone="emphasis"
          badge="Most booked"
          title="Full service"
          items={[
            { label: 'Full service', value: '£75', description: 'Gears, brakes, wheels and bearings.' },
            { label: 'With new cables', value: '£95' },
          ]}
          footer={<Button>Book a service</Button>}
        />
      </Cell>
      <Cell name="IndexList">
        <IndexList
          ariaLabel="Repair prices"
          onFollow={stayOnPage}
          items={[
            { id: 'puncture', label: 'Puncture', value: '£12', href: '#puncture' },
            { id: 'brakes', label: 'Brake pads, fitted', value: '£18', href: '#brakes' },
            { id: 'truing', label: 'Wheel truing', value: '£20', href: '#truing' },
            { id: 'service', label: 'Full service', value: '£75', href: '#service' },
          ]}
        />
      </Cell>
      <Cell name="PullQuote">
        <PullQuote variant="hanging" attribution="Mara Lindqvist, harbour master">
          We stopped fighting the water. The water was always going to win.
        </PullQuote>
      </Cell>
      <Cell name="Testimonial">
        <Testimonial
          tone="accent"
          quote="I came in for a flat tyre and left knowing how to fix one myself."
          name="Ana R."
          detail="Old Town"
          media={<Media src={harbourPhoto} alt="" aspectRatio="1:1" />}
        />
      </Cell>
    </Group>
  );
}
