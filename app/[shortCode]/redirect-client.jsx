"use client";

import { useEffect, useState } from "react";
import { Card } from "@heroui/react";

export function RedirectClient({ urlData }) {
  const [countdown, setCountdown] = useState(urlData.expiresAt === -1 ? 3 : 7);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);

      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      window.location.href = urlData.longUrl;
    }
  }, [countdown, urlData.longUrl]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900/70 border-slate-800/50">
        <div className="p-6 space-y-4">
          {/* <h1 className="text-2xl font-bold text-white">{urlData.title}</h1> */}
          {/* <p className="text-slate-300">{urlData.description}</p> */}
          <p className="text-slate-400">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      </Card>
    </div>
  );
}
