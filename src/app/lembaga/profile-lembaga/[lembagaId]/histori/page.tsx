import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    lembagaId: string;
  };
}

const HistoriBestStaffPage = async ({ params }: Props) => {
  redirect('/anggota/histori');
};

export default HistoriBestStaffPage;
