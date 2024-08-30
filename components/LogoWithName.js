import Image from 'next/image';
import Link from 'next/link';

const LogoWithName = () => {
  return <>
    <Link href="/" className="flex flex-shrink-0 items-center gap-2">
      <Image src="/favicon.ico" alt="Company Logo" width={35} height={35} style={{ width: '35px', height: '35px' }} />
      <span className="font-bold text-primary text-lg">MiniFyn</span>
    </Link>
  </>
}

export default LogoWithName
