// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Container from '~components/container';
import TextContent from '~components/text-content';

import styles from './styles.module.scss';

export default function TextContentSimple() {
  return (
    <article className={styles.page}>
      <Container>
        <TextContent>
          <h1>Rotating access keys</h1>
          <p>
            Access keys sign every request your build agents make. Rotate them every <strong>90 days</strong>, or at
            once if a key may have leaked. Read the <a href="#">key policy</a> for the rules that apply to production
            accounts.
          </p>
          <h2>Before you start</h2>
          <ul>
            <li>
              Find every client that uses the key. Run <code>ord keys usage --key deploy-2026</code> to list them.
            </li>
            <li>
              Make sure you can sign in with another method.
              <ul>
                <li>A second key</li>
                <li>A hardware token</li>
              </ul>
            </li>
          </ul>
          <h3>Steps</h3>
          <ol>
            <li>Create a second key for the same user.</li>
            <li>Update each client to use the new key, and confirm it can still deploy.</li>
            <li>Deactivate the old key, wait a day, then delete it.</li>
          </ol>
          <pre>
            {`$ ord keys create --user deploy
Created key AK-7F3Q... (deploy-2027)`}
          </pre>
          <blockquote>
            <p>A key that was never rotated is a key that was never audited.</p>
          </blockquote>
          <h4>Automating rotation</h4>
          <p>
            Scheduled rotation is available for service users. <small>Requires agent 3.4 or later.</small>
          </p>
          <h5>Related</h5>
          <p>
            <a href="#">Signing requests</a> and <a href="#">audit logs</a>.
          </p>
          <hr />
          <small>Last reviewed on 31 October 2026.</small>
        </TextContent>
      </Container>

      <Container>
        <TextContent>
          <h2>Components inside keep their own look</h2>
          <p>Only plain elements written directly inside are styled.</p>
          <Button formAction="none">A button</Button>
        </TextContent>
      </Container>
    </article>
  );
}
