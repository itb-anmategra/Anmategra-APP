// Props Import
import Image from 'next/image';
import Link from 'next/link';
// Components Import
import { Button } from '~/components/ui/button';
import ComingSoonContent from '~/app/_components/coming-soon/coming-soon-content';
import { getServerAuthSession } from "~/server/auth";

export default async function LaporanPage() {
  const session = await getServerAuthSession();
  return (
    // <LaporanMainContainer data={DummyData}/>
    <ComingSoonContent session={session} />
  );
};