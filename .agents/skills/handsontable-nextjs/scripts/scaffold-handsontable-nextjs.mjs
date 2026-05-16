#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const target = process.argv[2] ?? 'app/handsontable-demo';
await mkdir(target, { recursive: true });

const grid = `
'use client';

import { HotTable, HotColumn } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';

registerAllModules();

export default function HandsontableGrid({ initialRows = [] }) {
  return (
    <HotTable
      data={initialRows}
      rowHeaders={true}
      colHeaders={['ID', 'Name', 'Amount', 'Active']}
      height="auto"
      autoWrapRow={true}
      autoWrapCol={true}
      filters={true}
      dropdownMenu={true}
      licenseKey="non-commercial-and-evaluation"
    >
      <HotColumn data="id" type="numeric" readOnly={true} />
      <HotColumn data="name" type="text" />
      <HotColumn data="amount" type="numeric" />
      <HotColumn data="active" type="checkbox" />
    </HotTable>
  );
}
`.trimStart();

const page = `
import HandsontableGrid from './HandsontableGrid';

export default function Page() {
  const rows = [
    { id: 1, name: 'Example', amount: 1000, active: true },
  ];

  return <HandsontableGrid initialRows={rows} />;
}
`.trimStart();

await writeFile(join(target, 'HandsontableGrid.jsx'), grid);
await writeFile(join(target, 'page.jsx'), page);

console.log(`Created Handsontable demo in ${target}`);
console.log('Next step: npm install handsontable @handsontable/react-wrapper');
