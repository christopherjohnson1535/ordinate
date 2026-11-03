// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Table from '@ordinate/components/table';

import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';

const elementMethods = [
  { method: 'getElement()', does: 'Returns the DOM element, for assertions such as toHaveAttribute.' },
  { method: 'getText()', does: 'Returns the text content of the element.' },
  { method: 'click(init?)', does: 'Fires a click, with optional modifier keys such as { shiftKey: true }.' },
  { method: 'keydown(key, init?)', does: 'Fires a keydown with the key, such as ArrowRight or Enter.' },
  { method: 'focus(), blur()', does: 'Moves focus to the element, or away from it.' },
  { method: 'setNativeValue(value)', does: 'Sets the value of a native input, select or textarea so onChange runs.' },
  { method: 'fireEvent(event)', does: 'Dispatches any event you build yourself.' },
  { method: 'find(selector), findAll(selector)', does: 'Finds descendants with a CSS selector, wrapped.' },
  { method: 'findComponent(Wrapper, selector?)', does: 'Finds a component by its wrapper class.' },
];

const wrappers = [
  {
    component: 'Button',
    methods: 'isDisabled(), isLoading(), findTextRegion(), findIcon(), findLoadingIndicator(), findLeader()',
  },
  {
    component: 'Input',
    methods: 'setInputValue(value), getInputValue(), findNativeInput(), findClearButton(), isDisabled(), isReadOnly()',
  },
  {
    component: 'Select, Multiselect',
    methods: 'openDropdown(), selectOption(indexOrValue), findTrigger(), findOptions(), isOpen(), isDisabled()',
  },
  {
    component: 'Checkbox, Toggle, RadioButton',
    methods: 'isChecked(), isDisabled(), findNativeInput(), findLabel(), findDescription()',
  },
  {
    component: 'Table',
    methods:
      'findRows(), findBodyCell(row, column), findColumnHeaders(), findColumnSortingArea(column), findRowSelectionArea(row), findSelectedRows(), findSelectAllTrigger(), findEmptySlot(), findLoadingText()',
  },
  {
    component: 'Modal',
    methods: 'isVisible(), findHeader(), findContent(), findFooter(), findDismissButton(), pressEscape()',
  },
  {
    component: 'Pagination',
    methods: 'findCurrentPage(), findNextPageButton(), findPreviousPageButton(), findPageNumberByIndex(page)',
  },
  {
    component: 'KeyValuePairs',
    methods: 'findItems(), each with findLabel() and findValue(); findGroups()',
  },
  {
    component: 'SideNavigation',
    methods: 'findLinks(), findLinkByHref(href), findActiveLink(), findSectionToggles()',
  },
];

const chartMethods = [
  {
    method: 'findApplication()',
    does: 'The plot: the one focus stop the arrow keys move through.',
  },
  {
    method: 'findDetailPopover()',
    does: 'The popover for the focused or pinned position, with findRows() and findHeader().',
  },
  { method: 'findLegendItems(), findHighlightedLegendItem()', does: 'The legend buttons.' },
  { method: 'findFilter()', does: 'The series filter, a Multiselect wrapper.' },
  {
    method: 'findStatusContainer(), findRecoveryButton()',
    does: 'What shows while loading, after an error or with no data.',
  },
  {
    method: 'findSeries(), findBars(), findXAxisTicks(), findYAxisTicks()',
    does: 'The drawn series and axes of line, area, bar and mixed charts.',
  },
  { method: 'findSegments(), findSegmentLabels()', does: 'The segments of a pie chart and their labels.' },
];

