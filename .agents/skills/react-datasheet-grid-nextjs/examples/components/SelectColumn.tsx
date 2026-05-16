// components/SelectColumn.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import Select, { type GroupBase, type SelectInstance } from 'react-select'
import type { CellProps, Column } from 'react-datasheet-grid'

export type SelectChoice = {
  label: string
  value: string
}

export type SelectOptions = {
  choices: SelectChoice[]
  disabled?: boolean
}

const SelectCell = React.memo(function SelectCell({
  active,
  rowData,
  setRowData,
  focus,
  stopEditing,
  columnData,
}: CellProps<string | null, SelectOptions>) {
  const ref = useRef<SelectInstance<SelectChoice, false, GroupBase<SelectChoice>>>(null)

  useEffect(() => {
    if (focus) {
      ref.current?.focus()
    } else {
      ref.current?.blur()
    }
  }, [focus])

  return (
    <Select<SelectChoice, false>
      ref={ref}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: 'stretch',
          pointerEvents: focus ? undefined : 'none',
        }),
        control: (provided) => ({
          ...provided,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
        }),
        indicatorSeparator: (provided) => ({ ...provided, opacity: 0 }),
        indicatorsContainer: (provided) => ({ ...provided, opacity: active ? 1 : 0 }),
        placeholder: (provided) => ({ ...provided, opacity: active ? 1 : 0 }),
      }}
      isDisabled={columnData.disabled}
      value={columnData.choices.find((choice) => choice.value === rowData) ?? null}
      options={columnData.choices}
      menuIsOpen={focus}
      menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
      onChange={(choice) => {
        if (choice === null) return
        setRowData(choice.value)
        setTimeout(stopEditing, 0)
      }}
      onMenuClose={() => stopEditing({ nextRow: false })}
    />
  )
})

export function selectColumn(options: SelectOptions): Column<string | null, SelectOptions> {
  return {
    component: SelectCell,
    columnData: options,
    disableKeys: true,
    keepFocus: true,
    disabled: options.disabled,
    deleteValue: () => null,
    copyValue: ({ rowData }) =>
      options.choices.find((choice) => choice.value === rowData)?.label ?? null,
    pasteValue: ({ value }) =>
      options.choices.find((choice) => choice.label === value)?.value ?? null,
    isCellEmpty: ({ rowData }) => rowData == null,
  }
}
