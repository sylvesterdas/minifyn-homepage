import { ArrowRight } from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="w-80 border-r border-slate-800/50 flex flex-col bg-slate-900/50">
      <div className="p-6">
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Quick Start
          </div>
          <div className="rounded-lg bg-slate-900 p-4 border border-slate-800/50">
            <code className="text-sm text-slate-300 font-mono">
              <p>$ curl api.minifyn.com/v1/urls \</p>
              <p className="mt-2 text-slate-500">
                {" "}
                -d &apos;&#123; &quot;url&quot;: &quot;https://...&quot;
                &#125;&apos; \
              </p>
              <p className="text-slate-500">
                {" "}
                -H &quot;Content-Type: application/json&quot;
              </p>
            </code>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
            Tools
          </div>
          {["URL Shortener", "API Keys", "Analytics", "QR Codes"].map(
            (item) => (
              <button
                key={item}
                className="flex items-center w-full px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md group transition-colors"
              >
                <span>{item}</span>
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
