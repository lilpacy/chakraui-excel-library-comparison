// app/components/ReactDatasheetGridExample.tsx
'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  DataSheetGrid,
  checkboxColumn,
  intColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid'
import type { Column } from 'react-datasheet-grid'

type PersonRow = {
  id: string
  active: boolean
  firstName: string | null
  lastName: string | null
  age: number | null
}

const newId = () => Math.random().toString(36).slice(2)

export default function ReactDatasheetGridExample() {
  const [data, setData] = useState<PersonRow[]>([
    { id: '1', active: true, firstName: 'Ada', lastName: 'Lovelace', age: 36 },
    { id: '2', active: false, firstName: 'Grace', lastName: 'Hopper', age: 85 },
  ])

  const columns = useMemo<Column<PersonRow>[]>(
    () => [
      {
        ...keyColumn<PersonRow, 'active'>('active', checkboxColumn),
        title: 'Active',
        minWidth: 90,
      },
      {
        ...keyColumn<PersonRow, 'firstName'>('firstName', textColumn),
        title: 'First name',
        minWidth: 160,
      },
      {
        ...keyColumn<PersonRow, 'lastName'>('lastName', textColumn),
        title: 'Last name',
        minWidth: 160,
      },
      {
        ...keyColumn<PersonRow, 'age'>('age', intColumn),
        title: 'Age',
        grow: 0,
        minWidth: 100,
      },
    ],
    []
  )

  const createRow = useCallback(
    (): PersonRow => ({ id: newId(), active: false, firstName: null, lastName: null, age: null }),
    []
  )

  const duplicateRow = useCallback(
    ({ rowData }: { rowData: PersonRow }) => ({ ...rowData, id: newId() }),
    []
  )

  return (
    <DataSheetGrid<PersonRow>
      value={data}
      onChange={setData}
      columns={columns}
      rowKey="id"
      createRow={createRow}
      duplicateRow={duplicateRow}
      height={500}
    />
  )
}
