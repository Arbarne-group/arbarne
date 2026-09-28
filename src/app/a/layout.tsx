import { redirect } from "next/navigation";
import { getSessionUser, STAFF_ROLES } from "@/lib/access";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminSidebar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
