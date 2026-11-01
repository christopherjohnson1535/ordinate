// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import CallToAction from '~components/call-to-action';
import FormField from '~components/form-field';
import Input from '~components/input';
import Link from '~components/link';
import Opening from '~components/opening';
import Section from '~components/section';
import SiteFooter from '~components/site-footer';
import SiteHeader from '~components/site-header';
import SpaceBetween from '~components/space-between';

import { BicycleDrawing, footerColumns, workshopBrand, workshopLinks } from '../website-samples';
import { stayOnPage } from './samples';
import { Cell, Group } from './specimen';

import styles from './specimen.module.scss';

function SignUp() {
  const [email, setEmail] = useState('');
  return (
    <form onSubmit={event => event.preventDefault()}>
      <SpaceBetween direction="horizontal" size="xs" alignItems="end">
        <FormField label="Email for the Thursday letter">
          <Input type="email" value={email} onChange={event => setEmail(event.detail.value)} />
        </FormField>
        <Button variant="primary">Subscribe</Button>
      </SpaceBetween>
    </form>
  );
}

export default function WebsiteFrameGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Website frame">
      <Cell name="Opening" wide={true}>
        <div className={styles.site}>
          <Opening
            variant="split"
            headingLevel={4}
            badge="Open Sundays"
            kicker="Bicycle repairs in Leith"
            title="Back on the road by teatime."
            description="Punctures, brakes and full services. Drop it off before ten and most bikes are ready the same day."
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="primary">Book a repair</Button>
                <Button>See prices</Button>
              </SpaceBetween>
            }
            media={<BicycleDrawing />}
          />
        </div>
      </Cell>
      <Cell name="Section" wide={true}>
        <div className={styles.site}>
          <Section
            headingLevel={4}
            rule="top"
            heading="Evening classes"
            description="Learn to fix your own bike on Tuesday evenings. Tools, tea and a stand each."
            actions={
              <Link href="#classes" onFollow={stayOnPage}>
                Book a place
              </Link>
            }
          >
            <p className={styles['site-text']}>
              Four weeks, six people, one mechanic. We start with punctures and finish with a full strip-down of a hub.
            </p>
          </Section>
        </div>
      </Cell>
      <Cell name="CallToAction" wide={true}>
        <div className={styles.site}>
          <CallToAction
            headingLevel={4}
            heading="The Thursday letter"
            description="One repair tip and one ride for the weekend."
          >
            <SignUp />
          </CallToAction>
        </div>
      </Cell>
      <Cell name="SiteHeader" wide={true}>
        <div className={styles.site}>
          <SiteHeader
            brand={workshopBrand}
            links={workshopLinks}
            navigationAriaLabel="Fixit Bikes"
            onFollow={stayOnPage}
            actions={<Button variant="primary">Book a repair</Button>}
            notice="Open today 8–6 · Same-day repairs before 10"
          />
        </div>
      </Cell>
      <Cell name="SiteFooter" wide={true}>
        <div className={styles.site}>
          <SiteFooter
            brand={workshopBrand}
            columns={footerColumns}
            headingLevel={4}
            navigationAriaLabel="Fixit Bikes, more pages"
            onFollow={stayOnPage}
            legal={<span>© 2026 Fixit Bikes</span>}
          >
            <address className={styles.address}>
              12 Shore Road, Leith
              <br />
              Tuesday to Sunday, 8–6
            </address>
          </SiteFooter>
        </div>
      </Cell>
    </Group>
  );
}
