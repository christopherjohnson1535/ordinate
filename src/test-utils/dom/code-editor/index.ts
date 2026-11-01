// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import CheckboxWrapper from '../checkbox';
import { ComponentWrapper, ElementWrapper } from '../core';
import ModalWrapper from '../modal';
import RadioGroupWrapper from '../radio-group';

import styles from '../../../code-editor/styles.css.js';

function wrapButton(parent: ElementWrapper, className: string): ButtonWrapper | null {
  const element = parent.getElement().querySelector<HTMLElement>(`.${className}`);
  return element ? new ButtonWrapper(element) : null;
}

export class CodeEditorPreferencesModalWrapper extends ModalWrapper {
  findWrapLinesCheckbox(): CheckboxWrapper {
    return this.findByClassName(styles['preferences-wrap-lines'])!.findComponent(CheckboxWrapper)!;
  }

  findShowGutterCheckbox(): CheckboxWrapper {
    return this.findByClassName(styles['preferences-show-gutter'])!.findComponent(CheckboxWrapper)!;
  }

  findThemeRadioGroup(): RadioGroupWrapper {
    return this.findByClassName(styles['preferences-theme'])!.findComponent(RadioGroupWrapper)!;
  }

  findCancelButton(): ButtonWrapper {
    return wrapButton(this, styles['preferences-cancel'])!;
  }

  findConfirmButton(): ButtonWrapper {
    return wrapButton(this, styles['preferences-confirm'])!;
  }
}

export default class CodeEditorWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The editing area, including the loading and error states.
   */
  findEditor(): ElementWrapper {
    return this.findByClassName(styles.editor)!;
  }

  /**
   * The editable element of the loaded editor, or `null` while the editor loads.
   */
  findEditorContent(): ElementWrapper | null {
    return this.findByClassName(styles.surface)?.find('[contenteditable]') ?? null;
  }

  findLoadingState(): ElementWrapper | null {
    return this.findByClassName(styles['loading-state']);
  }

  findErrorState(): ElementWrapper | null {
    return this.findByClassName(styles['error-state']);
  }

  /**
   * The button in the error state that loads the editor engine again.
   */
  findErrorRecoveryButton(): ButtonWrapper | null {
    return wrapButton(this, styles['error-state-recovery']);
  }

  findStatusBar(): ElementWrapper {
    return this.findByClassName(styles['status-bar'])!;
  }

  findLanguageLabel(): ElementWrapper {
    return this.findByClassName(styles.language)!;
  }

  /**
   * The cursor position in the status bar, shown once the editor has loaded.
   */
  findCursorPosition(): ElementWrapper | null {
    return this.findByClassName(styles['cursor-position']);
  }

  findErrorsCount(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles['errors-count'])!;
  }

  findWarningsCount(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles['warnings-count'])!;
  }

  /**
   * The status bar toggle that makes Tab move focus out of the editor.
   */
  findTabFocusToggle(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles['tab-focus-toggle'])!;
  }

  findPreferencesButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles['preferences-button'])!;
  }

  /**
   * The preferences modal, or `null` while it is closed.
   */
  findPreferencesModal(): CodeEditorPreferencesModalWrapper | null {
    return this.findComponent(CodeEditorPreferencesModalWrapper);
  }

  findResizeHandle(): ElementWrapper {
    return this.findByClassName(styles['resize-handle'])!;
  }
}
