import { ReactNode } from "react";

export default function DashboardLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {sidebar}
      <main className="flex-1 relative">{children}</main>
    </div>
  );
}
