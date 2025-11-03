'use client';

// Library Import
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
// Icons Import
import {
  ArrowUpRight,
  Circle,
  Filter,
  MoreVertical,
  Pencil,
  Pin,
  Plus,
  Trash,
} from 'lucide-react';
// Auth Import
import { type Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import EditKegiatanForm from '~/app/lembaga/kegiatan/_components/form/edit-kegiatan-form';
import TambahKegiatanForm from '~/app/lembaga/kegiatan/_components/form/tambah-kegiatan-form';
// Components Import
import { useDebounce } from '~/components/debounceHook';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';

export interface Activity {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | undefined;
  participant_count: number | null;
  status: 'Coming Soon' | 'On going' | 'Ended';
  thumbnail: string | null;
  background_image: string | null;
  oprec_link: string | null;
  location: string | null;
  participant_limit: number | null;
  is_highlighted: boolean;
  is_organogram: boolean;
}

export default function ActivityList({
  propActivites,
  session,
}: {
  propActivites: Activity[];
  session: Session | null;
}) {
  const [activities, setActivities] = useState<Activity[]>(propActivites);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [updatingHighlightId, setUpdatingHighlightId] = useState<string | null>(
    null,
  );

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'Coming Soon':
        return { fill: '#F5CB69', stroke: '#F5CB69' };
      case 'On going':
        return { fill: '#29BC5B', stroke: '#29BC5B' };
      case 'Ended':
        return { fill: '#F16350', stroke: '#F16350' };
      default:
        return { fill: '#9CA3AF', stroke: '#9CA3AF' };
    }
  };

  const toggleHighlight = async (
    activityId: string,
    currentStatus: boolean,
  ) => {
    if (session === null) return;
    setUpdatingHighlightId(activityId);
    try {
      setActivities((prevActivities) => {
        const updatedList = prevActivities.map((activity) =>
          activity.id === activityId
            ? { ...activity, is_highlighted: !currentStatus }
            : activity,
        );
        return updatedList;
      });
    } catch (error) {
      console.error(error);
      alert('Gagal mengubah status highlight.');
    } finally {
      setUpdatingHighlightId(null);
    }
  };

  useEffect(() => {
    const getActivities = async () => {
      setIsLoading(true);
      const filteredActivities = propActivites.filter((activity) =>
        activity.name
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()),
      );
      setActivities(filteredActivities);
      setIsLoading(false);
    };
    getActivities()
      .then((r) => r)
      .catch((e) => e);
  }, [debouncedSearchQuery, propActivites]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Nampilin hasil pencarian client side fetching
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 pt-[24px] pl-[42px] pr-[36px]">
      {/* Title and Search */}
      <div className="flex flex-col gap-4">
        <h1 className="text-[32px] font-semibold text-[#141718]">Kegiatan</h1>
        <Input
          placeholder="Cari kegiatan"
          className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent"
          startAdornment={
            <MagnifyingGlassIcon className="size-4 text-gray-500" />
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="light_blue">
              <Plus className="h-6 w-6" />
              Tambah Kegiatan Baru
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Image
                src="/images/lembaga/Vector.svg"
                alt="Filter"
                width={24}
                height={24}
              />
              Filter
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[800px]">
            <DialogHeader>
              <DialogTitle>Tambah Kegiatan</DialogTitle>
            </DialogHeader>
            <TambahKegiatanForm
              session={session}
              setIsOpen={setIsOpen}
              setActivityList={setActivities}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="flex items-center gap-8 p-3 bg-gray-50 text-lg font-medium text-gray-500">
              <div className="w-[130px] flex-shrink-0">Thumbnail</div>
              <div className="flex-1 min-w-[200px]">Judul</div>
              <div className="w-[131px] flex-shrink-0">Tanggal</div>
              <div className="w-[110px] flex-shrink-0">Panitia</div>
              <div className="w-[141px] flex-shrink-0">Status</div>
              <div className="w-[94px] flex-shrink-0">Rapor</div>
              <div className="w-[24px] flex-shrink-0"></div>
            </div>

            <div className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-8 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-[130px] h-[90px] bg-gray-200 rounded overflow-hidden relative flex-shrink-0">
                    {activity.thumbnail && (
                      <Image
                        src={activity.thumbnail || '/placeholder.svg'}
                        alt=""
                        className="w-full h-full object-cover"
                        height={90}
                        width={130}
                      />
                    )}
                    <div className="absolute top-1 left-0 p-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto w-auto hover:bg-transparent"
                        onClick={() =>
                          toggleHighlight(activity.id, activity.is_highlighted)
                        }
                        disabled={updatingHighlightId === activity.id}
                      >
                        <Pin
                          style={{ width: '25px', height: '25px' }}
                          fill={activity.is_highlighted ? '#141718' : 'none'}
                          stroke={
                            activity.is_highlighted ? '#141718' : '#141718'
                          }
                        />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-lg text-gray-500">{activity.name}</p>
                    {activity.description && (
                      <p className="text-base text-gray-500 truncate">
                        {activity.description.length > 39
                          ? activity.description.slice(0, 36) + '...'
                          : activity.description}
                      </p>
                    )}
                  </div>
                  <div className="w-[131px] flex-shrink-0 text-base text-gray-500">
                    {activity.start_date}
                  </div>
                  <div className="w-[110px] flex-shrink-0 flex items-center justify-center text-gray-500">
                    <Link href={`/lembaga/kegiatan/${activity.id}/panitia`}>
                      <Button
                        variant={'outline'}
                        className="rounded-lg text-base"
                      >
                        Panitia
                        <ArrowUpRight />
                      </Button>
                    </Link>
                  </div>
                  <div className="w-[141px] flex-shrink-0 flex items-center justify-start">
                    <span className="inline-flex items-center text-base font-medium text-gray-700">
                      <Circle
                        className="h-3 w-3 mr-2"
                        fill={getStatusColors(activity.status).fill}
                        stroke={getStatusColors(activity.status).stroke}
                      />
                      {activity.status}
                    </span>
                  </div>
                  <div className="w-[94px] flex-shrink-0 flex items-center justify-center text-gray-500">
                    <Link href={`/lembaga/kegiatan/${activity.id}/rapor`}>
                      <Button
                        variant={'outline'}
                        className="rounded-lg text-base"
                      >
                        Lihat
                        <ArrowUpRight />
                      </Button>
                    </Link>
                  </div>
                  <div className="w-[24px] flex-shrink-0 flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="lg" className="p-1">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl min-w-[120px] p-0 overflow-hidden"
                      >
                        <DropdownMenuItem
                          onSelect={() => setEditingActivity(activity)}
                          className="w-full rounded-none cursor-pointer flex items-center gap-3 px-3 py-2 hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Pencil className="text-[#00B7B7] h-4 w-4" />
                          <span className="text-sm">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="mx-0 my-0 h-px bg-gray-200" />
                        <DropdownMenuItem className="w-full rounded-none cursor-pointer flex items-center gap-3 px-3 py-2 hover:bg-gray-100 focus:bg-gray-100">
                          <Trash className="text-[#F16350] h-4 w-4" />
                          <span className="text-sm">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {isLoading && (
              <div className="p-4 text-center text-gray-500">
                Loading activities...
              </div>
            )}

            {isLoading && (
              <div className="p-4 text-center text-gray-500">
                Loading activities...
              </div>
            )}

            {!isLoading && activities.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Aktivitas tidak ditemukan
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={editingActivity !== null}
        onOpenChange={(open) => {
          if (!open) setEditingActivity(null);
        }}
      >
        <DialogContent className="min-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Kegiatan</DialogTitle>
          </DialogHeader>
          {editingActivity && (
            <EditKegiatanForm
              session={session}
              setIsOpen={() => setEditingActivity(null)}
              setActivityList={setActivities}
              kegiatan={editingActivity}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
