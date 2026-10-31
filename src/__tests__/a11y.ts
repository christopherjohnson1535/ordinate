// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import axe from 'axe-core';
import { expect } from 'vitest';

// Contrast needs real rendering, and the page-level rules do not apply to a single component.
const disabledRules = ['color-contrast', 'region', 'landmark-one-main', 'page-has-heading-one'];

/**
 * Runs axe on `container` and fails with the list of violations, if any.
 */
export async function expectNoAxeViolations(container: Element) {
  const results = await axe.run(container, {
    rules: Object.fromEntries(disabledRules.map(rule => [rule, { enabled: false }])),
  });
  expect(results.violations.map(violation => `${violation.id}: ${violation.help}`)).toEqual([]);
}
