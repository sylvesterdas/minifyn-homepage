import dynamic from "next/dynamic";
import { Suspense } from "react";

const ShortenerComponent = dynamic(
  () => import("@/components/ShortenerComponent"),
);

export const Shortener = () => (
  <Suspense
    fallback={<div className="animate-pulse h-96 bg-slate-800/30 rounded-lg" />}
  >
    <ShortenerComponent />
  </Suspense>
);
