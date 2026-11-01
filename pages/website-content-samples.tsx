// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

// Stand-in pictures for the dev pages, drawn here so the pages need no network. The colors are only
// sample content.

function svgDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const harbourPhoto = svgDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d9e2ea"/><stop offset="1" stop-color="#f4efe6"/></linearGradient></defs>
    <rect width="1200" height="800" fill="url(#sky)"/>
    <rect y="520" width="1200" height="280" fill="#7d93a6"/>
    <rect x="140" y="300" width="220" height="240" fill="#3f4a55"/>
    <rect x="380" y="240" width="160" height="300" fill="#c9b79c"/>
    <rect x="560" y="330" width="260" height="210" fill="#9a5b3c"/>
    <rect x="840" y="280" width="200" height="260" fill="#e8e1d4"/>
    <path d="M0 600 C 300 570 600 630 1200 590 L1200 800 L0 800 Z" fill="#5f7689"/>
  </svg>`
);

export const chairPhoto = svgDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
    <rect width="800" height="1000" fill="#ece8e1"/>
    <rect y="760" width="800" height="240" fill="#d8d1c5"/>
    <rect x="250" y="260" width="300" height="320" fill="#8c6a4f"/>
    <rect x="250" y="560" width="300" height="60" fill="#6f533d"/>
    <rect x="262" y="620" width="24" height="220" fill="#4b3a2c"/>
    <rect x="514" y="620" width="24" height="220" fill="#4b3a2c"/>
  </svg>`
);

export const logoPicture = svgDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160">
    <rect width="400" height="160" fill="#1f3fbf"/>
    <circle cx="80" cy="80" r="44" fill="#f5c400"/>
    <rect x="150" y="56" width="210" height="16" fill="#ffffff"/>
    <rect x="150" y="88" width="150" height="16" fill="#ffffff"/>
  </svg>`
);

/**
 * A plan drawing in ink, for the `children` slot of a `Media`. It takes the text color, so it works
 * in both modes.
 */
export function PlanDrawing({ title = 'Plan of the ground floor' }: { title?: string }) {
  return (
    <svg viewBox="0 0 300 200" role="img" aria-label={title} preserveAspectRatio="xMidYMid meet">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="30" y="30" width="240" height="140" />
        <path d="M30 100 H150 V170 M150 30 V70 M190 100 H270" />
        <path d="M150 70 A30 30 0 0 1 180 100" strokeDasharray="3 3" />
      </g>
      <g stroke="currentColor" strokeWidth="0.75">
        <path d="M30 185 H270 M30 181 V189 M270 181 V189" />
      </g>
    </svg>
  );
}
