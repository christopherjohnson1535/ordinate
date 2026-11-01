// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { I18nProviderProps } from '../interfaces';

const messages: I18nProviderProps.Messages = {
  '@ordinate/components': {
    en: {
      alert: {
        dismissAriaLabel: 'Dismiss',
      },
      'app-layout': {
        navigation: 'Navigation drawer',
        navigationToggle: 'Open navigation',
        navigationClose: 'Close navigation',
        tools: 'Help panel',
        toolsToggle: 'Open help panel',
        toolsClose: 'Close help panel',
        notifications: 'Notifications',
        drawers: 'Drawers',
        drawerCloseButton: 'Close {drawerName}',
        drawerResizeHandle: 'Resize {drawerName}',
      },
      'app-layout-toolbar': {
        navigationToggle: 'Open navigation',
        navigationClose: 'Close navigation',
        drawers: 'Drawers',
      },
      'attribute-editor': {
        addButtonText: 'Add new item',
        removeButtonText: 'Remove',
        itemRemovedAriaLive: 'Item {itemNumber} removed',
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
      cards: {
        loadingText: 'Loading',
      },
      'collection-preferences': {
        title: 'Preferences',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        pageSizeTitle: 'Page size',
        wrapLinesLabel: 'Wrap lines',
        wrapLinesDescription: 'Show all of the text by wrapping long lines.',
        stripedRowsLabel: 'Striped rows',
        stripedRowsDescription: 'Shade every other row.',
        contentDensityLabel: 'Compact mode',
        contentDensityDescription: 'Show the content in a denser, more compact layout.',
        stickyFirstColumnsTitle: 'Stick first columns',
        stickyFirstColumnsDescription: 'Keep the first columns in view while the content scrolls sideways.',
        stickyLastColumnsTitle: 'Stick last columns',
        stickyLastColumnsDescription: 'Keep the last columns in view while the content scrolls sideways.',
        contentDisplayTitle: 'Column preferences',
        contentDisplayDescription: 'Choose which columns to show and in what order.',
        moveUpAriaLabel: 'Move {label} up',
        moveDownAriaLabel: 'Move {label} down',
        itemMovedAnnouncement: '{label} moved to position {position} of {total}',
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
      drawer: {
        loadingText: 'Loading',
      },
      'error-boundary': {
        headerText: 'Something went wrong',
        descriptionText: 'This part of the page could not be shown. Refresh the page to try again.',
        refreshActionText: 'Refresh page',
        feedbackLinkText: 'Send feedback',
      },
      'file-input': {
        uploadButtonText: '{multiple, select, true {Choose files} other {Choose file}}',
      },
      'file-token-group': {
        errorIconAriaLabel: 'Error',
        limitShowFewer: 'Show fewer',
        limitShowMore: 'Show {count} more',
        removeFileAriaLabel: 'Remove file {fileNumber}, {fileName}',
        warningIconAriaLabel: 'Warning',
      },
      'file-upload': {
        dropzoneText: '{multiple, select, true {Drop files to upload} other {Drop file to upload}}',
        errorIconAriaLabel: 'Error',
        warningIconAriaLabel: 'Warning',
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
      'help-panel': {
        loadingText: 'Loading',
      },
      input: {
        clearAriaLabel: 'Clear',
      },
      link: {
        externalIconAriaLabel: 'Opens in a new tab',
      },
      list: {
        moveDownAriaLabel: 'Move down',
        moveUpAriaLabel: 'Move up',
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
      'panel-layout': {
        resizeHandleAriaLabel: 'Resize panel',
      },
      popover: {
        dismissAriaLabel: 'Close popover',
      },
      'prompt-input': {
        actionButtonAriaLabel: 'Send',
      },
      'property-filter': {
        allPropertiesLabel: 'All properties',
        applyActionText: 'Apply',
        cancelActionText: 'Cancel',
        clearFiltersText: 'Clear filters',
        dismissAriaLabel: 'Close editor',
        editTokenHeader: 'Edit filter',
        enteredTextLabel: 'Use: "{value}"',
        errorIconAriaLabel: 'Error',
        filteringAriaLabel: 'Filter',
        filteringPlaceholder: 'Filter by property or value',
        groupPropertiesText: 'Properties',
        groupValuesLabel: '{propertyLabel} values',
        groupValuesText: 'Values',
        operationAndText: 'and',
        operationOrText: 'or',
        operatorContainsText: 'Contains',
        operatorDoesNotContainText: 'Does not contain',
        operatorDoesNotEqualText: 'Does not equal',
        operatorDoesNotStartWithText: 'Does not start with',
        operatorEqualsText: 'Equals',
        operatorGreaterOrEqualText: 'Greater than or equal to',
        operatorGreaterText: 'Greater than',
        operatorLessOrEqualText: 'Less than or equal to',
        operatorLessText: 'Less than',
        operatorStartsWithText: 'Starts with',
        operatorText: 'Operator',
        operatorsText: 'Operators',
        propertyText: 'Property',
        removeTokenButtonAriaLabel: 'Remove filter, {token}',
        tokenAriaLabel:
          '{hasProperty, select, true {{propertyLabel} {operatorText} {value}} other {{operatorText} {value}}}',
        tokenLimitShowFewer: 'Show fewer',
        tokenLimitShowMore: 'Show {count} more',
        tokenOperatorAriaLabel: 'Combine filters with',
        valueText: 'Value',
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
      'split-panel': {
        closeButtonAriaLabel: 'Close panel',
        openButtonAriaLabel: 'Open panel',
        resizeHandleAriaLabel: 'Resize split panel',
        preferencesTitle: 'Split panel preferences',
        preferencesPositionLabel: 'Split panel position',
        preferencesPositionDescription: 'Choose where the split panel opens.',
        preferencesPositionBottom: 'Bottom',
        preferencesPositionSide: 'Side',
        preferencesPositionSideUnavailable: 'Needs a wider window.',
        preferencesConfirm: 'Confirm',
        preferencesCancel: 'Cancel',
      },
      table: {
        itemSelectionLabel: 'Select row {rowNumber}',
        loadingText: 'Loading',
      },
      'table-body-cell': {
        selectionAriaLabel: 'Select row',
      },
      'table-header-cell': {
        allItemsSelectionLabel: 'Select all rows',
        resizerRoleDescription: 'resize handle',
        selectionGroupLabel: 'Row selection',
      },
      tabs: {
        dismissAriaLabel: 'Close tab',
        scrollLeftAriaLabel: 'Scroll to previous tabs',
        scrollRightAriaLabel: 'Scroll to next tabs',
      },
      'text-filter': {
        filteringAriaLabel: 'Filter',
        filteringClearAriaLabel: 'Clear filter',
      },
      token: {
        dismissLabel: 'Remove',
      },
      'token-group': {
        dismissLabel: 'Remove {label}',
        limitShowFewer: 'Show fewer',
        limitShowMore: 'Show {count} more',
      },
      'top-navigation': {
        overflowMenuTriggerText: 'More',
      },
    },
  },
};

export default messages;
