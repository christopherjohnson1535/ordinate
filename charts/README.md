# @ordinate-ui/charts

Charts for [Ordinate](../README.md): line, area, bar, mixed line and bar, and pie. They are drawn in SVG with no chart library, styled with the Ordinate design tokens, and follow the pinned revision, the color mode and the density like the components do.

Every series has a pattern as well as a color. Bars, areas and pie segments are filled solid, hatched, cross-hatched, dotted or ruled; lines have their own dash and point marker. Series stay apart in print, in grayscale, in dark mode and for readers who do not tell the colors apart.

```tsx
import LineChart from '@ordinate-ui/charts/line-chart';

<LineChart
  series={[
    { title: 'North annex', type: 'line', data: requests.north },
    { title: 'South annex', type: 'line', data: requests.south },
    { title: 'Capacity', type: 'threshold', y: 1200 },
  ]}
  xScaleType="time"
  xTitle="Time (UTC)"
  yTitle="Requests per minute"
  ariaLabel="Requests per minute by building"
/>;
```

## Charts

| Chart                                      | Series types               | Notes                                                                              |
| ------------------------------------------ | -------------------------- | ---------------------------------------------------------------------------------- |
| `@ordinate-ui/charts/line-chart`           | `line`, `threshold`        | Any x scale: `linear`, `log`, `time` or `categorical`.                             |
| `@ordinate-ui/charts/area-chart`           | `area`, `threshold`        | Areas are stacked; the detail popover shows the total.                             |
| `@ordinate-ui/charts/bar-chart`            | `bar`, `threshold`         | Categorical x. Grouped by default; `stackedBars` and `horizontalBars` change that. |
| `@ordinate-ui/charts/mixed-line-bar-chart` | `bar`, `line`, `threshold` | Categorical x. Lines run through the middle of each category.                      |
| `@ordinate-ui/charts/pie-chart`            | `data: [{ title, value }]` | `variant="donut"` adds `innerMetricValue` and `innerMetricDescription`.            |

The cartesian charts share their props: `series`, `xDomain`, `yDomain`, `xScaleType`, `yScaleType`, `xTitle`, `yTitle`, `xTickFormatter`, `yTickFormatter`, `height`, `hideFilter`, `hideLegend`, `legendTitle`, `statusType` with `loadingText`, `errorText`, `recoveryText` and `onRecoveryClick`, `empty`, `noMatch`, `visibleSeries` with `onFilterChange`, `highlightedSeries` with `onHighlightChange`, `detailPopoverSize`, `detailPopoverFooter`, `emphasizeBaselineAxis`, `ariaLabel`, `ariaLabelledby`, `ariaDescription` and `i18nStrings`. Each prop is documented in the chart's `interfaces.ts`.

Series take the eight categorical colors (`colorChartsCategorical1` to `8`) and the eight patterns in the order they are listed, and keep them when the filter hides other series. Pass `color` on a series to use your own; it still gets its pattern.

## Keyboard

The plot is one tab stop. Left and Right move between x positions (they follow the reading direction, so the plot is mirrored in right-to-left layout), Up and Down move between series at that position, Home and End jump to the ends, Enter pins the detail popover and moves focus into it, and Escape dismisses it. Each move is announced to screen readers. In the pie chart the arrow keys move between segments. The legend is a toolbar: one tab stop, arrow keys between items, and focusing or pointing at an item highlights its series.

## Built-in text

The charts render a few strings on their own, such as the filter label and the legend's accessible name. They are in English and can be replaced one by one with `i18nStrings`.

## Requirements and package layout

The package has peer dependencies on `react`, `react-dom` and `@ordinate-ui/components`, and depends on `@ordinate-ui/design-tokens`. It uses only the public surface of the components: it composes `Multiselect`, `FormField`, `Button` and `StatusIndicator`, styles itself with the design token package, and keeps its own copies of the few internal helpers it needs (the floating panel, event helpers and Sass mixins) in `src/internal`.

Test utilities live in `@ordinate-ui/charts/test-utils/dom`. Importing it adds `findLineChart`, `findAllLineCharts` and the same pair for every chart to the components' `createWrapper()`.

```ts
import createWrapper from '@ordinate-ui/components/test-utils/dom';
import '@ordinate-ui/charts/test-utils/dom';

const chart = createWrapper().findLineChart()!;
chart.findApplication()!.keydown('ArrowRight');
expect(chart.findDetailPopover()!.getText()).toContain('North annex');
```

## Development

The source is in `src/<chart>/` with the same four files as a component (`index.tsx`, `interfaces.ts`, `internal.tsx`, `styles.scss`) and the shared drawing code in `src/internal`. `npm run build` at the repository root builds the charts after the components into `lib/charts`, with its own `package.json`. Dev pages import the charts through the `~charts` alias, and tests import the built package from `lib/charts`.
