"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowBanner(false);
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#7F77DD] text-white px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">Tambah CariBuddy ke homescreen</p>
        <p className="text-xs opacity-80">Guna macam apps biasa!</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShowBanner(false)}
          className="text-xs opacity-70 px-2 py-1"
        >
          Nanti
        </button>
        <button
          onClick={handleInstall}
          className="text-xs bg-white text-[#7F77DD] font-medium px-3 py-1.5 rounded-full"
        >
          Install
        </button>
      </div>
    </div>
  );
}
