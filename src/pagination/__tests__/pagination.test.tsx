// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import I18nProvider from '../../../lib/components/i18n';
import Pagination, { PaginationProps } from '../../../lib/components/pagination';
import { getPageItems } from '../../../lib/components/pagination/utils';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Controlled(props: Partial<PaginationProps> & { onChangeSpy?: (index: number) => void }) {
  const { onChangeSpy, ...rest } = props;
  const [page, setPage] = useState(props.currentPageIndex ?? 1);
  return (
    <Pagination
      pagesCount={10}
      {...rest}
      currentPageIndex={page}
      onChange={event => {
        onChangeSpy?.(event.detail.currentPageIndex);
        setPage(event.detail.currentPageIndex);
      }}
    />
  );
}

const wrapper = () => createWrapper().findPagination()!;
const shownPages = () =>
  wrapper()
    .findPageNumbers()
    .map(button => button.getText());

describe('getPageItems', () => {
  test('shows every page when they fit', () => {
    expect(getPageItems(1, 7, false)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('collapses the far side of a long range', () => {
    expect(getPageItems(2, 20, false)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
    expect(getPageItems(19, 20, false)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
  });

  test('collapses both sides around a middle page', () => {
    expect(getPageItems(10, 20, false)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
  });

  test('ends an open range with an ellipsis and no last page', () => {
    expect(getPageItems(1, 3, true)).toEqual([1, 2, 3, 'ellipsis-end']);
    expect(getPageItems(2, 12, true)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end']);
    expect(getPageItems(12, 12, true)).toEqual([1, 'ellipsis-start', 11, 12, 'ellipsis-end']);
  });
});

describe('Pagination', () => {
  test('renders page buttons with the current page marked', () => {
    render(<Pagination currentPageIndex={3} pagesCount={5} />);
    const current = screen.getByRole('button', { name: 'Page 3 of 5' });
    expect(current).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Page 2 of 5' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('list', { name: 'Pagination' })).toBeInTheDocument();
  });

  test('clicking a page fires onChange with its number', () => {
    const onChangeSpy = vi.fn();
    render(<Controlled onChangeSpy={onChangeSpy} />);
    fireEvent.click(screen.getByRole('button', { name: 'Page 4 of 10' }));
    expect(onChangeSpy).toHaveBeenCalledWith(4);
    expect(wrapper().findCurrentPage().getText()).toBe('4');
  });

  test('clicking the current page does not fire onChange', () => {
    const onChange = vi.fn();
    render(<Pagination currentPageIndex={2} pagesCount={4} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Page 2 of 4' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('the arrows move one page and report the request', () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    const onChangeSpy = vi.fn();
    render(
      <Controlled
        currentPageIndex={5}
        onChangeSpy={onChangeSpy}
        onNextPageClick={event => onNext(event.detail)}
        onPreviousPageClick={event => onPrevious(event.detail)}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onNext).toHaveBeenCalledWith({ requestedPageAvailable: true, requestedPageIndex: 6 });
    expect(onChangeSpy).toHaveBeenLastCalledWith(6);
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPrevious).toHaveBeenCalledWith({ requestedPageAvailable: true, requestedPageIndex: 5 });
    expect(onChangeSpy).toHaveBeenLastCalledWith(5);
  });

  test('disables the arrows at either end', () => {
    const { rerender } = render(<Pagination currentPageIndex={1} pagesCount={3} />);
    expect(wrapper().findPreviousPageButton().getElement()).toBeDisabled();
    expect(wrapper().findNextPageButton().getElement()).toBeEnabled();
    rerender(<Pagination currentPageIndex={3} pagesCount={3} />);
    expect(wrapper().findPreviousPageButton().getElement()).toBeEnabled();
    expect(wrapper().findNextPageButton().getElement()).toBeDisabled();
  });

  test('collapses long ranges with ellipses around the current page', () => {
    render(<Pagination currentPageIndex={10} pagesCount={20} />);
    expect(shownPages()).toEqual(['1', '9', '10', '11', '20']);
    expect(wrapper().findEllipses()).toHaveLength(2);
  });

  test('an open end keeps next enabled and asks for more pages on the last known page', () => {
    const onNext = vi.fn();
    const onChange = vi.fn();
    render(
      <Pagination
        currentPageIndex={3}
        pagesCount={3}
        openEnd={true}
        onChange={onChange}
        onNextPageClick={event => onNext(event.detail)}
      />
    );
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'true');
    expect(wrapper().findEllipses()).toHaveLength(1);
    const next = wrapper().findNextPageButton();
    expect(next.getElement()).toBeEnabled();
    next.click();
    expect(onNext).toHaveBeenCalledWith({ requestedPageAvailable: false, requestedPageIndex: 4 });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('disabled turns off every button', () => {
    render(<Pagination currentPageIndex={2} pagesCount={3} disabled={true} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
    expect(wrapper().isDisabled()).toBe(true);
  });

  test('clamps the current page into range', () => {
    render(<Pagination currentPageIndex={9} pagesCount={3} />);
    expect(wrapper().findCurrentPage().getText()).toBe('3');
  });

  test('ariaLabels replace the built-in names', () => {
    render(
      <Pagination
        currentPageIndex={1}
        pagesCount={2}
        ariaLabels={{
          paginationLabel: 'Results pages',
          nextPageLabel: 'Later results',
          previousPageLabel: 'Earlier results',
          pageLabel: page => `Results page ${page}`,
        }}
      />
    );
    expect(screen.getByRole('list', { name: 'Results pages' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Later results' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Earlier results' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Results page 2' })).toBeInTheDocument();
  });

  test('reads its names from the locale', () => {
    render(
      <I18nProvider
        locale="de"
        messages={[
          {
            '@ordinate/components': {
              de: { pagination: { nextPageLabel: 'Nächste Seite', pageLabel: 'Seite {pageNumber}' } },
            },
          },
        ]}
      >
        <Pagination currentPageIndex={1} pagesCount={2} />
      </I18nProvider>
    );
    expect(screen.getByRole('button', { name: 'Nächste Seite' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Seite 2' })).toBeInTheDocument();
  });

  test('passes id and data attributes to the root', () => {
    render(<Pagination currentPageIndex={1} pagesCount={2} id="pages" data-testid="pages" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'pages');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'pages');
  });
});

describe('Pagination test utilities and accessibility', () => {
  test('the wrapper finds page numbers by index', () => {
    render(<Controlled currentPageIndex={1} pagesCount={5} />);
    wrapper().findPageNumberByIndex(4)!.click();
    expect(wrapper().findCurrentPage().getText()).toBe('4');
    expect(wrapper().findPageNumberByIndex(9)).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Pagination currentPageIndex={10} pagesCount={20} />
        <Pagination currentPageIndex={2} pagesCount={4} openEnd={true} ariaLabels={{ paginationLabel: 'Log pages' }} />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
