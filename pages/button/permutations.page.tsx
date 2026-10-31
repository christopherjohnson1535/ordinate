// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button, { ButtonProps } from '~components/button';

import styles from './styles.module.scss';

const variants: ButtonProps.Variant[] = ['normal', 'primary', 'link', 'destructive'];

const addIcon = (
  <svg viewBox="0 0 16 16" width="16" height="16" focusable="false">
    <path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default function ButtonPermutations() {
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={styles.page}>
      <h1>Button permutations</h1>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th scope="col">Variant</th>
            <th scope="col">Default</th>
            <th scope="col">Disabled</th>
            <th scope="col">Loading</th>
            <th scope="col">Icon left</th>
            <th scope="col">Icon right</th>
            <th scope="col">Link</th>
            <th scope="col">External link</th>
          </tr>
        </thead>
        <tbody>
          {variants.map(variant => (
            <tr key={variant}>
              <th scope="row">{variant}</th>
              <td>
                <Button variant={variant} formAction="none">
                  Save changes
                </Button>
              </td>
              <td>
                <Button variant={variant} formAction="none" disabled={true}>
                  Save changes
                </Button>
              </td>
              <td>
                <Button variant={variant} formAction="none" loading={true} loadingText="Saving changes">
                  Save changes
                </Button>
              </td>
              <td>
                <Button variant={variant} formAction="none" iconName="add-plus">
                  Add service
                </Button>
              </td>
              <td>
                <Button variant={variant} formAction="none" iconName="angle-right" iconAlign="right">
                  Next step
                </Button>
              </td>
              <td>
                <Button variant={variant} href="#button/permutations">
                  View log
                </Button>
              </td>
              <td>
                <Button variant={variant} href="https://example.com" external={true}>
                  Read the docs
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <th scope="row">icon</th>
            <td>
              <Button variant="icon" formAction="none" ariaLabel="Edit project" iconName="edit" />
            </td>
            <td>
              <Button variant="icon" formAction="none" ariaLabel="Edit project" iconName="edit" disabled={true} />
            </td>
            <td>
              <Button variant="icon" formAction="none" ariaLabel="Edit project" iconName="edit" loading={true} />
            </td>
            <td>
              <Button variant="icon" formAction="none" ariaLabel="Add service" iconSvg={addIcon} />
            </td>
            <td />
            <td>
              <Button variant="icon" href="#button/permutations" ariaLabel="Copy link" iconName="copy" />
            </td>
            <td />
          </tr>
        </tbody>
      </table>

      <section className={styles.section}>
        <h2>Loading on click</h2>
        <div className={styles.row}>
          <Button
            variant="primary"
            formAction="none"
            loading={saving}
            loadingText="Saving changes"
            onClick={() => {
              setSaving(true);
              setTimeout(() => setSaving(false), 2000);
            }}
          >
            Save changes
          </Button>
          <Button href="#button/permutations" loading={true}>
            Loading link
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Links</h2>
        <div className={styles.row}>
          <Button href="https://example.com" target="_blank">
            New tab, default rel
          </Button>
          <Button href="https://example.com" target="_blank" rel="noopener">
            New tab, custom rel
          </Button>
          <Button href="data:text/csv,name%0Anorth-annex" download="projects.csv" iconName="angle-down">
            Download CSV
          </Button>
          <Button variant="link" external={true} formAction="none">
            External, no link
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Popups and forms</h2>
        <div className={styles.row}>
          <Button
            formAction="none"
            iconName={expanded ? 'angle-up' : 'angle-down'}
            iconAlign="right"
            ariaExpanded={expanded}
            ariaControls="button-details"
            onClick={() => setExpanded(!expanded)}
          >
            Details
          </Button>
          <Button formAction="none" iconName="caret-down-filled" iconAlign="right" ariaHaspopup="menu">
            Actions
          </Button>
          <form id="button-page-form" onSubmit={event => event.preventDefault()} />
          <Button variant="primary" form="button-page-form">
            Submit a form elsewhere
          </Button>
        </div>
        <p id="button-details" hidden={!expanded}>
          Created 2 days ago by the platform team.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Text wrapping</h2>
        <div className={styles.narrow}>
          <Button formAction="none" iconName="add-plus">
            Add a service to the north-annex project
          </Button>
          <Button formAction="none" iconName="add-plus" wrapText={false}>
            Add a service to the north-annex project
          </Button>
        </div>
      </section>

      <div className={styles.full}>
        <Button variant="primary" formAction="none" fullWidth={true}>
          Full width
        </Button>
      </div>
    </article>
  );
}
