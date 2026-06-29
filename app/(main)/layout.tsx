import { BottomNav } from "@/components/shared/BottomNav";
import { InstallPrompt } from "@/components/shared/InstallPrompt";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      <InstallPrompt />
      <main className="flex-1 pb-16">{children}</main>
      <BottomNav />
    </div>
  );
}
