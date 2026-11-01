// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../site-footer/styles.css.js';

export class SiteFooterColumnWrapper extends ElementWrapper {
  findTitle(): ElementWrapper {
    return this.findByClassName(styles['column-title'])!;
  }

  findLinks(): ElementWrapper<HTMLAnchorElement>[] {
    return this.findAllByClassName<HTMLAnchorElement>(styles.link);
  }
}

export default class SiteFooterWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findBrand(): ElementWrapper | null {
    return this.findByClassName(styles.brand);
  }

  /**
   * Returns the content passed as `children`.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  findNavigation(): ElementWrapper | null {
    return this.findByClassName(styles.navigation);
  }

  findColumns(): SiteFooterColumnWrapper[] {
    return this.findAllByClassName(styles.column).map(column => new SiteFooterColumnWrapper(column.getElement()));
  }

  findLegal(): ElementWrapper | null {
    return this.findByClassName(styles.legal);
  }
}
