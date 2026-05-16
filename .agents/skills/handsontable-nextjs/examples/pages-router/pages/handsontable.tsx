import dynamic from 'next/dynamic';

const HandsontableGrid = dynamic(() => import('../../app-router/HandsontableGrid'), {
  ssr: false,
});

export default function HandsontablePage() {
  return <HandsontableGrid initialRows={[]} />;
}
