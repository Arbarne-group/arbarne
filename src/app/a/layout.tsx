
import { redirect } from "next/navigation";
import { getSessionUser, STAFF_ROLES } from "@/lib/access";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSessionUser();

  if (!user || !STAFF_ROLES.includes(user.role)) {
    redirect("/overview");
  }

  return (
    <div className="flex min-h-screen items-stretch bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 self-stretch md:flex">
        <AdminSidebar />
      </aside>

      {/* Main Content Pane */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />

        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
