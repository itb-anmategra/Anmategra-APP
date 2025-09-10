import { TableCell, TableRow } from '~/components/ui/table';

import { type ProfileRowProps } from '../../[kegiatanId]/profil/constant';

const ProfileRow = ({ profileGroup }: ProfileRowProps) => {
  return (
    <>
      {profileGroup.eventProfile.map((eventProfile, index) => (
        <TableRow key={`${profileGroup.kmProfile}-${eventProfile.profileId}`}>
          {/* Only render KM Profile cell for the first event profile */}
          {index === 0 && (
            <TableCell
              className="font-normal align-middle"
              rowSpan={profileGroup.eventProfile.length}
            >
              {profileGroup.kmProfile}
            </TableCell>
          )}
          <TableCell>Profil {eventProfile.profileId}</TableCell>
          <TableCell>{eventProfile.profileDescription}</TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ProfileRow;
