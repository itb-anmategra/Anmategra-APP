import React from 'react';

import ProfilTable from '../../_components/table/event-profil-table';
import { eventProfilProp } from './constant';

const ProfilEvent = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-16 px-9 md:px-11">
      <div className="gap-y-2">
        <h1 className="text-neutral-1000 text-[32px] font-semibold">
          Wisnight
        </h1>
        <p>BreadCrumbs</p>
      </div>
      <ProfilTable profilData={eventProfilProp} />
    </div>
  );
};

export default ProfilEvent;
