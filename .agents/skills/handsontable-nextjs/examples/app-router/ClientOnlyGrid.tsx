'use client';

import dynamic from 'next/dynamic';

const ClientOnlyGrid = dynamic(() => import('./HandsontableGrid'), {
  ssr: false,
  loading: () => <p>Loading grid...</p>,
});

export default ClientOnlyGrid;
