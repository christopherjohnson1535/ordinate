// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import CheckboxWrapper from '../checkbox';
import { ComponentWrapper, ElementWrapper } from '../core';
import ModalWrapper from '../modal';
import RadioGroupWrapper from '../radio-group';
import ToggleWrapper from '../toggle';

import styles from '../../../collection-preferences/styles.css.js';

function wrapButton(parent: ElementWrapper, className: string): ButtonWrapper | null {
  const element = parent.getElement().querySelector<HTMLElement>(`.${className}`);
  return element ? new ButtonWrapper(element) : null;
}

export class ContentDisplayOptionWrapper extends ElementWrapper {
  findLabel(): ElementWrapper {
    return this.findByClassName(styles['option-label'])!;
  }

  findVisibilityToggle(): ToggleWrapper {
    return this.findComponent(ToggleWrapper)!;
  }

  findMoveUpButton(): ButtonWrapper {
    return wrapButton(this, styles['move-up-button'])!;
  }

  findMoveDownButton(): ButtonWrapper {
    return wrapButton(this, styles['move-down-button'])!;
  }

  /**
   * The handle for reordering with a pointer.
   */
  findDragHandle(): ElementWrapper {
    return this.findByClassName(styles['drag-handle'])!;
  }
}

export class ContentDisplayPreferenceWrapper extends ElementWrapper {
  findTitle(): ElementWrapper {
    return this.findByClassName(styles['content-display-title'])!;
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles['content-display-description']);
  }

  /**
   * The columns in their current order.
   */
  findOptions(): ContentDisplayOptionWrapper[] {
    return this.findAllByClassName(styles['content-display-option']).map(
      option => new ContentDisplayOptionWrapper(option.getElement())
    );
  }

  findOptionByLabel(label: string): ContentDisplayOptionWrapper | null {
    return this.findOptions().find(option => option.findLabel().getText() === label) ?? null;
  }
}

export default class CollectionPreferencesWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The settings button that opens the modal.
   */
  findTriggerButton(): ButtonWrapper {
    return wrapButton(this, styles.trigger)!;
  }

  /**
   * The modal, while it is open.
   */
  findModal(): ModalWrapper | null {
    const modal = this.findComponent(ModalWrapper);
    return modal?.isVisible() ? modal : null;
  }

  findConfirmButton(): ButtonWrapper | null {
    return wrapButton(this, styles['confirm-button']);
  }

  findCancelButton(): ButtonWrapper | null {
    return wrapButton(this, styles['cancel-button']);
  }

  findPageSizePreference(): RadioGroupWrapper | null {
    return this.findByClassName(styles['page-size'])?.findComponent(RadioGroupWrapper) ?? null;
  }

  findWrapLinesPreference(): CheckboxWrapper | null {
    return this.findByClassName(styles['wrap-lines'])?.findComponent(CheckboxWrapper) ?? null;
  }

  findStripedRowsPreference(): CheckboxWrapper | null {
    return this.findByClassName(styles['striped-rows'])?.findComponent(CheckboxWrapper) ?? null;
  }

  findContentDensityPreference(): CheckboxWrapper | null {
    return this.findByClassName(styles['content-density'])?.findComponent(CheckboxWrapper) ?? null;
  }

  findStickyFirstColumnsPreference(): RadioGroupWrapper | null {
    return this.findByClassName(styles['sticky-first-columns'])?.findComponent(RadioGroupWrapper) ?? null;
  }

  findStickyLastColumnsPreference(): RadioGroupWrapper | null {
    return this.findByClassName(styles['sticky-last-columns'])?.findComponent(RadioGroupWrapper) ?? null;
  }

  findContentDisplayPreference(): ContentDisplayPreferenceWrapper | null {
    const element = this.findByClassName(styles['content-display']);
    return element ? new ContentDisplayPreferenceWrapper(element.getElement()) : null;
  }

  /**
   * The element holding the controls from `customPreference`.
   */
  findCustomPreference(): ElementWrapper | null {
    return this.findByClassName(styles.custom);
  }
}
