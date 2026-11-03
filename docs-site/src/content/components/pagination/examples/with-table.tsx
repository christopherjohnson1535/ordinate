// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import Table from '@ordinate/components/table';

interface Deployment {
  id: string;
  service: string;
  image: string;
  by: string;
}

const people = ['Dana Ruiz', 'Sam Okafor', 'Lena Park'];
const services = ['north-annex-web', 'atrium-api', 'gallery-east', 'lobby-cache'];

const deployments: Deployment[] = Array.from({ length: 23 }, (_, index) => ({
  id: `d-${String(4180 - index)}`,
  service: services[index % services.length],
  image: `web:v2.${23 - index}`,
  by: people[index % people.length],
}));

const pageSize = 5;

export default function WithTable() {
  const [page, setPage] = useState(1);
  const pagesCount = Math.ceil(deployments.length / pageSize);
  const items = deployments.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Table
      items={items}
      trackBy="id"
      header={<Header counter={`(${deployments.length})`}>Deployments</Header>}
      columnDefinitions={[
        { id: 'id', header: 'ID', cell: item => item.id, contentType: 'identifier', isRowHeader: true },
        { id: 'service', header: 'Service', cell: item => item.service },
        { id: 'image', header: 'Image', cell: item => item.image, contentType: 'identifier' },
        { id: 'by', header: 'Deployed by', cell: item => item.by },
      ]}
      pagination={
        <Pagination
          currentPageIndex={page}
          pagesCount={pagesCount}
          onChange={event => setPage(event.detail.currentPageIndex)}
        />
      }
    />
  );
}
