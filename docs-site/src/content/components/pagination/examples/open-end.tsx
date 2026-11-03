// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Box from '@ordinate/components/box';
import Pagination from '@ordinate/components/pagination';
import SpaceBetween from '@ordinate/components/space-between';

export default function OpenEnd() {
  const [page, setPage] = useState(1);
  const [loadedPages, setLoadedPages] = useState(3);
  const [loading, setLoading] = useState(false);

  // Stands in for a request that fetches the next page of log events.
  useEffect(() => {
    if (!loading) {
      return;
    }
    const timer = window.setTimeout(() => {
      setLoadedPages(count => count + 1);
      setPage(loadedPages + 1);
      setLoading(false);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [loading, loadedPages]);

  return (
    <SpaceBetween size="m">
      <Pagination
        currentPageIndex={page}
        pagesCount={loadedPages}
        openEnd={true}
        disabled={loading}
        onChange={event => setPage(event.detail.currentPageIndex)}
        onNextPageClick={event => {
          if (!event.detail.requestedPageAvailable) {
            setLoading(true);
          }
        }}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {loading ? 'Loading more events…' : `Showing page ${page} of the events loaded so far.`}
      </Box>
    </SpaceBetween>
  );
}
