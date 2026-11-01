// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Sample data for the chart pages. A seeded generator keeps every screenshot the same.
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const start = new Date(2026, 9, 30, 0, 0).getTime();
const halfHour = 30 * 60 * 1000;

function daily(seed: number, base: number, swing: number, noise: number) {
  const random = seeded(seed);
  return Array.from({ length: 49 }, (_, index) => {
    const hour = index / 2;
    const wave = Math.sin(((hour - 8) / 24) * 2 * Math.PI);
    return { x: new Date(start + index * halfHour), y: Math.round(base + swing * wave + (random() - 0.5) * noise) };
  });
}

export const requests = {
  north: daily(1, 820, 360, 120),
  south: daily(2, 560, 240, 90),
  east: daily(3, 340, 140, 70),
  west: daily(4, 210, 90, 50),
};

export const numberFormatter = (value: number) => new Intl.NumberFormat('en').format(value);

export const hourFormatter = (date: Date) =>
  date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

export const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

export const spendByTeam = [
  { title: 'Drafting', values: [42, 48, 51, 58] },
  { title: 'Survey', values: [31, 29, 35, 38] },
  { title: 'Fabrication', values: [55, 61, 49, 66] },
  { title: 'Inspection', values: [18, 22, 26, 24] },
];

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const sitesByVisits = [
  { title: 'North annex reading room', value: 18_240 },
  { title: 'Survey office', value: 9_120 },
  { title: 'Fabrication hall', value: 7_420 },
  { title: 'Archive', value: 3_860 },
  { title: 'Model shop', value: 2_150 },
  { title: 'Other', value: 1_310 },
];

export const storageByKind = [
  { title: 'Drawings', value: 412 },
  { title: 'Photographs', value: 268 },
  { title: 'Survey data', value: 154 },
  { title: 'Models', value: 96 },
];

// Eight series, to show every color and pattern side by side.
export const eightSeries = Array.from({ length: 8 }, (_, series) => {
  const random = seeded(series + 11);
  return {
    title: `Series ${series + 1}`,
    data: months.slice(0, 6).map(month => ({ x: month, y: Math.round(20 + random() * 60) })),
  };
});

export const latency = Array.from({ length: 30 }, (_, index) => {
  const random = seeded(7);
  for (let skip = 0; skip < index; skip++) {
    random();
  }
  return { x: Math.pow(2, index / 3), y: Math.round(5 + Math.pow(index, 1.6) + random() * 8) };
});
