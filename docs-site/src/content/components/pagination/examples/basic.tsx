// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Pagination from '@ordinate/components/pagination';

export default function Basic() {
  const [page, setPage] = useState(3);

  return (
    <Pagination
      currentPageIndex={page}
      pagesCount={12}
      onChange={event => setPage(event.detail.currentPageIndex)}
      ariaLabels={{
        paginationLabel: 'Pages of bookings',
        previousPageLabel: 'Previous page of bookings',
        nextPageLabel: 'Next page of bookings',
        pageLabel: pageNumber => `Bookings, page ${pageNumber} of 12`,
      }}
    />
  );
}
