import { Send } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export default function BlogConnect() {
  return (
    <div className="py-8 mt-2 border-t border-slate-800">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">
          Connect with MiniFyn
        </h3>
        <p className="text-slate-400 mt-2">
          Join our community for updates and discussions
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
        <a
          className="flex flex-col items-center gap-3 p-3 text-slate-400 hover:text-white transition-colors"
          href="https://x.com/minifyncom"
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Follow us on X (formerly Twitter)"
        >
          <FaXTwitter className="w-6 h-6" />
          <span className="text-sm">X (formerly Twitter)</span>
        </a>

        <a
          className="flex flex-col items-center gap-3 p-3 text-slate-400 hover:text-white transition-colors"
          href="https://facebook.com/minifyncom"
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Follow us on Facebook"
        >
          <FaFacebookF className="w-6 h-6" />
          <span className="text-sm">Facebook</span>
        </a>

        <a
          className="flex flex-col items-center gap-3 p-3 text-slate-400 hover:text-white transition-colors"
          href="https://linkedin.com/company/minifyn"
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Follow us on LinkedIn"
        >
          <FaLinkedinIn className="w-6 h-6" />
          <span className="text-sm">LinkedIn</span>
        </a>

        <a
          className="flex flex-col items-center gap-3 p-3 text-slate-400 hover:text-white transition-colors"
          href="https://t.me/minifyn"
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Join us on Telegram"
        >
          <Send className="w-6 h-6" />
          <span className="text-sm">Telegram</span>
        </a>
      </div>
    </div>
  );
}