// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Pagination from '@ordinate/components/pagination';

const sheets = 24;

export default function PageLabel() {
  const [sheet, setSheet] = useState(7);

  return (
    <Pagination
      currentPageIndex={sheet}
      pagesCount={sheets}
      showPageLabel={true}
      onChange={event => setSheet(event.detail.currentPageIndex)}
      ariaLabels={{
        paginationLabel: 'Sheets of the drawing set',
        previousPageLabel: 'Previous sheet',
        nextPageLabel: 'Next sheet',
        pageLabel: number => `Sheet ${number} of ${sheets}`,
      }}
    />
  );
}
