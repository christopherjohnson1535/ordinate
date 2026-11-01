// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import HelpPanel from '~components/help-panel';

import styles from './styles.module.scss';

export default function HelpPanelSimple() {
  return (
    <article className={styles.page}>
      <h1>Help panel</h1>
      <p className={styles.note}>
        Help panels usually sit in the app layout&apos;s tools slot. Each frame below is as wide as that slot.
      </p>
      <div className={styles.row}>
        <section className={styles.section}>
          <h2>Header, content and footer</h2>
          <div className={styles.frame}>
            <HelpPanel
              header="Endpoints"
              footer={
                <>
                  <h3>Learn more</h3>
                  <ul>
                    <li>
                      <a href="#help-panel/simple">Private endpoints</a>
                    </li>
                    <li>
                      <a href="#help-panel/simple">Certificates</a>
                    </li>
                  </ul>
                </>
              }
            >
              <p>An endpoint is the address clients use to reach a project. Each project has one public endpoint.</p>
              <h3>Protocols</h3>
              <ul>
                <li>HTTPS on port 443</li>
                <li>
                  gRPC on port <code>8443</code>
                </li>
              </ul>
              <pre>ordinate endpoints list</pre>
            </HelpPanel>
          </div>
        </section>
        <section className={styles.section}>
          <h2>Loading</h2>
          <div className={styles.frame}>
            <HelpPanel header="Endpoints" loading={true} loadingText="Loading help content" />
          </div>
        </section>
        <section className={styles.section}>
          <h2>Content only</h2>
          <div className={styles.frame}>
            <HelpPanel>
              <p>A panel without a header, for short hints.</p>
            </HelpPanel>
          </div>
        </section>
      </div>
    </article>
  );
}
