"use client";

import dynamic from "next/dynamic";

const PeopleGrid = dynamic(
  () => import("./PeopleGrid").then((mod) => mod.PeopleGrid),
  {
    ssr: false,
    loading: () => <div style={{ padding: 16 }}>Loading grid...</div>,
  }
);

export default function GlideGridNoSSR() {
  return <PeopleGrid />;
}
