import { Suspense } from "react";

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading form...</div>}>
      {children}
    </Suspense>
  );
}
