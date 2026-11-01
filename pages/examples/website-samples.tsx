// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import type { SiteFooterProps } from '~components/site-footer';
import type { SiteHeaderProps } from '~components/site-header';

import styles from './website-samples.module.scss';

// Sample content shared by the website component pages: a bicycle workshop, a garden journal and
// an architecture studio, so each page can show every style with believable text.

export const workshopLogo = (
  <svg viewBox="0 0 32 32" width="32" height="32" className={styles.logo}>
    <circle cx="9" cy="21" r="6" />
    <circle cx="23" cy="21" r="6" />
    <path d="M9 21l5-10h7l2 10M14 11l-2-4h-3M21 11l-1-3h3" />
  </svg>
);

export const workshopBrand: SiteHeaderProps.Brand = { name: 'Fixit Bikes', href: '#', logo: workshopLogo };

export const workshopLinks: SiteHeaderProps.Link[] = [
  { text: 'Repairs', href: '#repairs', current: true },
  { text: 'Bikes for sale', href: '#bikes' },
  { text: 'Classes', href: '#classes' },
  { text: 'Visit', href: '#visit' },
];

export const footerColumns: SiteFooterProps.Column[] = [
  {
    title: 'Visit',
    links: [
      { text: 'Opening hours', href: '#hours' },
      { text: 'Find the workshop', href: '#map' },
      { text: 'Parking and bike racks', href: '#parking' },
    ],
  },
  {
    title: 'Workshop',
    links: [
      { text: 'Repairs and prices', href: '#prices' },
      { text: 'Bikes for sale', href: '#bikes' },
      { text: 'Evening classes', href: '#classes' },
    ],
  },
  {
    title: 'About',
    links: [
      { text: 'Our story', href: '#story' },
      { text: 'Jobs', href: '#jobs' },
      { text: 'Contact', href: '#contact' },
    ],
  },
];

/**
 * One labelled example on a website component page. `narrow` holds it at phone width, so container
 * layouts show how they reflow.
 */
export function Example({
  title,
  narrow = false,
  children,
}: {
  title: string;
  narrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure className={styles.example}>
      <figcaption className={styles.caption}>{title}</figcaption>
      <div className={narrow ? `${styles.frame} ${styles.narrow}` : styles.frame}>{children}</div>
    </figure>
  );
}

export function ExamplePage({ children }: { children: React.ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}

/**
 * A line-drawn south elevation of a small timber hut, as a studio would put beside its statement.
 */
export function Elevation() {
  return (
    <svg viewBox="0 0 320 240" className={styles.drawing} aria-hidden="true">
      <path className={styles.ground} d="M8 214h304" />
      <path d="M48 214V110l112-70 112 70v104z" />
      <path className={styles.fine} d="M48 110h224M160 40v174" />
      <path d="M78 214v-64h40v64M196 132h48v40h-48z" />
      <path className={styles.fine} d="M220 132v40M196 152h48" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => (
        <path key={index} className={styles.hatch} d={`M${58 + index * 20} 214v-10`} />
      ))}
      <path className={styles.dimension} d="M48 228h224M48 224v8M272 224v8" />
      <text x="160" y="238" className={styles.label}>
        6 400
      </text>
    </svg>
  );
}

/**
 * A bicycle on a plain ground, standing in for a photograph in the shopfront frame.
 */
export function BicycleDrawing() {
  return (
    <svg viewBox="0 0 320 220" className={styles.drawing} role="img" aria-label="A town bicycle with a basket">
      <circle cx="84" cy="146" r="46" />
      <circle cx="236" cy="146" r="46" />
      <circle className={styles.fine} cx="84" cy="146" r="4" />
      <circle className={styles.fine} cx="236" cy="146" r="4" />
      <path d="M84 146l52-70h70l30 70M136 76l26 70h-78M162 146l44-70M128 60h22M206 76l-6-24h20" />
      <path className={styles.fine} d="M204 34h40l-6 22h-30z" />
    </svg>
  );
}
