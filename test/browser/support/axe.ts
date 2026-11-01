// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Locator } from '@playwright/test';
import type { AxeResults, RunOptions } from 'axe-core';

declare global {
  interface Window {
    axe: { run(context: Element, options: RunOptions): Promise<AxeResults> };
  }
}

// The WCAG A and AA rules. The best-practice rules about landmarks are left out because every
// dev page sits inside the shell's own landmarks, which a real application would not have.
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export interface AxeViolation {
  id: string;
  impact: string;
  help: string;
  targets: string[];
}

/** Runs axe in the browser on `scope` and returns its violations in a compact form. */
export async function findAxeViolations(scope: Locator): Promise<AxeViolation[]> {
  const page = scope.page();
  if (!(await page.evaluate(() => 'axe' in window))) {
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  }
  const results = await scope.evaluate(
    (element, tags) => window.axe.run(element, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] }),
    wcagTags
  );
  return results.violations.map(violation => ({
    id: violation.id,
    impact: violation.impact ?? 'unknown',
    help: violation.help,
    targets: violation.nodes.map(node => node.target.join(' ')),
  }));
}

export function formatViolations(violations: AxeViolation[]): string {
  return violations
    .map(({ id, impact, help, targets }) => `${id} (${impact}): ${help}\n${targets.map(t => `    ${t}`).join('\n')}`)
    .join('\n');
}
