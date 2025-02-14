import { ArrowRight, Code2, Terminal } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export const Sidebar = ({ className, onPress }: { className: string, onPress: (() => void) | undefined }) => {
  return (
    <div className={"w-max max-md:px-4 max-md:w-full max-md:border-t md:border-r border-default-100 flex flex-col " + className}>
      <div className="max-md:hidden p-6 border-b border-default-100">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">MiniFyn</span>
          <div className="px-2 py-1 rounded-small bg-primary-600/10 text-primary-400 text-tiny font-medium">
            v1.0.0
          </div>
        </div>
        <div className="mt-2 text-small text-default-400">
          Developer-focused URL shortener
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 flex flex-col max-md:items-start">
          <div className="w-max rounded-medium bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-tiny text-gray-400">Quick Start</div>
              <span className="px-1.5 py-0.5 rounded-small bg-gray-800 text-tiny text-gray-400">
                POST
              </span>
            </div>
            <code className="text-small text-white font-mono">
              <p>$ curl {siteConfig.links.shortenApi} \</p>
              <p className="mt-2 text-default-500">
                &emsp;-d &apos;&#123; &quot;url&quot;:
                &quot;https://example.com&quot; &#125;&apos; \
              </p>
              <p className="text-default-500">
                &emsp;-H &quot;Content-Type: application/json&quot;
              </p>
            </code>
          </div>

          <div className="mt-8 max-md:w-60">
            {["API Documentation", "SDK Libraries"].map((item) => (
              <button
                key={item}
                className="flex items-center justify-between w-full p-2 text-small text-default-400 hover:text-foreground group rounded-medium hover:bg-default-100"
                onClick={onPress}
              >
                <div className="flex items-center space-x-2">
                  {item === "API Documentation" ? (
                    <Terminal className="w-4 h-4" />
                  ) : (
                    <Code2 className="w-4 h-4" />
                  )}
                  <span>{item}</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          <div className="mt-8 max-md:w-60">
            <div className="text-tiny under text-start font-semibold text-default-400 uppercase tracking-wider mb-4">
              Resources
            </div>
            {[
              "Features",
              "Blog",
              "System Status",
              "Support",
              "Terms of Service",
              "Privacy Policy",
            ].map((item) => (
              <Link
                key={item}
                className="block px-2 py-1.5 text-small text-start text-default-400 hover:text-foreground rounded-medium hover:bg-default-100"
                href="/"
                onClick={onPress}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-default-100">
        <div className="flex items-center justify-between text-small text-default-400">
          <span>© 2025 MiniFyn</span>
          <div className="flex space-x-3">
            <Link
              className="hover:text-foreground"
              href={siteConfig.links.github}
              target="_blank"
            >
              GitHub
            </Link>
            <Link
              className="hover:text-foreground"
              href={siteConfig.links.twitter}
              target="_blank"
            >
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
