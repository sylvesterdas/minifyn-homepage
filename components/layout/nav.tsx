export function Nav() {
  return (
    <div className="flex items-center justify-between h-16 px-6">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold text-white">MiniFyn</span>
        <div className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full">BETA</div>
      </div>
      <div className="flex items-center space-x-6">
        <button className="text-sm text-slate-400 hover:text-white transition-colors">Documentation</button>
        <button className="text-sm text-slate-400 hover:text-white transition-colors">API</button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all">
          Get Started
        </button>
      </div>
    </div>
  )
} 