// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

import { breakpointMinWidths, breakpoints } from '../breakpoints';

// Container queries cannot read custom properties, so the Sass copy of the breakpoints has to be
// kept equal to the script copy by hand. This test catches the two drifting apart.
describe('Sass breakpoints', () => {
  const scss = readFileSync(resolve(__dirname, '../styles/breakpoints.scss'), 'utf8');

  test.each(breakpoints.filter(name => name !== 'default'))('%s matches breakpointMinWidths', name => {
    const match = scss.match(new RegExp(`^\\$${name}: (\\d+)px;$`, 'm'));
    expect(match?.[1]).toBe(String(breakpointMinWidths[name]));
  });
});
