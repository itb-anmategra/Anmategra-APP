"use server"

import React from 'react';
import LandingComp from "~/app/lembaga/landingComp";
import {api} from "~/trpc/server";

export default async function Home() {

  const kepanitiaanTerbaru = await api.landing.getRecentKepanitiaan();
  const kegiatanTerbaru = await api.landing.getRecentEvents();
  const kepanitiaanTerbesar = await api.landing.getTopEvents();

  return (
    <LandingComp data={{kepanitiaanTerbaru, kegiatanTerbaru, kepanitiaanTerbesar}}/>
  );
}
