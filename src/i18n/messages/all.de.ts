// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { I18nProviderProps } from '../interfaces';

const messages: I18nProviderProps.Messages = {
  '@ordinate/components': {
    de: {
      alert: {
        dismissAriaLabel: 'Ausblenden',
      },
      'breadcrumb-group': {
        ariaLabel: 'Breadcrumbs',
        expandAriaLabel: 'Show path',
      },
      button: {
        externalIconAriaLabel: 'Wird in einem neuen Tab geöffnet',
      },
      'form-field': {
        errorIconAriaLabel: 'Fehler',
        warningIconAriaLabel: 'Warnung',
      },
      input: {
        clearAriaLabel: 'Leeren',
      },
      link: {
        externalIconAriaLabel: 'Wird in einem neuen Tab geöffnet',
      },
      modal: {
        closeAriaLabel: 'Schließen',
      },
      pagination: {
        nextPageLabel: 'Next page',
        pageLabel: '{openEnd, select, true {Page {pageNumber}} other {Page {pageNumber} of {pagesCount}}}',
        paginationLabel: 'Pagination',
        previousPageLabel: 'Previous page',
      },
      select: {
        errorIconAriaLabel: 'Fehler',
      },
      'side-navigation': {
        ariaLabel: 'Side navigation',
        externalIconAriaLabel: 'Opens in a new tab',
      },
      tabs: {
        dismissAriaLabel: 'Close tab',
        scrollLeftAriaLabel: 'Scroll to previous tabs',
        scrollRightAriaLabel: 'Scroll to next tabs',
      },
    },
  },
};

export default messages;
