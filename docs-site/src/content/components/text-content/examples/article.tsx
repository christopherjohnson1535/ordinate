// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import TextContent from '@ordinate/components/text-content';

export default function Article() {
  return (
    <TextContent>
      <h2>Rotating access keys</h2>
      <p>
        Access keys sign every request your build agents make. Rotate them every <strong>90 days</strong>, or at once if
        a key may have leaked. Read the <a href="#/components/text-content">key policy</a> for the rules that apply to
        production projects.
      </p>
      <h3>Before you start</h3>
      <ul>
        <li>
          Find every client that uses the key. Run <code>ord keys usage --key deploy-2026</code> to list them.
        </li>
        <li>Make sure you can still sign in another way, such as with a hardware token.</li>
      </ul>
      <h3>Steps</h3>
      <ol>
        <li>Create a second key for the same user.</li>
        <li>Update each client to use the new key, and confirm it can still deploy.</li>
        <li>Deactivate the old key, wait a day, then delete it.</li>
      </ol>
      <pre>{`$ ord keys create --user deploy
Created key AK-7F3Q... (deploy-2027)`}</pre>
      <hr />
      <small>Last reviewed by Dana Ruiz on 31 October 2026.</small>
    </TextContent>
  );
}
