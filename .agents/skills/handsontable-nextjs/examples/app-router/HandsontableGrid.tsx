'use client';

import { useMemo, useRef } from 'react';
import { HotTable, HotColumn } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import { mainTheme, registerTheme } from 'handsontable/themes';

registerAllModules();

const theme = registerTheme(mainTheme)
  .setColorScheme('auto')
  .setDensityType('comfortable');

type OrderRow = {
  id: number;
  customer: string;
  amount: number;
  status: 'open' | 'done' | 'blocked';
  tags: string[];
  dueDate: string;
  active: boolean;
};

type Props = {
  initialRows: OrderRow[];
};

const StatusRenderer = ({ value }: { value: unknown }) => {
  return <span>{String(value ?? '')}</span>;
};

export default function HandsontableGrid({ initialRows }: Props) {
  const hotRef = useRef<any>(null);
  const statuses = useMemo(() => ['open', 'done', 'blocked'], []);
  const tags = useMemo(() => ['urgent', 'vip', 'renewal', 'support'], []);

  return (
    <HotTable
      ref={hotRef}
      data={initialRows}
      theme={theme}
      rowHeaders={true}
      colHeaders={['ID', 'Customer', 'Amount', 'Status', 'Tags', 'Due', 'Active']}
      height="auto"
      width="100%"
      autoWrapRow={true}
      autoWrapCol={true}
      autoRowSize={false}
      autoColumnSize={false}
      dropdownMenu={true}
      filters={true}
      multiColumnSorting={true}
      contextMenu={true}
      licenseKey={process.env.NEXT_PUBLIC_HANDSONTABLE_LICENSE_KEY ?? 'non-commercial-and-evaluation'}
      afterChange={(changes, source) => {
        if (!changes || source === 'loadData') return;

        void fetch('/api/orders/changes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes }),
        });
      }}
    >
      <HotColumn data="id" type="numeric" readOnly={true} />
      <HotColumn data="customer" type="text" />
      <HotColumn
        data="amount"
        type="numeric"
        numericFormat={{ style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }}
      />
      <HotColumn data="status" type="dropdown" source={statuses} strict={true} renderer={StatusRenderer} />
      <HotColumn data="tags" type="multiselect" source={tags} />
      <HotColumn
        data="dueDate"
        type="intl-date"
        dateFormat={{ year: 'numeric', month: '2-digit', day: '2-digit' }}
      />
      <HotColumn data="active" type="checkbox" />
    </HotTable>
  );
}
