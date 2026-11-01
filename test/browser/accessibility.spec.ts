// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { findAxeViolations, formatViolations } from './support/axe';
import { listRoutes, Mode } from './support/dev-page';
import { expect, test } from './support/fixtures';
import { knownAxeViolations } from './support/known-axe-violations';

// Contrast is the part of axe that jsdom cannot check, so every page runs in both modes.
const modes: Mode[] = ['light', 'dark'];

for (const route of listRoutes()) {
  test(`${route} has no axe violations`, async ({ sharedDevPage }, testInfo) => {
    const known = knownAxeViolations[route] ?? {};
    const seen = new Set<string>();
    await sharedDevPage.open(route);

    for (const mode of modes) {
      await sharedDevPage.setMode(mode);
      const found = await findAxeViolations(sharedDevPage.content);
      found.forEach(violation => seen.add(violation.id));
      const violations = found.filter(violation => !(violation.id in known));
      if (violations.length > 0) {
        await testInfo.attach(`axe-violations-${mode}.json`, {
          body: JSON.stringify(violations, null, 2),
          contentType: 'application/json',
        });
      }
      expect.soft(violations, `${mode} mode\n${formatViolations(violations)}`).toEqual([]);
    }

    const fixed = Object.keys(known).filter(id => !seen.has(id));
    expect(fixed, 'Known violations that no longer occur; remove them from known-axe-violations.ts').toEqual([]);
  });
}
