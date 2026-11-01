// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Checkbox from '~components/checkbox';
import Dropdown, { DropdownProps } from '~components/dropdown';

import styles from './styles.module.scss';

const zones = ['us-mountain-1a', 'us-mountain-1b', 'us-mountain-1c', 'us-coast-2a'];

function useOpen() {
  const [open, setOpen] = useState(false);
  return {
    open,
    toggle: () => setOpen(current => !current),
    close: () => setOpen(false),
  };
}

function FilterDropdown(props: Partial<DropdownProps> & { label: string }) {
  const { label, ...rest } = props;
  const { open, toggle, close } = useOpen();
  const [checked, setChecked] = useState<string[]>(['us-mountain-1a']);
  return (
    <Dropdown
      open={open}
      ariaRole="dialog"
      ariaLabel={label}
      onOutsideClick={close}
      onEscape={close}
      trigger={
        <Button formAction="none" iconName="filter" ariaExpanded={open} ariaHaspopup="dialog" onClick={toggle}>
          {label}
        </Button>
      }
      header={<div className={styles.header}>Zones</div>}
      content={
        <div className={styles.content}>
          {zones.map(zone => (
            <Checkbox
              key={zone}
              checked={checked.includes(zone)}
              onChange={event =>
                setChecked(current =>
                  event.detail.checked ? [...current, zone] : current.filter(item => item !== zone)
                )
              }
            >
              {zone}
            </Checkbox>
          ))}
        </div>
      }
      footer={
        <div className={styles.footer}>
          <Button variant="link" formAction="none" onClick={() => setChecked([])}>
            Clear
          </Button>
          <Button variant="primary" formAction="none" onClick={close}>
            Apply
          </Button>
        </div>
      }
      {...rest}
    />
  );
}

function TextDropdown({ label, ...rest }: Partial<DropdownProps> & { label: string }) {
  const { open, toggle, close } = useOpen();
  return (
    <Dropdown
      open={open}
      onOutsideClick={close}
      onEscape={close}
      trigger={
        <Button formAction="none" iconName="angle-down" iconAlign="right" ariaExpanded={open} onClick={toggle}>
          {label}
        </Button>
      }
      content={
        <p className={styles.text}>
          Nodes in this project restart one zone at a time during the weekly maintenance window, so at least three zones
          keep serving traffic.
        </p>
      }
      {...rest}
    />
  );
}

export default function DropdownSimple() {
  return (
    <article className={styles.page}>
      <h1>Dropdown</h1>

      <section className={styles.section}>
        <h2>With header and footer</h2>
        <div className={styles.row}>
          <FilterDropdown label="Filter zones" />
          <FilterDropdown label="Minimum medium" minWidth="medium" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Maximum widths</h2>
        <div className={styles.row}>
          <TextDropdown label="Small" maxWidth="small" />
          <TextDropdown label="Medium" maxWidth="medium" />
          <TextDropdown label="Large" maxWidth="large" />
          <TextDropdown label="Trigger width" minWidth="trigger" maxWidth="small" />
        </div>
      </section>

      <section className={styles.end}>
        <TextDropdown label="At the end edge" maxWidth="medium" />
      </section>
    </article>
  );
}
