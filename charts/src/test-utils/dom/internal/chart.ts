// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, MultiselectWrapper } from '@ordinate/components/test-utils/dom';

import frameStyles from '../../../internal/components/chart-frame/styles.css.js';
import popoverStyles from '../../../internal/components/detail-popover/styles.css.js';
import legendStyles from '../../../internal/components/legend/styles.css.js';

export class DetailPopoverWrapper extends ComponentWrapper {
  static rootSelector = `.${popoverStyles.root}`;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(popoverStyles.title);
  }

  /**
   * Returns one row per series or value, without the total.
   */
  findRows(): ElementWrapper[] {
    return this.findAllByClassName(popoverStyles.row).filter(
      row => !row.getElement().classList.contains(popoverStyles.summary)
    );
  }

  /**
   * Returns the total row of a stacked chart.
   */
  findSummary(): ElementWrapper | null {
    return this.findByClassName(popoverStyles.summary);
  }

  findFooter(): ElementWrapper | null {
    return this.findByClassName(popoverStyles.footer);
  }

  /**
   * Returns the close button, which a pinned popover has.
   */
  findDismissButton(): ElementWrapper<HTMLButtonElement> | null {
    return this.find<HTMLButtonElement>(`.${popoverStyles.dismiss} button`);
  }
}

/**
 * The parts every chart shares: filter, plot, legend, detail popover and status.
 */
export class ChartWrapper extends ComponentWrapper {
  /**
   * Returns the series or segment filter above the chart.
   */
  findFilter(): MultiselectWrapper | null {
    return this.findByClassName(frameStyles.filter)?.findMultiselect() ?? null;
  }

  /**
   * Returns the plot, the one focus stop that the arrow keys navigate.
   */
  findApplication(): ElementWrapper | null {
    return this.find('[role="application"]');
  }

  findLegend(): ElementWrapper | null {
    return this.findByClassName(legendStyles.root);
  }

  findLegendItems(): ElementWrapper<HTMLButtonElement>[] {
    return this.findAllByClassName<HTMLButtonElement>(legendStyles.item);
  }

  findHighlightedLegendItem(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(legendStyles['item-highlighted']);
  }

  findDetailPopover(): DetailPopoverWrapper | null {
    return this.findComponent(DetailPopoverWrapper);
  }

  /**
   * Returns what the chart shows in place of its plot while loading, after an error, without
   * data, or when the filter hides everything.
   */
  findStatusContainer(): ElementWrapper | null {
    return this.findByClassName(frameStyles.status);
  }

  /**
   * Returns the recovery button shown with the error text.
   */
  findRecoveryButton(): ElementWrapper<HTMLButtonElement> | null {
    return this.find<HTMLButtonElement>(`.${frameStyles['status-error']} button`);
  }
}
