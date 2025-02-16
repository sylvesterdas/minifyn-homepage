"use client";

import { Sidebar } from "@/components/sidebar";
import { Shortener } from "@/components/shortner";

export default function Home() {
  return (
    <div className="flex max-md:flex-col-reverse flex-1">
      <Sidebar className="max-md:w-full max-md:text-start" onPress={undefined} />
      <main className="w-full">
        <div className="max-w-4xl mx-auto p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl max-sm:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Professional URL Shortener
              </h1>
              <p className="mt-2 text-lg max-sm:text-xs text-slate-400">
                Built for developers. Simple for everyone.
              </p>
            </div>

            <Shortener />

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              {[
                { title: "Enterprise Ready", desc: "99.9% Uptime SLA" },
                { title: "Developer First", desc: "RESTful API & SDKs" },
                { title: "Privacy Focused", desc: "EU/US Compliant" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-lg bg-slate-900/30 border border-slate-800/50"
                >
                  <h3 className="font-medium max-sm:text-xs max-sm:text-center text-slate-200">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm max-sm:text-xs max-sm:text-center text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
