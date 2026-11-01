// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import FormFieldWrapper from '../form-field';

import styles from '../../../attribute-editor/styles.css.js';

export class AttributeEditorRowWrapper extends ElementWrapper {
  /**
   * Returns the fields of the row, in the order of `definition`.
   */
  findFields(): FormFieldWrapper[] {
    return this.findAll(`.${styles.field} > ${FormFieldWrapper.rootSelector}`).map(
      field => new FormFieldWrapper(field.getElement())
    );
  }

  /**
   * Returns the field at a position, counting from 1.
   */
  findField(position: number): FormFieldWrapper | null {
    return this.findFields()[position - 1] ?? null;
  }

  /**
   * Returns the row's remove button, or null for a row that cannot be removed.
   */
  findRemoveButton(): ButtonWrapper | null {
    const element = this.getElement().querySelector<HTMLElement>(`.${styles['remove-button']}`);
    return element ? new ButtonWrapper(element) : null;
  }
}

export default class AttributeEditorWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findRows(): AttributeEditorRowWrapper[] {
    return this.findAll(`.${styles.row}`).map(row => new AttributeEditorRowWrapper(row.getElement()));
  }

  /**
   * Returns the row at a position, counting from 1.
   */
  findRow(position: number): AttributeEditorRowWrapper | null {
    return this.findRows()[position - 1] ?? null;
  }

  /**
   * Returns the column headings, shown when every field of a row sits in one line.
   */
  findHeadings(): ElementWrapper[] {
    return this.findAllByClassName(styles.heading);
  }

  findAddButton(): ButtonWrapper {
    return new ButtonWrapper(this.getElement().querySelector<HTMLElement>(`.${styles['add-button']}`)!);
  }

  /**
   * Returns the content shown while there are no items.
   */
  findEmptySlot(): ElementWrapper | null {
    return this.findByClassName(styles.empty);
  }

  findAdditionalInfo(): ElementWrapper | null {
    return this.findByClassName(styles['additional-info']);
  }
}
