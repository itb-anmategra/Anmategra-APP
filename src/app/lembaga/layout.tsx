import { type ReactNode } from "react";

import { type Metadata } from "next";
import { Sidebar } from "../_components/layout/sidebar";
import {getServerAuthSession} from "~/server/auth";

// Metadata
export const metadata: Metadata = {
  title: "Lembaga",
  description: "Anmategra by KM ITB",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const LembagaLayout = async ({
  children 
}:{
  children: ReactNode
}) => {
    const session = await getServerAuthSession();
  return (
    <div>
      <Sidebar session={session}/>
      <div className="ml-[16rem]">
        {children}
      </div>
    </div>
  )
}

export default LembagaLayout