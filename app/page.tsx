"use client";

import { Card } from "@heroui/react";
import { Clipboard } from "lucide-react";

export default function Home() {
  return (
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

        <Card className="bg-slate-900/70 border-slate-800/50 backdrop-blur-sm">
          <div className="p-6 space-y-6">
            {/* URL input with enhanced visual feedback */}
            <div className="relative group">
              <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-1000" />
              <div className="relative flex items-center bg-slate-800/50 rounded-lg border border-slate-700/50">
                <input
                  className="w-full max-sm:text-small px-4 py-3 bg-transparent border-none text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0"
                  placeholder="Paste your long URL"
                  type="text"
                />
                <button className="px-4 text-slate-400 hover:text-white transition-colors">
                  <Clipboard className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className="w-full py-3 max-sm:text-small rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-500/20">
              Create Short URL
            </button>

            {/* Feature highlights with icon */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { label: "API Access", value: "Included" },
                { label: "Analytics", value: "Real-time" },
                { label: "QR maker", value: "Available" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="text-xs text-slate-400">
                    {item.label}
                  </div>
                  <div className="mt-1 max-sm:text-xs font-medium text-slate-200">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

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
              <h3 className="font-medium max-sm:text-xs text-slate-200">
                {item.title}
              </h3>
              <p className="mt-1 text-sm max-sm:text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
