import Image from 'next/image';
import Link from 'next/link';

const LogoWithName = () => (
  <Link href="/" className="flex flex-shrink-0 items-center gap-2">
    <Image 
      className="drop-shadow-sm dark:brightness-110" 
      src="/logo.png" 
      alt="Company Logo" 
      width={35} 
      height={35} 
      style={{ width: '35px', height: '35px' }} 
    />
    <span className="font-bold text-primary-900 dark:text-white drop-shadow-sm text-xl">
      MiniFyn
    </span>
  </Link>
);

export default LogoWithName;