function Page() {
  return (
    <>
      <Prose>
        <p>
          Ordinate ships test utilities for every component. They find components on the page and drive them the way a
          person would: click the button, type into the input, pick the second option. Your tests use them instead of
          class names, which are scoped at build time and change between versions.
        </p>
      </Prose>

      <DocSection id="create-wrapper" number={1} title="createWrapper">
        <Prose>
          <p>
            Import <code>createWrapper</code> from <code>@ordinate/components/test-utils/dom</code>. It wraps an
            element, the document body by default, and every wrapper can find the components inside it. The utilities
            work with any test runner that provides a DOM, such as Vitest or Jest with jsdom, and with React Testing
            Library or any other way of rendering.
          </p>
        </Prose>
        <CodeBlock
          label="services.test.tsx"
          code={`
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';

import createWrapper from '@ordinate/components/test-utils/dom';

import Services from './services';

test('restarts the picked service', () => {
  const { container } = render(<Services />);
  const wrapper = createWrapper(container);
  const table = wrapper.findTable()!;
  const restart = wrapper.findButton()!;

  expect(restart.isDisabled()).toBe(true);
  table.findRowSelectionArea(2)!.click();
  expect(table.findSelectedRows()).toHaveLength(1);

  restart.click();
  expect(table.findBodyCell(2, 3)!.getText()).toBe('Restarting');
});
`}
        />
        <Prose>
          <p>
            Row and column numbers start at 1, as a person would count them. The selection column counts as a column, so
            with <code>selectionType</code> set the first data column is 2.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="finders" number={2} title="Finders">
        <Prose>
          <p>
            Every wrapper has two finders for each component, named after it: <code>findButton()</code> returns the
            first button inside the wrapper or <code>null</code>, and <code>findAllButtons()</code> returns all of them.
            Each takes an optional CSS selector that the component&apos;s root must also match, which is the way to tell
            two buttons apart.
          </p>
        </Prose>
        <CodeBlock
          label="settings.test.tsx"
          code={`
render(
  <>
    <Button data-testid="cancel">Cancel</Button>
    <Button data-testid="save" variant="primary">Save</Button>
  </>
);

createWrapper().findButton('[data-testid="save"]')!.click();
expect(createWrapper().findAllButtons()).toHaveLength(2);
`}
        />
        <Notes
          items={[
            <>
              Components accept <code>id</code> and <code>data-*</code> attributes and put them on their root element,
              so <code>data-testid</code> works with the selector argument.
            </>,
            <>
              Plurals follow English spelling: <code>findAllBoxes()</code>, <code>findAllKeyValuePairses()</code>,{' '}
              <code>findAllTextFilters()</code>.
            </>,
            <>
              A few components have a part with the same name as another component. Table&apos;s{' '}
              <code>findPagination()</code> returns its pagination slot, and Modal&apos;s <code>findHeader()</code>{' '}
              returns its title. Those component finders, <code>findBadge</code>, <code>findCalendar</code>,{' '}
              <code>findCollectionPreferences</code>, <code>findDateInput</code>, <code>findDropdown</code>,{' '}
              <code>findHeader</code>, <code>findMeasure</code>, <code>findMedia</code>, <code>findPagination</code>,{' '}
              <code>findSteps</code>, <code>findTextFilter</code> and <code>findToggle</code>, are on the wrapper{' '}
              <code>createWrapper()</code> returns. To reach one inside a part, wrap the part:{' '}
              <code>createWrapper(table.findPagination()!.getElement()).findPagination()</code>.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="methods" number={3} title="Methods every wrapper has">
        <Table
          variant="embedded"
          wrapLines={true}
          trackBy="method"
          items={elementMethods}
          ariaLabels={{ tableLabel: 'Methods every wrapper has' }}
          columnDefinitions={[
            {
              id: 'method',
              header: 'Method',
              cell: item => item.method,
              isRowHeader: true,
              contentType: 'identifier',
              width: 300,
            },
            { id: 'does', header: 'What it does', cell: item => item.does },
          ]}
        />
        <Prose>
          <p>
            Events run inside React&apos;s <code>act()</code>, on React 18.3 and later, so state updates have finished
            when the call returns.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="component-wrappers" number={4} title="Component wrappers">
        <Prose>
          <p>
            Each component&apos;s wrapper adds methods for its parts and actions. Some of the ones you will use most are
            below; every component page lists its finder under Testing, and your editor completes the rest, since the
            wrappers ship with their types.
          </p>
        </Prose>
        <Table
          variant="embedded"
          wrapLines={true}
          trackBy="component"
          items={wrappers}
          ariaLabels={{ tableLabel: 'Methods of some component wrappers' }}
          columnDefinitions={[
            { id: 'component', header: 'Component', cell: item => item.component, isRowHeader: true, width: 220 },
            { id: 'methods', header: 'Methods', cell: item => item.methods, contentType: 'identifier' },
          ]}
        />
        <CodeBlock
          label="rename.test.tsx"
          code={`
const wrapper = createWrapper();
wrapper.findButton()!.click();

const modal = wrapper.findModal()!;
expect(modal.isVisible()).toBe(true);
modal.findContent()!.findInput()!.setInputValue('south-annex');
modal.findDismissButton()!.click();
expect(modal.isVisible()).toBe(false);

const region = wrapper.findSelect()!;
region.selectOption('eu-west-1');
`}
        />
      </DocSection>

      <DocSection id="charts" number={5} title="Charts">
        <Prose>
          <p>
            The chart finders live in <code>@ordinate/charts/test-utils/dom</code>. Importing it adds{' '}
            <code>findLineChart</code>, <code>findAreaChart</code>, <code>findBarChart</code>,{' '}
            <code>findMixedLineBarChart</code> and <code>findPieChart</code>, with their <code>findAll</code> pairs, to
            every wrapper.
          </p>
        </Prose>
        <CodeBlock
          label="requests-chart.test.tsx"
          code={`
import createWrapper from '@ordinate/components/test-utils/dom';
import '@ordinate/charts/test-utils/dom';

const chart = createWrapper().findLineChart()!;
chart.findApplication()!.keydown('ArrowRight');
expect(chart.findDetailPopover()!.getText()).toContain('North annex');
expect(chart.findLegendItems().map(item => item.getText())).toEqual(['North annex', 'South annex']);
`}
        />
        <Table
          variant="embedded"
          wrapLines={true}
          trackBy="method"
          items={chartMethods}
          ariaLabels={{ tableLabel: 'Methods of the chart wrappers' }}
          columnDefinitions={[
            {
              id: 'method',
              header: 'Method',
              cell: item => item.method,
              isRowHeader: true,
              contentType: 'identifier',
              width: 340,
            },
            { id: 'does', header: 'What it returns', cell: item => item.does },
          ]}
        />
      </DocSection>

      <DocSection id="jsdom" number={6} title="Running in jsdom">
        <Prose>
          <p>
            Modal opens a native <code>&lt;dialog&gt;</code> with <code>showModal()</code>, which jsdom does not
            implement. Add these lines to your test setup file if your tests open a modal:
          </p>
        </Prose>
        <CodeBlock
          label="test-setup.ts"
          code={`
const dialog = HTMLDialogElement.prototype;
dialog.showModal ??= function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
dialog.close ??= function (this: HTMLDialogElement) {
  this.removeAttribute('open');
};
`}
        />
        <Notes
          items={[
            <>
              jsdom does no layout, so components that measure themselves, such as ColumnLayout, render as if every
              column fits. Test layout, focus moving between components and contrast in a real browser.
            </>,
            <>
              Checks that need a browser, such as keyboard paths through a whole page, run well with Playwright. The
              wrappers need a DOM in the same process, so in Playwright use its own locators by role and name.
            </>,
          ]}
        />
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'testing',
  title: 'Testing',
  summary: 'Find and drive components in unit tests with createWrapper and the wrapper of each component.',
  order: 9,
  keywords: [
    'createWrapper',
    'test-utils',
    'ElementWrapper',
    'ComponentWrapper',
    'findButton',
    'findAllButtons',
    'findTable',
    'findLineChart',
    'findDetailPopover',
    'findApplication',
    'setInputValue',
    'selectOption',
    'jsdom',
    'vitest',
    'jest',
    'testing library',
  ],
  Page,
};

export default guide;
