import HandsontableGrid from './HandsontableGrid';

export default async function Page() {
  const rows = [
    { id: 1, customer: 'A Corp', amount: 120000, status: 'open' as const, tags: ['urgent'], dueDate: '2026-05-20', active: true },
    { id: 2, customer: 'B Inc', amount: 90000, status: 'done' as const, tags: [], dueDate: '2026-05-21', active: false },
  ];

  return (
    <main>
      <h1>Orders</h1>
      <HandsontableGrid initialRows={rows} />
    </main>
  );
}
