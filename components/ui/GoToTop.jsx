'use client';

import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  return (
    <button
      aria-label="Go to top"
      className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-all hover:shadow-blue-500/20 z-50"
      onClick={scrollToTop}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}