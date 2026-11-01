// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { I18nProviderProps } from '../interfaces';

const messages: I18nProviderProps.Messages = {
  '@ordinate/components': {
    en: {
      alert: {
        dismissAriaLabel: 'Dismiss',
      },
      autosuggest: {
        enteredTextLabel: 'Use: "{value}"',
        errorIconAriaLabel: 'Error',
      },
      'breadcrumb-group': {
        ariaLabel: 'Breadcrumbs',
        expandAriaLabel: 'Show path',
      },
      button: {
        externalIconAriaLabel: 'Opens in a new tab',
      },
      'button-dropdown': {
        ariaLabel: 'More actions',
        externalIconAriaLabel: 'Opens in a new tab',
      },
      'copy-to-clipboard': {
        copyButtonText: 'Copy',
        copyButtonAriaLabel: 'Copy',
        copySuccessText: 'Copied',
        copyErrorText: 'Failed to copy',
      },
      dialog: {
        dismissAriaLabel: 'Close dialog',
      },
      'error-boundary': {
        headerText: 'Something went wrong',
        descriptionText: 'This part of the page could not be shown. Refresh the page to try again.',
        refreshActionText: 'Refresh page',
        feedbackLinkText: 'Send feedback',
      },
      flashbar: {
        ariaLabel: 'Notifications',
        notificationBarText: 'Notifications',
        dismissLabel: 'Dismiss',
        successIconAriaLabel: 'Success',
        errorIconAriaLabel: 'Error',
        warningIconAriaLabel: 'Warning',
        infoIconAriaLabel: 'Info',
        inProgressIconAriaLabel: 'In progress',
        successCount: '{count, plural, one {# success} other {# successes}}',
        errorCount: '{count, plural, one {# error} other {# errors}}',
        warningCount: '{count, plural, one {# warning} other {# warnings}}',
        infoCount: '{count, plural, one {# info message} other {# info messages}}',
        inProgressCount: '{count, plural, other {# in progress}}',
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
      multiselect: {
        deselectAriaLabel: 'Remove {label}',
        errorIconAriaLabel: 'Error',
        selectAllText: 'Select all',
        selectedCountText: '{count, plural, one {# option selected} other {# options selected}}',
        tokenLimitShowFewer: 'Show fewer',
        tokenLimitShowMore: 'Show {count} more',
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
      skeleton: {
        loadingText: 'Loading',
      },
      tabs: {
        dismissAriaLabel: 'Close tab',
        scrollLeftAriaLabel: 'Scroll to previous tabs',
        scrollRightAriaLabel: 'Scroll to next tabs',
      },
      'top-navigation': {
        overflowMenuTriggerText: 'More',
      },
    },
  },
};

export default messages;
