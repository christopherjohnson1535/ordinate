// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import AttributeEditorWrapper, { AttributeEditorRowWrapper } from '../attribute-editor';
import AutosuggestWrapper from '../autosuggest';
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import loadingStyles from '../../../internal/components/loading-status/styles.css.js';
import styles from '../../../tag-editor/styles.css.js';

export class TagEditorRowWrapper extends AttributeEditorRowWrapper {
  findKeyInput(): AutosuggestWrapper | null {
    return this.findField(1)?.findComponent(AutosuggestWrapper) ?? null;
  }

  /**
   * Returns the value field, or null while the tag is marked for removal.
   */
  findValueInput(): AutosuggestWrapper | null {
    return this.findField(2)?.findComponent(AutosuggestWrapper) ?? null;
  }

  /**
   * Returns the text shown in place of the value of a tag marked for removal.
   */
  findUndoPrompt(): ElementWrapper | null {
    return this.findByClassName(styles['undo-prompt']);
  }
}

export default class TagEditorWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  private findEditor(): AttributeEditorWrapper | null {
    return this.findComponent(AttributeEditorWrapper);
  }

  findTagRows(): TagEditorRowWrapper[] {
    return (this.findEditor()?.findRows() ?? []).map(row => new TagEditorRowWrapper(row.getElement()));
  }

  /**
   * Returns the tag row at a position, counting from 1.
   */
  findTagRow(position: number): TagEditorRowWrapper | null {
    return this.findTagRows()[position - 1] ?? null;
  }

  findAddButton(): ButtonWrapper | null {
    return this.findEditor()?.findAddButton() ?? null;
  }

  /**
   * Returns the text below the add button about the tag limit.
   */
  findLimitInfo(): ElementWrapper | null {
    return this.findEditor()?.findAdditionalInfo() ?? null;
  }

  findEmptySlot(): ElementWrapper | null {
    return this.findEditor()?.findEmptySlot() ?? null;
  }

  findLoadingStatus(): ElementWrapper | null {
    return this.findByClassName(loadingStyles.root);
  }
}
