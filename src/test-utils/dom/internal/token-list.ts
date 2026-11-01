// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ElementWrapper } from '../core';

import styles from '../../../internal/components/token-list/styles.css.js';

/**
 * One token in a token list.
 */
export class TokenWrapper extends ElementWrapper {
  findLabel(): ElementWrapper {
    return this.findByClassName(styles.label)!;
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  /**
   * The token's dismiss button, if it can be dismissed.
   */
  findDismissButton(): ButtonWrapper | null {
    const element = this.findByClassName(styles['dismiss-button']);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }
}

export function findTokens(container: ElementWrapper): TokenWrapper[] {
  return container.findAllByClassName(styles.token).map(token => new TokenWrapper(token.getElement()));
}

/**
 * The button that shows or hides the tokens beyond the token limit.
 */
export function findTokenToggle(container: ElementWrapper): ButtonWrapper | null {
  const element = container.findByClassName(styles.toggle);
  return element ? new ButtonWrapper(element.getElement()) : null;
}
