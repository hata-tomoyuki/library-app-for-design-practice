import { ReactNode } from "react";

export default function DashboardLayout({
  children,
  sidebar,
  delete: deleteSlot,
  edit: editSlot,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  delete: ReactNode;
  edit: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {sidebar}
      <main className="flex-1 relative">
        {children}
        {deleteSlot}
        {editSlot}
      </main>
    </div>
  );
}
