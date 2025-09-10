import React from 'react';

import ProfileTable from '../../_components/table/event-profile-table';
import { eventProfileProp } from './constant';

const ProfileEvent = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-16 px-9 md:px-11">
      <div className="gap-y-2">
        <h1 className="text-neutral-1000 text-[32px] font-semibold">
          Wisnight
        </h1>
        <p>BreadCrumbs</p>
      </div>
      <ProfileTable profileData={eventProfileProp} />
    </div>
  );
};

export default ProfileEvent;
