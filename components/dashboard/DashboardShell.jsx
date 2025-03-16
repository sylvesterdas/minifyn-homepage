"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Link as LinkIcon,
  Settings,
  Menu,
  X
} from "lucide-react";

export default function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed z-20 bottom-4 right-4 p-3 rounded-full bg-blue-600 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-10 w-64 h-full shadow-md bg-slate-900/70 border-slate-800/50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">MiniFyn</h2>
          <p className="text-sm text-slate-400">Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem href="/dashboard" icon={<Home size={18} />} label="Overview" />
          <NavItem href="/dashboard/urls" icon={<LinkIcon size={18} />} label="URLs" />
          <NavItem href="/dashboard/api-key" icon={<Settings size={18} />} label="API Keys" />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
    >
      <span className="text-slate-400">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}