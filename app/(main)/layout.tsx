import { BottomNav } from "@/components/shared/BottomNav";
import { InstallPrompt } from "@/components/shared/InstallPrompt";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen max-w-md mx-auto bg-white overflow-hidden">
      <InstallPrompt />
      <main className="flex-1 scroll-area">{children}</main>
      <BottomNav />
    </div>
  );
}
