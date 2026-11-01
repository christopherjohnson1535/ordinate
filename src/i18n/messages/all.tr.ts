// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { I18nProviderProps } from '../interfaces';

const messages: I18nProviderProps.Messages = {
  '@ordinate/components': {
    tr: {
      alert: {
        dismissAriaLabel: 'Kapat',
      },
      'breadcrumb-group': {
        ariaLabel: 'Breadcrumbs',
        expandAriaLabel: 'Show path',
      },
      button: {
        externalIconAriaLabel: 'Yeni sekmede açılır',
      },
      'form-field': {
        errorIconAriaLabel: 'Hata',
        warningIconAriaLabel: 'Uyarı',
      },
      input: {
        clearAriaLabel: 'Temizle',
      },
      link: {
        externalIconAriaLabel: 'Yeni sekmede açılır',
      },
      modal: {
        closeAriaLabel: 'Kapat',
      },
      pagination: {
        nextPageLabel: 'Next page',
        pageLabel: '{openEnd, select, true {Page {pageNumber}} other {Page {pageNumber} of {pagesCount}}}',
        paginationLabel: 'Pagination',
        previousPageLabel: 'Previous page',
      },
      select: {
        errorIconAriaLabel: 'Hata',
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
