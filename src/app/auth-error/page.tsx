import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "~/components/ui/button"
import Logo from 'public/logo-anmategra.png'
import MahasiswaSidebar from "~/app/_components/MahasiswaSidebar";
import {useSession} from "next-auth/react";
import {getServerAuthSession} from "~/server/auth";
import AuthErrorComp from "~/app/auth-error/authComp";

export default async function AuthError() {
    const session = await getServerAuthSession()
    return (
        <AuthErrorComp session={session} />
    )
}

