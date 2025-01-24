import { ArrowRight, Code2, Terminal } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export const Sidebar = () => {
  return (
    <div className="w-max border-r border-gray-800 flex flex-col">
    <div className="p-6 border-b border-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-white">MiniFyn</span>
        <div className="px-2 py-1 rounded-full bg-blue-600/10 text-blue-400 text-xs font-medium">
          v1.0.0
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-400">
        Developer-focused URL shortener
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="rounded-lg bg-gray-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-400">Quick Start</div>
            <span className="px-1.5 py-0.5 rounded-md bg-gray-800 text-xs text-gray-400">
              POST
            </span>
          </div>
          <code className="text-sm text-white font-mono">
            <p>$ curl {siteConfig.links.shortenApi} \</p>
            <p className="mt-2 text-gray-500">&emsp;-d &apos;&#123; &quot;url&quot;: &quot;https://example.com&quot; &#125;&apos; \</p>
            <p className="text-gray-500">&emsp;-H &quot;Content-Type: application/json&quot;</p>
          </code>
        </div>

        <div className="mt-8">
          {['API Documentation', 'SDK Libraries'].map((item) => (
            <button
              key={item}
              className="flex items-center justify-between w-full p-2 text-sm text-gray-400 hover:text-white group rounded-lg hover:bg-gray-800"
            >
              <div className="flex items-center space-x-2">
                {item === 'API Documentation' ? <Terminal className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                <span>{item}</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        <div className="mt-8">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Resources
          </div>
          {[
            'Features',
            'Blog',
            'System Status',
            'Support',
            'Terms of Service',
            'Privacy Policy'
          ].map((item) => (
            <Link
              key={item}
              className="block px-2 py-1.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              href="/"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </div>

    <div className="p-4 border-t border-gray-800">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>© 2025 MiniFyn</span>
        <div className="flex space-x-3">
          <Link className="hover:text-white" href={siteConfig.links.github} target="_blank">GitHub</Link>
          <Link className="hover:text-white" href={siteConfig.links.twitter} target="_blank">Twitter</Link>
        </div>
      </div>
    </div>
  </div>
  );
};
