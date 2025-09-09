import Image from 'next/image';
import ComingSoonContent from '../_components/coming-soon/coming-soon-content';
import { getServerAuthSession } from '~/server/auth';

export default async function ComingSoonPage() {
  const session = await getServerAuthSession();
  return (
    <div className='relative w-full h-full'>
      <ComingSoonContent session={session} />
    </div>
  );
}
