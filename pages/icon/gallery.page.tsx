// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon, { IconProps } from '~components/icon';
// The generated map holds one entry per file in src/icon/icons, so new icons show up here after a build.
import icons from '~components/icon/generated/icons';

import styles from './styles.module.scss';

const names = Object.keys(icons) as IconProps.Name[];

const sizes: IconProps.Size[] = ['small', 'normal', 'medium', 'big', 'large'];

const variants: IconProps.Variant[] = ['normal', 'subtle', 'disabled', 'error', 'warning', 'success', 'info', 'link'];

export default function IconGallery() {
  return (
    <article className={styles.page}>
      <h1>Icon gallery</h1>
      <section className={styles.section}>
        <h2>Sizes</h2>
        <div className={styles.row}>
          {sizes.map(size => (
            <figure key={size} className={styles.sample}>
              <Icon name="settings" size={size} />
              <figcaption>{size}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h2>Variants</h2>
        <div className={styles.row}>
          {variants.map(variant => (
            <figure key={variant} className={styles.sample}>
              <Icon name="status-info" size="medium" variant={variant} />
              <figcaption>{variant}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h2>All icons ({names.length})</h2>
        <ul className={styles.grid}>
          {names.map(name => (
            <li key={name} className={styles.cell}>
              <Icon name={name} size="medium" />
              <span className={styles.name}>{name}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
