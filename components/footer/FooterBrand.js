import Link from "next/link";

export const FooterBrand = ({ tagline }) => {
  return (
    <div className="col-span-1">
      <Link href="/" className="flex items-center">
        <span className="text-xl font-bold text-white dark:text-white">MiniFyn</span>
      </Link>
      <p className="mt-4 text-sm text-gray-300 dark:text-gray-400">{tagline}</p>
    </div>
  );
};