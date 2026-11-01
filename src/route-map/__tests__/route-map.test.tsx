// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import I18nProvider from '../../../lib/components/i18n';
import RouteMap, { RouteMapProps } from '../../../lib/components/route-map';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const lines: RouteMapProps.Line[] = [
  {
    id: 'postgres',
    title: 'Postgres',
    description: '1 of 3 done',
    href: '/postgres/',
    stops: [
      { id: 'pg-1', status: 'done' },
      { id: 'pg-2', status: 'open' },
      { id: 'pg-3', status: 'planned' },
      { id: 'pg-lab', status: 'planned', type: 'station' },
    ],
  },
  { id: 'rag', title: 'RAG', stops: [{ id: 'rag-1', status: 'planned' }] },
];

const routeMap = () => createWrapper().findRouteMap()!;

describe('RouteMap', () => {
  test('is a named group with one row per line', () => {
    render(<RouteMap lines={lines} ariaLabel="Course route" />);
    expect(screen.getByRole('group', { name: 'Course route' })).toBeInTheDocument();
    expect(routeMap().findLines()).toHaveLength(2);
  });

  test('makes a line with an address a link named by its title and description', () => {
    render(<RouteMap lines={lines} ariaLabel="Course route" />);
    const link = screen.getByRole('link', { name: /Postgres/ });
    expect(link).toHaveAttribute('href', '/postgres/');
    expect(link.textContent).toContain('1 of 3 done');
    expect(screen.queryByRole('link', { name: /RAG/ })).toBeNull();
  });

  test('draws stops by status and type', () => {
    render(<RouteMap lines={lines} ariaLabel="Course route" />);
    expect(routeMap().findStop('pg-1')!.getElement().tagName.toLowerCase()).toBe('circle');
    expect(routeMap().findStop('pg-lab')!.getElement().tagName.toLowerCase()).toBe('rect');
    expect(routeMap().findStop('pg-1')!.getElement().getAttribute('class')).toMatch(/stop-done/);
  });

  test('rings the current stop with a note, which can be replaced', () => {
    const { rerender } = render(<RouteMap lines={lines} ariaLabel="Course route" currentStopId="pg-2" />);
    expect(routeMap().findCurrentStop()!.getText()).toBe('You are here');
    rerender(<RouteMap lines={lines} ariaLabel="Course route" currentStopId="pg-2" currentStopLabel="Next up" />);
    expect(routeMap().findCurrentStop()!.getText()).toBe('Next up');
    rerender(<RouteMap lines={lines} ariaLabel="Course route" />);
    expect(routeMap().findCurrentStop()).toBeNull();
  });

  test('reads the current stop note from the I18nProvider', () => {
    render(
      <I18nProvider
        locale="fr"
        messages={[{ '@ordinate/components': { fr: { 'route-map': { currentStopLabel: 'Vous êtes ici' } } } }]}
      >
        <RouteMap lines={lines} ariaLabel="Parcours" currentStopId="pg-1" />
      </I18nProvider>
    );
    expect(routeMap().findCurrentStop()!.getText()).toBe('Vous êtes ici');
  });

  test('draws the band behind the selected line', () => {
    render(<RouteMap lines={lines} ariaLabel="Course route" selectedLineId="rag" />);
    expect(routeMap().findSelectedBand()).not.toBeNull();
  });

  test('ends every line at the terminus', () => {
    render(
      <RouteMap
        lines={lines}
        ariaLabel="Course route"
        terminus={{ title: 'Capstone', description: 'One lab', href: '/capstone/' }}
      />
    );
    expect(routeMap().findTerminus()!.getText()).toContain('Capstone');
    expect(screen.getByRole('link', { name: /Capstone/ })).toHaveAttribute('href', '/capstone/');
  });

  test('fires onFollow on a plain click and lets the handler take over navigation', () => {
    const onFollow = vi.fn((event: CustomEvent) => event.preventDefault());
    render(
      <RouteMap lines={lines} ariaLabel="Course route" onFollow={onFollow} terminus={{ title: 'End', href: '/end/' }} />
    );
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    routeMap().findLine('postgres')!.getElement().dispatchEvent(click);
    expect(onFollow).toHaveBeenCalledTimes(1);
    expect(onFollow.mock.calls[0][0].detail).toEqual({ lineId: 'postgres', href: '/postgres/' });
    expect(click.defaultPrevented).toBe(true);
    routeMap().findTerminus()!.click();
    expect(onFollow.mock.calls[1][0].detail).toEqual({ lineId: null, href: '/end/' });
    routeMap().findLine('postgres')!.click({ metaKey: true });
    expect(onFollow).toHaveBeenCalledTimes(2);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'r', 'data-testid': 'route', className: 'custom', lines, ariaLabel: 'Route' } as RouteMapProps;
    render(<RouteMap {...props} />);
    const root = screen.getByTestId('route');
    expect(root).toHaveAttribute('id', 'r');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <RouteMap
        lines={lines}
        ariaLabel="Course route"
        currentStopId="pg-2"
        selectedLineId="postgres"
        terminus={{ title: 'Capstone', href: '/c/' }}
      />
    );
    await expectNoAxeViolations(container);
  });
});
