// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface PaginationProps extends BaseComponentProps {
  /**
   * The page that is shown, counting from 1.
   */
  currentPageIndex: number;
  /**
   * How many pages there are. With `openEnd`, how many pages are known so far.
   */
  pagesCount: number;
  /**
   * Marks the number of pages as unknown, for data that loads page by page. An ellipsis
   * follows the last known page, and the next page button stays enabled on it.
   */
  openEnd?: boolean;
  /**
   * Disables every button, for example while a page is loading.
   */
  disabled?: boolean;
  /**
   * Shows the current page in small mono capitals before the page numbers, such as "Page 3 of 12", like the
   * sheet number in a title block. The text is the current page's `pageLabel`.
   */
  showPageLabel?: boolean;
  /**
   * Accessible names for the buttons and the list. Each one replaces the built-in message.
   * * `paginationLabel` names the list of pages.
   * * `previousPageLabel` and `nextPageLabel` name the arrow buttons.
   * * `pageLabel` returns the name of the button for one page.
   */
  ariaLabels?: PaginationProps.Labels;
  /**
   * Called when the user picks a page that exists, with its number in `detail.currentPageIndex`.
   */
  onChange?: NonCancelableEventHandler<PaginationProps.ChangeDetail>;
  /**
   * Called when the user clicks the next page button. With `openEnd`, `requestedPageAvailable`
   * is false on the last known page: load more data, then update `pagesCount` and
   * `currentPageIndex`.
   */
  onNextPageClick?: NonCancelableEventHandler<PaginationProps.PageClickDetail>;
  /**
   * Called when the user clicks the previous page button.
   */
  onPreviousPageClick?: NonCancelableEventHandler<PaginationProps.PageClickDetail>;
}

export namespace PaginationProps {
  export interface Labels {
    paginationLabel?: string;
    previousPageLabel?: string;
    nextPageLabel?: string;
    pageLabel?: (pageNumber: number) => string;
  }

  export interface ChangeDetail {
    currentPageIndex: number;
  }

  export interface PageClickDetail {
    requestedPageAvailable: boolean;
    requestedPageIndex: number;
  }
}
