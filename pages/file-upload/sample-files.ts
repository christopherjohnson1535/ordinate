// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const lastModified = new Date(2026, 9, 28, 16, 42).getTime();

// Pages show realistic sizes without allocating them.
function sampleFile(parts: BlobPart[], name: string, type: string, size?: number): File {
  const file = new File(parts, name, { type, lastModified });
  if (size !== undefined) {
    Object.defineProperty(file, 'size', { value: size });
  }
  return file;
}

function drawing(stroke: string, background: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${background}"/>
  <g fill="none" stroke="${stroke}" stroke-width="1.5">
    <rect x="10" y="22" width="44" height="32"/>
    <path d="M6 24 32 8l26 16M24 54V38h16v16M14 30h6v6h-6zM44 30h6v6h-6z"/>
  </g>
</svg>`;
}

export const sitePlan = sampleFile(['%PDF'], 'site-plan.pdf', 'application/pdf', 1_240_512);
export const elevation = sampleFile([drawing('#1b4f9c', '#f4f6fa')], 'north-elevation.svg', 'image/svg+xml');
export const section = sampleFile([drawing('#131416', '#ffffff')], 'section-a-a.svg', 'image/svg+xml');
export const survey = sampleFile(
  ['AC1032'],
  'north-annex-boundary-and-topographic-survey-revision-c-final.dwg',
  'application/acad',
  48_302_118
);
export const calculations = sampleFile(['PK'], 'structural-calculations.xlsx', 'application/vnd.ms-excel', 86_400);
export const archive = sampleFile(['PK'], 'scans-2026.zip', 'application/zip', 2_300_000_000);

export const allFiles = [sitePlan, elevation, section, survey, calculations, archive];
