import { ReactNode } from "react";

export default function DashboardLayout({
  children,
  sidebar,
  delete: deleteSlot,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  delete: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {sidebar}
      <main className="flex-1 relative">
        {children}
        {deleteSlot}
      </main>
    </div>
  );
}
