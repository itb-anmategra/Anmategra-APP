import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import { type ProfileTableProps } from '../../[kegiatanId]/profil/constant';
import ProfileRow from './event-profile-row';

const ProfileTable = ({ profileData }: ProfileTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-neutral-500 text-lg font-normal w-2/5">
            Profil KM ITB
          </TableHead>
          <TableHead className="text-neutral-500 text-lg font-normal w-1/5">
            Profil Kegiatan
          </TableHead>
          <TableHead className="text-neutral-500 text-lg font-normal w-2/5">
            Deskripsi
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="font-normal text-neutral-700 text-lg leading-8">
        {profileData.map((profileGroup, index) => (
          <ProfileRow key={index} profileGroup={profileGroup} />
        ))}
      </TableBody>
    </Table>
  );
};

export default ProfileTable;
