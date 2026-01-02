import { ReactNode } from "react";

export default function DashboardLayout({
  children,
  sidebar,
  modal,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  modal: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {sidebar}
      <main className="flex-1 relative">
        {children}
        {modal}
      </main>
    </div>
  );
}
