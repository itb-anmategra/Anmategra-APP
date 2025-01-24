import { ReactNode } from "react";

import { type Metadata } from "next";
import { Sidebar } from "../_components/Sidebar";

// Metadata
export const metadata: Metadata = {
  title: "Lembaga",
  description: "Anmategra by KM ITB",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const LembagaLayout = ({ 
  children 
}:{
  children: ReactNode
}) => {
  return (
    <div>
      <Sidebar />
      <div className="ml-[16rem]">
        {children}
      </div>
    </div>
  )
}

export default LembagaLayout