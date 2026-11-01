// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { I18nProviderProps } from '../interfaces';

const messages: I18nProviderProps.Messages = {
  '@ordinate/components': {
    it: {
      alert: {
        dismissAriaLabel: 'Ignora',
      },
      'breadcrumb-group': {
        ariaLabel: 'Breadcrumbs',
        expandAriaLabel: 'Show path',
      },
      button: {
        externalIconAriaLabel: 'Si apre in una nuova scheda',
      },
      'form-field': {
        errorIconAriaLabel: 'Errore',
        warningIconAriaLabel: 'Avviso',
      },
      input: {
        clearAriaLabel: 'Cancella',
      },
      link: {
        externalIconAriaLabel: 'Si apre in una nuova scheda',
      },
      modal: {
        closeAriaLabel: 'Chiudi',
      },
      pagination: {
        nextPageLabel: 'Next page',
        pageLabel: '{openEnd, select, true {Page {pageNumber}} other {Page {pageNumber} of {pagesCount}}}',
        paginationLabel: 'Pagination',
        previousPageLabel: 'Previous page',
      },
      select: {
        errorIconAriaLabel: 'Errore',
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
