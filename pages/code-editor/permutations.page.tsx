// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import CodeEditor, { CodeEditorProps } from '~components/code-editor';
import FormField from '~components/form-field';
import SegmentedControl from '~components/segmented-control';

import styles from '../form-controls.module.scss';

type Language = CodeEditorProps.Language;

const samples: Record<Exclude<Language, 'text'>, string> = {
  javascript: `// Retries a request with exponential backoff.
export async function withRetry(request, attempts = 3) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await request();
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 100));
    }
  }
  throw new Error('Request failed after ' + attempts + ' attempts');
}
`,
  typescript: `interface Instance {
  id: string;
  zone: 'eu-west-1a' | 'eu-west-1b';
  running: boolean;
}

export function countRunning(instances: ReadonlyArray<Instance>): number {
  return instances.filter(instance => instance.running).length;
}
`,
  json: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::drawings/*",
      "Condition": { "Bool": { "aws:SecureTransport": true } }
    }
  ]
}
`,
  yaml: `service: survey-api
runtime: python3.12
regions:
  - eu-west-1
  - us-east-1
scaling:
  min: 2
  max: 12   # keep headroom for month-end reports
`,
  html: `<section class="plate" aria-labelledby="title">
  <h2 id="title">Elevation, north face</h2>
  <img src="north.svg" alt="North elevation at 1:50" />
</section>
`,
  css: `.plate {
  border: 1px solid var(--ink);
  padding: 24px;
  font-family: 'IBM Plex Mono', monospace;
}
`,
  python: `def area(width: float, depth: float) -> float:
    """Returns the floor area in square meters."""
    if width <= 0 or depth <= 0:
        raise ValueError("dimensions must be positive")
    return round(width * depth, 2)
`,
  markdown: `# Survey notes

The **north wall** is out of plumb by *12 mm*.

- Recheck the datum
- Photograph the cornice
`,
};

const languages = Object.keys(samples) as Array<keyof typeof samples>;

const labels: Record<keyof typeof samples, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  yaml: 'YAML',
  html: 'HTML',
  css: 'CSS',
  python: 'Python',
  markdown: 'Markdown',
};

function jsonError(text: string): string | undefined {
  try {
    JSON.parse(text);
    return undefined;
  } catch (error) {
    return `Enter valid JSON. ${(error as Error).message}`;
  }
}

function Languages() {
  const [language, setLanguage] = useState<keyof typeof samples>('javascript');
  const [values, setValues] = useState(samples);
  const [preferences, setPreferences] = useState<CodeEditorProps.Preferences>({ wrapLines: true, theme: 'auto' });
  const [height, setHeight] = useState(280);
  const [saved, setSaved] = useState('');

  return (
    <section className={styles.section}>
      <h2>Languages</h2>
      <SegmentedControl
        label="Language"
        selectedId={language}
        options={languages.map(id => ({ id, text: labels[id] }))}
        onChange={event => setLanguage(event.detail.selectedId as keyof typeof samples)}
      />
      <CodeEditor
        ariaLabel="Source"
        language={language}
        value={values[language]}
        onChange={event => setValues(current => ({ ...current, [language]: event.detail.value }))}
        onDelayedChange={() => setSaved(new Date().toLocaleTimeString())}
        preferences={preferences}
        onPreferencesChange={event => setPreferences(event.detail)}
        editorContentHeight={height}
        onEditorContentResize={event => setHeight(event.detail.height)}
      />
      <p>
        Height {height} px · wrap lines {String(preferences.wrapLines)} · theme {preferences.theme}
        {saved && ` · draft saved at ${saved}`}
      </p>
    </section>
  );
}

function Themes() {
  const [theme, setTheme] = useState<CodeEditorProps.Theme>('dark');
  return (
    <section className={styles.section}>
      <h2>Themes</h2>
      <SegmentedControl
        label="Editor theme"
        selectedId={theme}
        options={[
          { id: 'auto', text: 'Match the page' },
          { id: 'light', text: 'Light' },
          { id: 'dark', text: 'Dark' },
        ]}
        onChange={event => setTheme(event.detail.selectedId as CodeEditorProps.Theme)}
      />
      <CodeEditor
        ariaLabel="Styles"
        language="css"
        value={samples.css}
        preferences={{ wrapLines: false, theme }}
        editorContentHeight={160}
      />
    </section>
  );
}

function Validation() {
  const [policy, setPolicy] = useState('{\n  "Version": "2012-10-17",\n  "Statement": [\n}\n');
  const error = jsonError(policy);
  return (
    <section className={styles.section}>
      <h2>In a form field</h2>
      <FormField label="Bucket policy" description="A JSON policy document." errorText={error}>
        <CodeEditor
          language="json"
          value={policy}
          onChange={event => setPolicy(event.detail.value)}
          editorContentHeight={160}
        />
      </FormField>
      <FormField label="Deployment notes" warningText="The notes mention a production host.">
        <CodeEditor language="markdown" value={'Deploy to prod-db-01 after 18:00.\n'} editorContentHeight={96} />
      </FormField>
    </section>
  );
}

export default function CodeEditorPermutations() {
  const [loading, setLoading] = useState(true);
  return (
    <article className={styles.page}>
      <h1>Code editor</h1>
      <Languages />
      <Themes />
      <Validation />
      <section className={styles.section}>
        <h2>Read-only, without line numbers</h2>
        <CodeEditor
          ariaLabel="Generated configuration"
          language="yaml"
          value={samples.yaml}
          readOnly={true}
          preferences={{ wrapLines: true, theme: 'auto', showGutter: false }}
          editorContentHeight={170}
        />
      </section>
      <section className={styles.section}>
        <h2>Loading</h2>
        <SegmentedControl
          label="Content"
          selectedId={loading ? 'loading' : 'loaded'}
          options={[
            { id: 'loading', text: 'Loading' },
            { id: 'loaded', text: 'Loaded' },
          ]}
          onChange={event => setLoading(event.detail.selectedId === 'loading')}
        />
        <CodeEditor
          ariaLabel="Template"
          language="html"
          value={samples.html}
          loading={loading}
          editorContentHeight={120}
        />
      </section>
    </article>
  );
}
