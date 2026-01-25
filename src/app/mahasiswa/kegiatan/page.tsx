import { Metadata } from 'next';
import KegiatanPageContent from './_components/kegiatan-page-content';

export const metadata: Metadata = {
  title: 'Daftar Kegiatan | Anmategra',
  description:
    'Jelajahi semua kegiatan mahasiswa, mulai dari seminar hingga open recruitment kepanitiaan.',
};

const KegiatanPage = () => {
  return <KegiatanPageContent />;
};

export default KegiatanPage;
