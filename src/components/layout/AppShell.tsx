import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";

interface AppShellProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
}

export default function AppShell({
  children,
  userName = "Keziah Wanjiku",
  userRole = "Farm Owner",
}: AppShellProps) {
  return (
    <div className="flex h-screen bg-background text-on-background overflow-hidden">
      {/* Desktop Persistent Sidebar */}
      <Sidebar userName={userName} />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col h-full overflow-hidden relative">
        <Header userName={userName} userRole={userRole} />

        <main className="flex-1 overflow-y-auto bg-surface relative pb-20 md:pb-8">
          {children}
        </main>

        {/* Mobile Sticky Bottom Nav */}
        <MobileNav />
      </div>
    </div>
  );
}
