import { AdminHeader } from "@/components/admin/admin-header";
import { Sidebar } from "@/components/admin/sidebar";
import { MobileHeader } from "@/components/admin/mobile-header";
import { MobileNav } from "@/components/admin/mobile-nav";
import { TourProvider } from "@/components/admin/tour-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // These would come from your database in production
  const sidebarProps = {
    todayEarnings: 140,
    todayTarget: 340,
    weekStats: {
      jobsDone: 8,
      earned: 485,
      monthTotal: 1840,
    },
  };

  return (
    <TourProvider>
      <div className="min-h-screen bg-background text-foreground dark">
        {/* Desktop Header */}
        <div className="hidden lg:block" data-tour="header">
          <AdminHeader />
        </div>

        {/* Mobile Header */}
        <MobileHeader {...sidebarProps} />

        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar {...sidebarProps} />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-h-[calc(100vh-73px)] lg:max-h-[calc(100vh-73px)] pb-20 lg:pb-6">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <MobileNav />
      </div>
    </TourProvider>
  );
}
