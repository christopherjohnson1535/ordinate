// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ElementWrapper } from '../core';
import TokenWrapper from '../token';

import styles from '../../../internal/components/token-list/styles.css.js';

export { TokenWrapper };

export function findTokens(container: ElementWrapper): TokenWrapper[] {
  return container.findAllComponents(TokenWrapper);
}

/**
 * The button that shows or hides the tokens beyond the token limit.
 */
export function findTokenToggle(container: ElementWrapper): ButtonWrapper | null {
  const element = container.findByClassName(styles.toggle);
  return element ? new ButtonWrapper(element.getElement()) : null;
}
