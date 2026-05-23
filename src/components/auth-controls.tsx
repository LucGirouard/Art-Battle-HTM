"use client";

import { useState } from "react";
import { getSessionEmail, logoutUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { PrimaryLinkButton } from "@/components/ui/primary-button";

export default function AuthControls() {
  const [email, setEmail] = useState<string | null>(() => getSessionEmail());

  const onLogout = () => {
    logoutUser();
    setEmail(null);
    window.location.href = ROUTES.home;
  };

  return (
    <div className="absolute right-4 top-4 z-30 sm:right-8 sm:top-6 md:right-10 md:top-8">
      {email ? (
        <div className="flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-3 py-2 backdrop-blur-sm">
          <span className="max-w-[130px] truncate text-xs font-semibold text-stone-700 sm:max-w-[180px]">
            {email}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-stone-400 bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-200"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <PrimaryLinkButton href={`${ROUTES.auth}?mode=login`} className="px-4 py-2 text-xs">
            Login
          </PrimaryLinkButton>
        </div>
      )}
    </div>
  );
}
