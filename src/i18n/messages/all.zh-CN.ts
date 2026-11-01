// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { I18nProviderProps } from '../interfaces';

const messages: I18nProviderProps.Messages = {
  '@ordinate/components': {
    'zh-CN': {
      alert: {
        dismissAriaLabel: '关闭',
      },
      'breadcrumb-group': {
        ariaLabel: 'Breadcrumbs',
        expandAriaLabel: 'Show path',
      },
      button: {
        externalIconAriaLabel: '在新标签页中打开',
      },
      'form-field': {
        errorIconAriaLabel: '错误',
        warningIconAriaLabel: '警告',
      },
      input: {
        clearAriaLabel: '清除',
      },
      link: {
        externalIconAriaLabel: '在新标签页中打开',
      },
      modal: {
        closeAriaLabel: '关闭',
      },
      pagination: {
        nextPageLabel: 'Next page',
        pageLabel: '{openEnd, select, true {Page {pageNumber}} other {Page {pageNumber} of {pagesCount}}}',
        paginationLabel: 'Pagination',
        previousPageLabel: 'Previous page',
      },
      select: {
        errorIconAriaLabel: '错误',
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
