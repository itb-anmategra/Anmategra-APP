import Image from "next/image";
import {Button} from "~/components/ui/button";
import Link from "next/link";

interface EventHeaderProps {
    title: string;
    organizer: string;
    backgroundImage: string;
    logoImage: string;
    linkDaftar?: string | null;
}

export function EventHeader({
                                title,
                                organizer,
                                backgroundImage,
                                logoImage,
                                linkDaftar
                            }: EventHeaderProps) {
    return (
        <div className="mb-8 overflow-hidden rounded-[36px]">
            <div className="relative h-[350px]">
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImage}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
                    }}
                />
                <div className="absolute bottom-0 left-0 flex w-full items-end justify-between px-10 pb-10">
                    <div className="flex gap-6">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-[1px]">
                            <Image
                                src={logoImage}
                                alt="Event logo"
                                fill
                                className="object-cover object-center"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold text-white">{title}</h1>
                            <p className="text-2xl font-light text-white">{organizer}</p>
                            <div className="mt-2 flex flex-1 flex-col justify-end">
                                {linkDaftar ? (
                                    <Link href={linkDaftar}>
                                        <Button
                                            size="lg"
                                            className="flex-1 rounded-xl bg-[#00B7B7] text-lg text-white hover:bg-[#82CBDE] active:bg-[#D9F4F4] max-w-[250px]"
                                        >
                                            Daftar menjadi Panitia
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
