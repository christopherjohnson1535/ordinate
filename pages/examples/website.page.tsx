// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import CallToAction from '~components/call-to-action';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import Input from '~components/input';
import Link from '~components/link';
import Opening from '~components/opening';
import Section from '~components/section';
import SegmentedControl from '~components/segmented-control';
import SiteFooter from '~components/site-footer';
import SiteHeader from '~components/site-header';
import SpaceBetween from '~components/space-between';

import { BicycleDrawing, Elevation, footerColumns, workshopBrand, workshopLinks } from './website-samples';

import styles from './website.module.scss';

type Site = 'shop' | 'journal' | 'studio';

const legal = (
  <>
    <span>© 2026</span>
    <SpaceBetween direction="horizontal" size="m">
      <Link href="#privacy">Privacy</Link>
      <Link href="#terms">Terms</Link>
    </SpaceBetween>
  </>
);

function SignUp() {
  const [email, setEmail] = useState('');
  return (
    <form onSubmit={event => event.preventDefault()}>
      <SpaceBetween direction="horizontal" size="xs" alignItems="end">
        <FormField label="Email address">
          <Input type="email" value={email} onChange={event => setEmail(event.detail.value)} />
        </FormField>
        <Button variant="primary">Subscribe</Button>
      </SpaceBetween>
    </form>
  );
}

function ShopOpening() {
  return (
    <Opening
      variant="split"
      badge="Open Sundays"
      kicker="Bicycle repairs in Leith"
      title="Back on the road by teatime."
      description="Punctures, brakes and full services. Drop it off before ten and most bikes are ready the same day."
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button formAction="none" variant="primary">
            Book a repair
          </Button>
          <Button formAction="none">See prices</Button>
        </SpaceBetween>
      }
      media={<BicycleDrawing />}
    />
  );
}

function JournalOpening() {
  return (
    <Opening
      variant="masthead"
      meta={
        <>
          <span>Vol. 3 · No. 14</span>
          <span>Autumn 2026</span>
        </>
      }
      title="The Allotment"
      description="A quarterly journal of small gardens, the people who keep them and what they cook at the end of the day."
      links={[
        { text: 'Essays', href: '#essays', current: true },
        { text: 'Field notes', href: '#notes' },
        { text: 'Recipes', href: '#recipes' },
        { text: 'Archive', href: '#archive' },
      ]}
    />
  );
}

function StudioOpening() {
  return (
    <Opening
      variant="statement"
      kicker="Harbour & Pine, architects"
      title="We draw quiet houses for loud families."
      description="Small homes, extensions and huts in the Borders, drawn by hand and built with local timber."
      actions={<Button formAction="none">See the work</Button>}
      media={<Elevation />}
      mediaCaption="Hut No. 3 · south elevation · 1:50"
    />
  );
}

const openings: Record<Site, () => React.ReactElement> = {
  shop: ShopOpening,
  journal: JournalOpening,
  studio: StudioOpening,
};

export default function WebsitePage() {
  const [site, setSite] = useState<Site>('shop');
  const SiteOpening = openings[site];

  return (
    <div className={styles.page}>
      <div className={styles.controls}>
        <SegmentedControl
          label="Opening"
          selectedId={site}
          onChange={event => setSite(event.detail.selectedId as Site)}
          options={[
            { id: 'shop', text: 'Split' },
            { id: 'journal', text: 'Masthead' },
            { id: 'studio', text: 'Statement' },
          ]}
        />
        <span className={styles.hint}>Switch the voice with the Style select in the top bar.</span>
      </div>
      <div className={styles.site}>
        <SiteHeader
          brand={workshopBrand}
          links={workshopLinks}
          actions={
            <Button formAction="none" variant="primary">
              Book a repair
            </Button>
          }
          notice="Open today 8–6 · Same-day repairs before 10"
          sticky={true}
        />
        <main>
          <SiteOpening />
          <Section
            id="repairs"
            rule="top"
            heading="What we fix"
            description="Prices include parts we keep in stock. We always call before going over the quote."
            actions={<Link href="#prices">All prices</Link>}
          >
            <ColumnLayout columns={3} variant="text-grid">
              <div>
                <h3 className={styles.item}>Punctures</h3>
                <p className={styles.text}>Inner tube, patch or tubeless plug, while you wait. From £12.</p>
              </div>
              <div>
                <h3 className={styles.item}>Brakes</h3>
                <p className={styles.text}>Pads, cables and bleeds for rim and disc brakes. From £18.</p>
              </div>
              <div>
                <h3 className={styles.item}>Full service</h3>
                <p className={styles.text}>Everything checked, cleaned, trued and adjusted. £75.</p>
              </div>
            </ColumnLayout>
          </Section>
          <Section
            id="classes"
            tone="accent"
            width="narrow"
            heading="Evening classes"
            description="Learn to fix your own bike on Tuesday evenings. Tools, tea and a stand each."
          >
            <p className={styles.text}>
              Four weeks, six people, one mechanic. We start with punctures and finish with a full strip-down of a hub.{' '}
              <Link href="#classes">Book a place</Link>.
            </p>
          </Section>
          <Section
            id="story"
            tone="inverted"
            rule="double"
            heading="Thirty years on Shore Road"
            description="Started by two couriers in a lock-up, now a workshop of six."
            actions={<Button formAction="none">Our story</Button>}
          >
            <p className={styles.text}>
              We still fix the bikes of the couriers who taught us, and we still keep the kettle on.{' '}
              <Link href="#story">Read how it started</Link>.
            </p>
          </Section>
          <CallToAction heading="The Thursday letter" description="One repair tip and one ride for the weekend.">
            <SignUp />
          </CallToAction>
        </main>
        <SiteFooter brand={workshopBrand} columns={footerColumns} legal={legal}>
          <address className={styles.address}>
            12 Shore Road, Leith
            <br />
            Tuesday to Sunday, 8–6
          </address>
        </SiteFooter>
      </div>
    </div>
  );
}
