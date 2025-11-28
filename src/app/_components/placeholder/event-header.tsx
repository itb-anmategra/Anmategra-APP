'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import AjuanAsosiasiForm from '~/app/lembaga/profile-kegiatan/_components/ajuan-asosiasi-form';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import type { Session } from 'next-auth';

interface EventHeaderProps {
  title: string;
  organizer: string;
  backgroundImage: string;
  logoImage: string;
  linkDaftar?: string | null;
  ajuanAsosiasi?: boolean;
  session?: Session | null;
}

export function EventHeader({
  title,
  organizer,
  backgroundImage,
  logoImage,
  linkDaftar,
  ajuanAsosiasi,
  session,
}: EventHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmCancel = () => {
    setIsSubmitted(false);
    setResetTrigger((prev) => prev + 1); // Trigger form reset
    setShowConfirmation(false);
    alert('Ajuan berhasil dibatalkan!');
  };

  const isLembaga = session?.user.role === 'lembaga';

  return (
    <div className="mb-8 overflow-hidden rounded-[36px]">
      <div className="relative h-48 sm:*:h-[250px] md:h-[350px]">
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt={title}
            layout="fill"
            objectFit="cover"
            priority
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)',
          }}
        />
        <div className="absolute bottom-0 left-0 flex w-full items-end justify-between px-10 pb-10">
          <div className="flex gap-6">
            <div className="relative h-20 w-20 md:h-32 md:w-32 overflow-hidden rounded-full border-[1px] aspect-square flex-shrink-0 self-center md:self-auto">
              <Image
                src={logoImage}
                alt="Event logo"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 80px, 128px"
              />
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-sm sm:text-xl md:text-3xl font-bold text-white">{title}</h1>
              <p className="text-xs sm:text-lg md:text-2xl font-light text-white">{organizer}</p>
              {!isLembaga && (
                <div className="mt-2 flex flex-1 flex-col justify-end gap-3">
                  {linkDaftar && (
                    <Link href={linkDaftar}>
                      <Button
                        size="lg"
                        className="flex-1 rounded-xl bg-[#00B7B7] text-xs sm:text-lg text-white hover:bg-[#82CBDE] active:bg-[#D9F4F4] max-w-[250px]"
                      >
                        Daftar menjadi Panitia
                      </Button>
                    </Link>
                  )}
                  {ajuanAsosiasi && (
                    <Button
                      size="lg"
                      onClick={() => {
                        if (isSubmitted) {
                          setShowConfirmation(true);
                        } else {
                          setIsOpen(true);
                        }
                      }}
                      className={`flex-1 rounded-xl text-sm sm:text-lg text-white max-w-[250px] flex items-center justify-center gap-2 ${
                        isSubmitted
                          ? 'bg-[#F16350] hover:bg-[#C04F40] active:bg-[#F16350]'
                          : 'bg-[#00B7B7] hover:bg-[#00A3A3] active:bg-[#008F8F]'
                      }`}
                    >
                      {isSubmitted ? (
                        <>
                          <X className="w-5 h-5" />
                          Batalkan Pengajuan
                        </>
                      ) : (
                        'Ajukan Asosiasi'
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form dialog */}
      {ajuanAsosiasi && !isLembaga && (
        <AjuanAsosiasiForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          eventId="123"
          eventName={title}
          eventLogo={logoImage}
          organizationName={organizer}
          onSubmissionSuccess={() => setIsSubmitted(true)}
          resetTrigger={resetTrigger}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent
          className="w-4/5 md:w-712px mx-auto p-6 bg-white rounded-3xl"
          aria-describedby={undefined}
        >
          <div className="text-center">
            <p className="text-lg md:text-xl font-regular text-gray-900 mt-2 mb-2">
              Apakah Anda yakin ingin membatalkan pengajuan asosiasi?
            </p>
          </div>
          <div className="flex gap-5 justify-center">
            <Button
              onClick={() => setShowConfirmation(false)}
              className="px-10 bg-[#F16350] hover:bg-[#E55541] text-white font-medium rounded-xl"
            >
              BATAL
            </Button>
            <Button
              onClick={handleConfirmCancel}
              className="px-10 bg-[#4A6FA5] hover:bg-[#3A5F95] text-white font-medium rounded-xl"
            >
              YAKIN
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
