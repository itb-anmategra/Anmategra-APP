"use client"

import { Button } from "~/components/ui/button";
import Link from "next/link";

const CariKepanitiaanButton = () => {
    return (
        <Link href={`/`}>
            <Button 
            className='bg-Blue-Dark hover:bg-Midnight-Blue text-white font-semibold rounded-lg px-8 py-2'>
                Cari Kepanitiaan
            </Button>
        </Link>
    )
};
  
export default CariKepanitiaanButton;