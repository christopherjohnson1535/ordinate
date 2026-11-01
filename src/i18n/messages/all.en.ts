// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { I18nProviderProps } from '../interfaces';

const messages: I18nProviderProps.Messages = {
  '@ordinate/components': {
    en: {
      alert: {
        dismissAriaLabel: 'Dismiss',
      },
      'breadcrumb-group': {
        ariaLabel: 'Breadcrumbs',
        expandAriaLabel: 'Show path',
      },
      button: {
        externalIconAriaLabel: 'Opens in a new tab',
      },
      dialog: {
        dismissAriaLabel: 'Close dialog',
      },
      'form-field': {
        errorIconAriaLabel: 'Error',
        warningIconAriaLabel: 'Warning',
      },
      input: {
        clearAriaLabel: 'Clear',
      },
      link: {
        externalIconAriaLabel: 'Opens in a new tab',
      },
      modal: {
        closeAriaLabel: 'Close',
      },
      pagination: {
        nextPageLabel: 'Next page',
        pageLabel: '{openEnd, select, true {Page {pageNumber}} other {Page {pageNumber} of {pagesCount}}}',
        paginationLabel: 'Pagination',
        previousPageLabel: 'Previous page',
      },
      popover: {
        dismissAriaLabel: 'Close popover',
      },
      select: {
        errorIconAriaLabel: 'Error',
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
