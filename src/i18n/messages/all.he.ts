// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { I18nProviderProps } from '../interfaces';

const messages: I18nProviderProps.Messages = {
  '@ordinate/components': {
    he: {
      alert: {
        dismissAriaLabel: 'התעלמות',
      },
      'breadcrumb-group': {
        ariaLabel: 'Breadcrumbs',
        expandAriaLabel: 'Show path',
      },
      button: {
        externalIconAriaLabel: 'נפתח בכרטיסייה חדשה',
      },
      'form-field': {
        errorIconAriaLabel: 'שגיאה',
        warningIconAriaLabel: 'אזהרה',
      },
      input: {
        clearAriaLabel: 'ניקוי',
      },
      link: {
        externalIconAriaLabel: 'נפתח בכרטיסייה חדשה',
      },
      modal: {
        closeAriaLabel: 'סגירה',
      },
      pagination: {
        nextPageLabel: 'Next page',
        pageLabel: '{openEnd, select, true {Page {pageNumber}} other {Page {pageNumber} of {pagesCount}}}',
        paginationLabel: 'Pagination',
        previousPageLabel: 'Previous page',
      },
      select: {
        errorIconAriaLabel: 'שגיאה',
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
