// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import AutosuggestWrapper from '../autosuggest';
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import { OptionListWrapper } from '../internal/option-list';
import PopoverWrapper from '../popover';
import SelectWrapper from '../select';

import inputStyles from '../../../input/styles.css.js';
import optionListStyles from '../../../internal/components/option-list/styles.css.js';
import styles from '../../../property-filter/styles.css.js';

/**
 * The input and its suggestions.
 */
class FilteringInputWrapper extends OptionListWrapper {
  static rootSelector = `.${styles['filtering-input']}`;
}

/**
 * The form that edits a filter, inside the filter's popover.
 */
export class PropertyFilterEditorWrapper extends ElementWrapper {
  findPropertySelect(): SelectWrapper {
    return this.findAllComponents(SelectWrapper)[0];
  }

  findOperatorSelect(): SelectWrapper {
    return this.findAllComponents(SelectWrapper)[1];
  }

  findValueInput(): AutosuggestWrapper {
    return this.findComponent(AutosuggestWrapper)!;
  }

  private findActions(): ButtonWrapper[] {
    return this.findByClassName(styles['editor-actions'])!.findAllComponents(ButtonWrapper);
  }

  findCancelButton(): ButtonWrapper {
    return this.findActions()[0];
  }

  findApplyButton(): ButtonWrapper {
    return this.findActions()[1];
  }
}

/**
 * One filter below the input.
 */
export class PropertyFilterTokenWrapper extends ElementWrapper {
  /**
   * The button that shows the filter and opens its editor.
   */
  findLabel(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles['token-button'])!;
  }

  /**
   * The select that switches between `and` and `or`. The first filter, and every filter when
   * `hideOperations` is set, has none.
   */
  findTokenOperation(): SelectWrapper | null {
    return this.findByClassName(styles.operation)?.findComponent(SelectWrapper) ?? null;
  }

  findRemoveButton(): ButtonWrapper {
    return new ButtonWrapper(this.findByClassName(styles['token-remove'])!.getElement());
  }

  /**
   * The open editor, also when it is rendered with a portal.
   */
  findEditorDialog(): PropertyFilterEditorWrapper | null {
    const body = this.findComponent(PopoverWrapper)?.findBody();
    return body ? new PropertyFilterEditorWrapper(body.getElement()) : null;
  }

  /**
   * The editor's close button.
   */
  findEditorDismissButton(): ButtonWrapper | null {
    return this.findComponent(PopoverWrapper)?.findDismissButton() ?? null;
  }

  /**
   * Opens the editor by clicking the filter, unless it is already open.
   */
  openEditor(): PropertyFilterEditorWrapper {
    if (!this.findEditorDialog()) {
      this.findLabel().click();
    }
    return this.findEditorDialog()!;
  }
}

export default class PropertyFilterWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  private findFilteringInput(): FilteringInputWrapper {
    return this.findComponent(FilteringInputWrapper)!;
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findFilteringInput().findByClassName<HTMLInputElement>(inputStyles.input)!;
  }

  /**
   * Types new text into the input, opening the suggestions.
   */
  setInputValue(value: string): void {
    this.findNativeInput().setNativeValue(value);
  }

  focus(): void {
    this.findNativeInput().focus();
  }

  isOpen(): boolean {
    return this.findNativeInput().getElement().getAttribute('aria-expanded') === 'true';
  }

  /**
   * Returns the suggestions popup while it is open.
   */
  findDropdown(): ElementWrapper | null {
    return this.findFilteringInput().findDropdown();
  }

  /**
   * Returns the suggestions in the open list, in order, including the entered text option.
   */
  findSuggestions(): ElementWrapper[] {
    return this.findFilteringInput().findOptions();
  }

  findHighlightedSuggestion(): ElementWrapper | null {
    return this.findFilteringInput().findHighlightedOption();
  }

  /**
   * Returns the option that uses the typed text, while the list is open.
   */
  findEnteredTextOption(): ElementWrapper | null {
    return this.findFilteringInput().findByClassName(optionListStyles['option-extra']);
  }

  findSuggestionGroups(): ElementWrapper[] {
    return this.findFilteringInput().findGroups();
  }

  findStatus(): ElementWrapper | null {
    return this.findFilteringInput().findStatus();
  }

  findErrorRecoveryButton(): ButtonWrapper | null {
    return this.findFilteringInput().findErrorRecoveryButton();
  }

  /**
   * Clicks a suggestion. A number picks the suggestion at that index, counting from 1 and including the
   * entered text option. A string picks the suggestion with that text, such as `Status = running`.
   */
  selectSuggestion(indexOrValue: number | string): void {
    const suggestions = this.findSuggestions();
    const suggestion =
      typeof indexOrValue === 'number'
        ? suggestions[indexOrValue - 1]
        : suggestions.find(item => item.getElement().getAttribute('data-value') === indexOrValue);
    if (!suggestion) {
      throw new Error(`No suggestion ${typeof indexOrValue === 'number' ? 'at index' : 'with text'} ${indexOrValue}.`);
    }
    suggestion.click();
  }

  findTokens(): PropertyFilterTokenWrapper[] {
    return this.findAllByClassName(styles.token).map(token => new PropertyFilterTokenWrapper(token.getElement()));
  }

  /**
   * The button that shows or hides the filters beyond `tokenLimit`.
   */
  findTokenToggle(): ButtonWrapper | null {
    const element = this.findByClassName(styles['token-toggle']);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }

  /**
   * The "Clear filters" button, shown while there are filters and no `customFilterActions`.
   */
  findRemoveAllButton(): ButtonWrapper | null {
    const element = this.findByClassName(styles['clear-button']);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }

  findCustomControl(): ElementWrapper | null {
    return this.findByClassName(styles['custom-control']);
  }

  /**
   * The area after the filters that holds the "Clear filters" button or `customFilterActions`.
   */
  findFilterActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }

  /**
   * The result count, while there are filters and `countText` is set.
   */
  findResultsCount(): ElementWrapper | null {
    const count = this.findByClassName(styles.count);
    return count && count.getText() !== '' ? count : null;
  }
}
