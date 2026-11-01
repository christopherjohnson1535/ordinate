// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import Table, { TableProps } from '~components/table';

import { columnDefinitions, Instance, makeInstances, notesColumn } from './data';

import styles from './styles.module.scss';

const items = makeInstances(5);
const sortingColumn = columnDefinitions[0];

function Example(props: Partial<TableProps<Instance>> & { title: string }) {
  const { title, ...rest } = props;
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <Table
        items={items}
        columnDefinitions={columnDefinitions}
        trackBy="id"
        sortingColumn={sortingColumn}
        header={
          <Header counter={`(${items.length})`} actions={<Button>Launch</Button>}>
            Instances
          </Header>
        }
        {...rest}
      />
    </section>
  );
}

const emptyState = (
  <Box textAlign="center">
    <Box variant="strong">No instances</Box>
    <Box variant="p">No instances to show in this region.</Box>
    <Button>Launch instance</Button>
  </Box>
);

export default function TablePermutations() {
  return (
    <article className={styles.page}>
      <h1>Table</h1>

      <Example title="Container" footer={<a href="#all">View all instances</a>} />
      <Example
        title="Multiple selection"
        selectionType="multi"
        selectedItems={[items[0], items[2]]}
        isItemDisabled={item => item.state === 'error'}
      />
      <Example title="Single selection" selectionType="single" selectedItems={[items[1]]} />
      <Example title="Striped rows, sorted descending" stripedRows={true} sortingDescending={true} />
      <Example title="Compact content density" contentDensity="compact" selectionType="multi" />
      <Example
        title="Wrapped lines"
        wrapLines={true}
        columnDefinitions={[columnDefinitions[0], columnDefinitions[2], notesColumn]}
      />
      <Example title="Sorting disabled" sortingDisabled={true} />
      <Example title="Loading" loading={true} loadingText="Loading instances" items={[]} />
      <Example title="Empty" items={[]} empty={emptyState} />

      <section className={styles.section}>
        <h2>Embedded in a container</h2>
        <Container header={<Header>Fleet</Header>}>
          <Table
            variant="embedded"
            items={items.slice(0, 3)}
            columnDefinitions={columnDefinitions.slice(0, 4)}
            header={<Header variant="h3">Instances</Header>}
            footer={<a href="#all">View all</a>}
          />
        </Container>
      </section>

      <Example title="Borderless" variant="borderless" />
      <Example title="Full page" variant="full-page" header={<Header variant="h1">Instances</Header>} />
    </article>
  );
}
