// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Alert from '@ordinate/components/alert';
import Table from '@ordinate/components/table';

import { CodeBlock, Command, DocSection, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';

declare const __ORDINATE_VERSION__: string;

const options = [
  { option: 'topic', meaning: 'A component or guide to open, such as Table, side-navigation or revisions.' },
  { option: '--open, -o', meaning: 'Opens the documentation in the default browser.' },
  {
    option: '--port <n>',
    meaning: 'The port to listen on. Defaults to 4180; the next free port is used if it is taken.',
  },
  {
    option: '--host <name>',
    meaning: 'The address to listen on. Defaults to 127.0.0.1, so only this machine can reach it.',
  },
  { option: '--path', meaning: 'Prints the folder the built documentation is in, and exits.' },
  { option: '--site <dir>', meaning: 'Serves another build of the site, such as docs-site/dist in a checkout.' },
  { option: '--version', meaning: 'Prints the version of the documentation.' },
];

function Page() {
  return (
    <>
      <Prose>
        <p>
          These pages are a package of their own, <code>@ordinate/docs</code>, released with every version of the
          library and numbered the same. Install the one that matches your project and you can read the documentation
          for exactly the components you have, with no network. It works the way <code>rustup doc</code> opens the Rust
          documentation that came with your toolchain.
        </p>
      </Prose>

      <DocSection id="install" number={1} title="Install and open">
        <Prose>
          <p>Add the docs to the project as a development dependency, then start them:</p>
        </Prose>
        <Command>npm install --save-dev @ordinate/docs</Command>
        <Command>npx ordinate-docs --open</Command>
        <Prose>
          <p>
            The command serves the site from <code>http://127.0.0.1:4180</code> and opens it in your browser. Stop it
            with Ctrl+C. To read the docs once without installing them, run the package directly:
          </p>
        </Prose>
        <Command>npx @ordinate/docs --open</Command>
        <Alert type="note" header="Versions">
          You are reading version {__ORDINATE_VERSION__}. When the project in the current folder uses another version of{' '}
          <code>@ordinate/components</code>, <code>ordinate-docs</code> says so when it starts and names the docs
          package that matches.
        </Alert>
      </DocSection>

      <DocSection id="topics" number={2} title="Open a page by name">
        <Prose>
          <p>
            Name a component or a guide after the command to start on its page. Component names can be written as you
            import them or as their folder.
          </p>
        </Prose>
        <Command>npx ordinate-docs Table --open</Command>
        <Command>npx ordinate-docs side-navigation --open</Command>
        <Command>npx ordinate-docs revisions --open</Command>
      </DocSection>

      <DocSection id="options" number={3} title="Options">
        <Table
          variant="embedded"
          wrapLines={true}
          trackBy="option"
          items={options}
          ariaLabels={{ tableLabel: 'Options of ordinate-docs' }}
          columnDefinitions={[
            { id: 'option', header: 'Option', cell: item => <code>{item.option}</code>, width: 200 },
            { id: 'meaning', header: 'What it does', cell: item => item.meaning },
          ]}
        />
      </DocSection>

      <DocSection id="scripts" number={4} title="From a package script">
        <Prose>
          <p>A script in the project&apos;s package.json saves everyone remembering the command:</p>
        </Prose>
        <CodeBlock
          language="json"
          label="package.json"
          code={`{
  "scripts": {
    "docs:ordinate": "ordinate-docs --open"
  }
}`}
        />
      </DocSection>

      <DocSection id="checkout" number={5} title="In a checkout of Ordinate">
        <Prose>
          <p>
            Working on the library itself, build the docs from the source. The first command builds the components,
            builds the site and serves it; the second is the same site with hot reload, for writing pages.
          </p>
        </Prose>
        <Command>npm run docs</Command>
        <Command>npm run docs:dev</Command>
        <Prose>
          <p>
            <code>npm run docs:package</code> writes the publishable package to <code>lib/docs</code>. The site is plain
            files with relative links, so <code>docs-site/dist</code> can also be put behind any web server, at any
            path.
          </p>
        </Prose>
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'running-locally',
  title: 'Running the docs locally',
  summary: 'Install the documentation that matches your version and read it with no network.',
  order: 10,
  keywords: ['ordinate-docs', 'offline', '@ordinate/docs', 'rustup doc', 'npx'],
  Page,
};

export default guide;
