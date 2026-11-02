// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Pagination from '~components/pagination';

import styles from '../form-controls.module.scss';

function Example({
  pagesCount,
  initial = 1,
  openEnd = false,
}: {
  pagesCount: number;
  initial?: number;
  openEnd?: boolean;
}) {
  const [page, setPage] = useState(initial);
  const [count, setCount] = useState(pagesCount);
  return (
    <Pagination
      currentPageIndex={page}
      pagesCount={count}
      openEnd={openEnd}
      onChange={event => setPage(event.detail.currentPageIndex)}
      onNextPageClick={event => {
        if (!event.detail.requestedPageAvailable) {
          // Stands in for loading the next page of data.
          setCount(count + 1);
          setPage(event.detail.requestedPageIndex);
        }
      }}
    />
  );
}

export default function PaginationPermutations() {
  return (
    <article className={styles.page}>
      <h1>Pagination</h1>

      <section className={styles.section}>
        <h2>Few pages</h2>
        <Example pagesCount={5} initial={2} />
      </section>

      <section className={styles.section}>
        <h2>Many pages</h2>
        <Example pagesCount={20} />
        <Example pagesCount={20} initial={10} />
        <Example pagesCount={20} initial={19} />
      </section>

      <section className={styles.section}>
        <h2>Open end</h2>
        <Example pagesCount={3} initial={3} openEnd={true} />
        <Example pagesCount={12} initial={9} openEnd={true} />
      </section>

      <section className={styles.section}>
        <h2>Page label</h2>
        <Pagination currentPageIndex={3} pagesCount={12} showPageLabel={true} />
        <Pagination
          currentPageIndex={3}
          pagesCount={12}
          showPageLabel={true}
          ariaLabels={{ pageLabel: page => `Sheet ${page} of 12` }}
        />
      </section>

      <section className={styles.section}>
        <h2>Over 100 pages</h2>
        <Example pagesCount={140} initial={120} />
      </section>

      <section className={styles.section}>
        <h2>Disabled</h2>
        <Pagination currentPageIndex={4} pagesCount={9} disabled={true} />
      </section>

      <section className={styles.section}>
        <h2>One page</h2>
        <Pagination currentPageIndex={1} pagesCount={1} />
      </section>
    </article>
  );
}
