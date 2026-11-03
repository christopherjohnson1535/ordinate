// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ActionCard from '@ordinate/components/action-card';
import ColumnLayout from '@ordinate/components/column-layout';
import Table from '@ordinate/components/table';

import { href } from '../../app/router';
import { Example } from '../../parts/example';
import { CodeBlock, Command, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';

const patternsExample: LoadedExample = {
  meta: {
    id: 'patterns',
    title: 'Eight series, eight looks',
    description:
      'Every color with its fill pattern on the left, and with its dash and marker on the right. Switch the mode above the example, or print the page in grayscale, and the series still read apart.',
  },
  load: () => import('./charts/patterns'),
  loadSource: () => import('./charts/patterns.tsx?raw').then(module => module.default),
};

const charts = [
  {
    folder: 'line-chart',
    name: 'LineChart',
    description: 'Values along a continuous axis, such as time. Any x scale: linear, log, time or categorical.',
  },
  {
    folder: 'area-chart',
    name: 'AreaChart',
    description: 'Series stacked as filled areas, so the top edge is the total.',
  },
  {
    folder: 'bar-chart',
    name: 'BarChart',
    description: 'Values per category, grouped or stacked, upright or sideways.',
  },
  {
    folder: 'mixed-line-bar-chart',
    name: 'MixedLineBarChart',
    description: 'Bars and lines against the same categories, such as counts and their average.',
  },
  {
    folder: 'pie-chart',
    name: 'PieChart',
    description: 'The parts of one whole, as a pie or as a donut with a headline number.',
  },
];

interface StyleRow {
  slot: number;
  color: string;
  fill: string;
  dash: string;
  marker: string;
}

// From charts/src/internal/series-style.ts, in palette order.
const styleRows: StyleRow[] = [
  { slot: 1, color: 'Blue', fill: 'Solid', dash: 'Solid', marker: 'Circle' },
  { slot: 2, color: 'Orange', fill: 'Diagonal hatch', dash: 'Long dash', marker: 'Square' },
  { slot: 3, color: 'Teal', fill: 'Dots', dash: 'Dotted', marker: 'Triangle' },
  { slot: 4, color: 'Red', fill: 'Horizontal rules', dash: 'Dash and dot', marker: 'Diamond' },
  { slot: 5, color: 'Violet', fill: 'Cross-hatch', dash: 'Even dash', marker: 'Ring' },
  { slot: 6, color: 'Olive', fill: 'Reverse hatch', dash: 'Dash and two dots', marker: 'Open square' },
  { slot: 7, color: 'Plum', fill: 'Vertical rules', dash: 'Fine dots', marker: 'Triangle down' },
  { slot: 8, color: 'Green', fill: 'Grid', dash: 'Very long dash', marker: 'Cross' },
];

const shared = `import LineChart, { LineChartProps } from '@ordinate/charts/line-chart';

const series: LineChartProps.SeriesSpec<Date>[] = [
  { title: 'North annex', type: 'line', data: requests.north },
  { title: 'South annex', type: 'line', data: requests.south },
  { title: 'Capacity', type: 'threshold', y: 1200 },
];

<LineChart
  series={series}
  xScaleType="time"
  xTitle="Time (UTC)"
  yTitle="Requests per minute"
  ariaLabel="Requests per minute by building"
/>;`;

const testing = `import createWrapper from '@ordinate/components/test-utils/dom';
import '@ordinate/charts/test-utils/dom';

const chart = createWrapper().findLineChart()!;
chart.findApplication()!.keydown('ArrowRight');
expect(chart.findDetailPopover()!.getText()).toContain('North annex');`;

function Page() {
  return (
    <>
      <DocSection id="what-it-holds" number={1} title="What the package holds">
        <Prose>
          <p>
            <code>@ordinate/charts</code> holds five charts: line, area, bar, mixed line and bar, and pie. They are
            drawn in SVG with no chart library, styled with the design tokens, and follow the pinned revision, the color
            mode, the density and the reading direction like the components do.
          </p>
          <p>
            Each chart is laid out the same way: a filter above the plot that chooses which series are drawn, the plot
            or a status in its place, and a legend below. Pointing at the plot, or moving through it with the arrow
            keys, opens a detail popover with the values at that position.
          </p>
        </Prose>
        <ColumnLayout columns={3} minColumnWidth={220}>
          {charts.map(chart => (
            <ActionCard
              key={chart.folder}
              href={href(`/components/${chart.folder}`)}
              header={chart.name}
              description={chart.description}
              kind="resource"
            />
          ))}
        </ColumnLayout>
      </DocSection>

      <DocSection id="install" number={2} title="Install and import">
        <Prose>
          <p>
            The charts are a separate package. It has peer dependencies on <code>react</code>, <code>react-dom</code>{' '}
            and <code>@ordinate/components</code>, and brings <code>@ordinate/design-tokens</code> with it. Load the
            global styles once, as for the components, and pin a revision.
          </p>
        </Prose>
        <Command>npm install @ordinate/charts @ordinate/components @ordinate/global-styles</Command>
        <Prose>
          <p>
            Import each chart from its own path. The line, area, bar and mixed charts share their props:{' '}
            <code>series</code>, the domains, scales and axis titles, the filter and legend, the states, the highlight
            and the <code>i18nStrings</code>. Each series has a <code>type</code>, a <code>title</code> and its{' '}
            <code>data</code> as <code>{'{ x, y }'}</code> points; a <code>threshold</code> series draws a reference
            line at <code>y</code>, or at <code>x</code>.
          </p>
        </Prose>
        <CodeBlock label="requests-chart.tsx" code={shared} />
        <Prose>
          <p>
            Every chart is also exported by name from the package root, as <code>LineChart</code>,{' '}
            <code>AreaChart</code>, <code>BarChart</code>, <code>MixedLineBarChart</code> and <code>PieChart</code>,
            with their props types.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="color-and-pattern" number={3} title="Color and pattern">
        <Prose>
          <p>
            Series take the eight categorical chart colors, <code>color-charts-categorical1</code> to <code>8</code>, in
            the order they are listed. Each color has a light and a dark value, keeps at least 3:1 contrast against the
            sheet in its mode, and stays apart from its neighbors in the order for red-green color blindness.
          </p>
          <p>
            Color is never the only difference. Every series also gets a look of its own in the same order: bars, areas
            and pie segments a fill pattern, lines a dash and a point marker. The legend and the detail popover draw
            each key the way the series is drawn, so a key matches its series in print, in grayscale and for readers who
            do not tell the colors apart.
          </p>
        </Prose>
        <Example example={patternsExample} index={1} headingLevel={3} />
        <Table
          variant="embedded"
          caption="Schedule of series looks"
          items={styleRows}
          trackBy="slot"
          columnDefinitions={[
            { id: 'slot', header: 'Series', cell: row => row.slot },
            { id: 'color', header: 'Color', cell: row => row.color },
            { id: 'fill', header: 'Fill (bars, areas, pie)', cell: row => row.fill },
            { id: 'dash', header: 'Dash (lines)', cell: row => row.dash },
            { id: 'marker', header: 'Marker (lines)', cell: row => row.marker },
          ]}
        />
        <Notes
          items={[
            'A series keeps its color and pattern when the filter hides other series, because its look is settled by its place in the full list.',
            <>
              Pass <code>color</code> on a series, or on a pie datum, to use a color of your own. It keeps its pattern
              or dash, so it still reads without color. Use a design token so it follows the mode.
            </>,
            'Past eight series the colors repeat with the patterns shifted by one, so no two series share both. Eight is already more than a reader can follow; split the data instead.',
            'Thresholds do not take a palette slot. They are drawn in ink and told apart by their own dashes.',
            'Axes and the zero baseline are drawn in ink, grid rules in a faint divider color.',
          ]}
        />
      </DocSection>

      <DocSection id="states-and-text" number={4} title="States and text">
        <Prose>
          <p>
            <code>statusType</code> is <code>loading</code>, <code>error</code> or <code>finished</code>. While loading
            or after an error the chart shows <code>loadingText</code>, or <code>errorText</code> with a{' '}
            <code>recoveryText</code> button, in the plot&apos;s place and at its height. When it is finished with no
            data it shows <code>empty</code>, and when the filter hides every series it shows <code>noMatch</code>.
          </p>
          <p>
            The charts render a few strings of their own, such as the filter label, the legend&apos;s accessible name
            and the total row of a stacked chart. They are in English; replace any of them with <code>i18nStrings</code>
            .
          </p>
        </Prose>
      </DocSection>

      <DocSection id="keyboard" number={5} title="Keyboard and screen readers">
        <Notes
          items={[
            'The plot is one tab stop. Left and Right move between x positions, following the reading direction; Up and Down move between series at that position; Home and End jump to the ends.',
            'Enter pins the detail popover and moves focus into it; Escape dismisses it. Each move is announced to screen readers.',
            'In the pie chart the arrow keys move between segments.',
            'The legend is a toolbar: one tab stop, the arrow keys between items, and focusing or pointing at an item highlights its series.',
            <>
              Name each chart with <code>ariaLabel</code> or <code>ariaLabelledby</code>, and say what it shows in{' '}
              <code>ariaDescription</code>.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="testing" number={6} title="Testing">
        <Prose>
          <p>
            Importing <code>@ordinate/charts/test-utils/dom</code> adds <code>findLineChart</code>,{' '}
            <code>findAllLineCharts</code> and the same pair for every chart to the components&apos;{' '}
            <code>createWrapper()</code>.
          </p>
        </Prose>
        <CodeBlock label="requests-chart.test.tsx" code={testing} />
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'charts',
  title: 'Charts',
  summary: 'Line, area, bar, mixed and pie charts, drawn with a pattern or dash for every series as well as a color.',
  order: 1,
  keywords: [
    '@ordinate/charts',
    'LineChart',
    'AreaChart',
    'BarChart',
    'MixedLineBarChart',
    'PieChart',
    'chart colors',
    'patterns',
    'color-charts-categorical',
  ],
  Page,
};

export default guide;
