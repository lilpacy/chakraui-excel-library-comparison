'use client';

import { EditorComponent, HotColumn } from '@handsontable/react-wrapper';

export const QuantityEditor = () => {
  return (
    <EditorComponent>
      {({ value, setValue, finishEditing, mainElementRef }) => (
        <input
          ref={mainElementRef as any}
          type="number"
          min={0}
          value={String(value ?? '')}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => finishEditing()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') finishEditing();
          }}
        />
      )}
    </EditorComponent>
  );
};

export const QuantityColumn = () => {
  return <HotColumn data="quantity" type="numeric" editor={QuantityEditor} allowInvalid={false} />;
};
